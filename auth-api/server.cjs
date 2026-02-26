'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const PORT = Number(process.env.PORT || 4010);
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const DATA_FILE = process.env.AUTH_DATA_FILE || '/var/www/novashop/auth-api/data.json';
const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 600);
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 24 * 30);
const FROM_EMAIL = process.env.AUTH_FROM_EMAIL || 'admin@nova-shop.co';
const FROM_NAME = process.env.AUTH_FROM_NAME || 'Nova Shop';
const SENDMAIL_PATH = process.env.SENDMAIL_PATH || '/usr/sbin/sendmail';
const ADMIN_EMAILS = new Set(
  String(process.env.AUTH_ADMIN_EMAILS || 'admin@nova-shop.co')
    .split(',')
    .map((email) => normalizeEmail(email))
    .filter(Boolean),
);
const ORDER_STATUSES = new Set(['pending', 'processing', 'completed', 'cancelled', 'refunded']);

const state = loadState();
persistState();

function loadState() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      otps: Array.isArray(parsed.otps) ? parsed.otps : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch (_error) {
    return {
      users: [],
      otps: [],
      sessions: [],
      orders: [],
    };
  }
}

function persistState() {
  const dir = path.dirname(DATA_FILE);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function cleanupExpired() {
  const now = Date.now();
  state.otps = state.otps.filter((item) => Number(item.expiresAt) > now);
  state.sessions = state.sessions.filter((item) => Number(item.expiresAt) > now);
}

function json(res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(body);
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) out[key] = value;
  }
  return out;
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function generateOtpCode() {
  return String(crypto.randomInt(100000, 999999));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1024 * 64) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (_error) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function findUserByEmail(email) {
  return state.users.find((user) => user.email === email) || null;
}

function createUser(email, fullName) {
  const user = {
    id: crypto.randomUUID(),
    email,
    fullName: fullName || null,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };
  state.users.push(user);
  return user;
}

function updateUserAfterLogin(user, fullName) {
  if (!user.fullName && fullName) {
    user.fullName = fullName;
  }
  user.lastLoginAt = new Date().toISOString();
}

function createSession(userId, ip, userAgent) {
  const token = crypto.randomBytes(48).toString('base64url');
  const tokenHash = sha256(`${SESSION_SECRET}:${token}`);
  const session = {
    id: crypto.randomUUID(),
    userId,
    tokenHash,
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
    ip,
    userAgent,
  };
  state.sessions.push(session);
  return token;
}

function buildSetCookie(token) {
  return `nova_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`;
}

function buildClearCookie() {
  return 'nova_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}

function resolveUserFromRequest(req) {
  cleanupExpired();
  const cookies = parseCookies(req.headers.cookie || '');
  const rawToken = cookies.nova_auth;
  if (!rawToken) return null;

  const tokenHash = sha256(`${SESSION_SECRET}:${rawToken}`);
  const session = state.sessions.find((item) => item.tokenHash === tokenHash);
  if (!session) return null;

  const user = state.users.find((item) => item.id === session.userId) || null;
  if (!user) return null;

  return { user, session };
}

function removeSessionByToken(rawToken) {
  if (!rawToken) return;
  const tokenHash = sha256(`${SESSION_SECRET}:${rawToken}`);
  state.sessions = state.sessions.filter((item) => item.tokenHash !== tokenHash);
}

function normalizeText(value, maxLength = 300) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizePrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) {
    return null;
  }
  return Math.round(price);
}

function isAdminUser(user) {
  const email = normalizeEmail(user?.email || '');
  return ADMIN_EMAILS.has(email);
}

function normalizeOrderStatus(value) {
  const status = String(value || '').trim().toLowerCase();
  return ORDER_STATUSES.has(status) ? status : null;
}

function sendOtpEmail(to, code, mode) {
  const subject = mode === 'signup' ? 'Nova Shop signup verification code' : 'Nova Shop login verification code';
  const lines = [
    `From: ${FROM_NAME} <${FROM_EMAIL}>`,
    `To: <${to}>`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    '',
    'Nova Shop verification code',
    '---------------------------',
    `Your one-time code: ${code}`,
    `This code expires in ${Math.floor(OTP_TTL_SECONDS / 60)} minutes.`,
    '',
    'If you do not see this in Inbox, check Spam/Junk folder as well.',
    '',
    'If this request was not from you, ignore this email.',
    '',
    'Nova Shop',
  ];

  const message = `${lines.join('\n')}\n`;
  const result = spawnSync(SENDMAIL_PATH, ['-t', '-f', FROM_EMAIL], {
    input: message,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    throw new Error(stderr || 'sendmail failed');
  }
}

function badRequest(res, message, status = 400) {
  json(res, status, { error: message });
}

function ok(res, payload, headers = {}) {
  json(res, 200, payload, headers);
}

function notFound(res) {
  json(res, 404, { error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  try {
    cleanupExpired();

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (req.method === 'GET' && pathname === '/health') {
      ok(res, { status: 'ok' });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/auth/session') {
      const identity = resolveUserFromRequest(req);
      if (!identity) {
        ok(res, { user: null });
        return;
      }
      ok(res, { user: identity.user });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/auth/orders') {
      const identity = resolveUserFromRequest(req);
      if (!identity) {
        badRequest(res, 'ابتدا وارد حساب کاربری شوید', 401);
        return;
      }

      const orders = state.orders
        .filter((order) => order.userId === identity.user.id)
        .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));

      ok(res, { orders });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/auth/orders/admin') {
      const identity = resolveUserFromRequest(req);
      if (!identity) {
        badRequest(res, 'ابتدا وارد حساب کاربری شوید', 401);
        return;
      }

      if (!isAdminUser(identity.user)) {
        badRequest(res, 'دسترسی غیرمجاز', 403);
        return;
      }

      const orders = state.orders
        .slice()
        .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));

      ok(res, { orders });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/orders') {
      const identity = resolveUserFromRequest(req);
      if (!identity) {
        badRequest(res, 'ابتدا وارد حساب کاربری شوید', 401);
        return;
      }

      const body = await readBody(req);

      const serviceId = normalizeText(body.serviceId, 80);
      const serviceName = normalizeText(body.serviceName, 120);
      const planId = normalizeText(body.planId, 80);
      const planName = normalizeText(body.planName, 120);
      const planDuration = normalizeText(body.planDuration, 60);
      const notes = normalizeText(body.notes, 500);
      const price = normalizePrice(body.price);

      if (!serviceId || !serviceName || !planName || price === null) {
        badRequest(res, 'اطلاعات سفارش کامل نیست');
        return;
      }

      const now = new Date().toISOString();
      const order = {
        id: `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        userId: identity.user.id,
        userEmail: identity.user.email,
        userFullName: identity.user.fullName || null,
        serviceId,
        serviceName,
        planId: planId || null,
        planName,
        planDuration: planDuration || null,
        price,
        currency: 'IRR',
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        notes: notes || null,
        source: 'website',
      };

      state.orders.push(order);
      persistState();

      ok(res, {
        message: 'سفارش شما با موفقیت ثبت شد',
        order,
      });
      return;
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/auth/orders/admin/')) {
      const identity = resolveUserFromRequest(req);
      if (!identity) {
        badRequest(res, 'ابتدا وارد حساب کاربری شوید', 401);
        return;
      }

      if (!isAdminUser(identity.user)) {
        badRequest(res, 'دسترسی غیرمجاز', 403);
        return;
      }

      const orderId = pathname.replace('/api/auth/orders/admin/', '').trim();
      if (!orderId) {
        badRequest(res, 'شناسه سفارش نامعتبر است');
        return;
      }

      const body = await readBody(req);
      const hasStatus = Object.prototype.hasOwnProperty.call(body, 'status');
      const hasNotes = Object.prototype.hasOwnProperty.call(body, 'notes');

      if (!hasStatus && !hasNotes) {
        badRequest(res, 'حداقل یک فیلد برای بروزرسانی ارسال کنید');
        return;
      }

      const nextStatus = hasStatus ? normalizeOrderStatus(body.status) : null;
      if (hasStatus && !nextStatus) {
        badRequest(res, 'وضعیت سفارش نامعتبر است');
        return;
      }

      const nextNotes = hasNotes ? normalizeText(body.notes, 500) : null;

      const order = state.orders.find((item) => item.id === orderId);
      if (!order) {
        badRequest(res, 'سفارش یافت نشد', 404);
        return;
      }

      if (nextStatus) {
        order.status = nextStatus;
      }
      if (hasNotes) {
        order.notes = nextNotes || null;
      }
      order.updatedAt = new Date().toISOString();

      persistState();

      ok(res, {
        message: 'سفارش بروزرسانی شد',
        order,
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/request-otp') {
      const body = await readBody(req);
      const email = normalizeEmail(body.email);
      const mode = body.mode === 'signup' ? 'signup' : 'login';
      const fullName = String(body.fullName || '').trim() || null;

      if (!email || !email.includes('@') || !email.includes('.')) {
        badRequest(res, 'ایمیل معتبر وارد کنید');
        return;
      }

      const user = findUserByEmail(email);

      if (mode === 'login' && !user) {
        badRequest(res, 'برای این ایمیل حسابی یافت نشد. ابتدا ثبت‌نام کنید.', 404);
        return;
      }

      if (mode === 'signup' && user) {
        badRequest(res, 'این ایمیل قبلا ثبت شده است. از بخش ورود استفاده کنید.', 409);
        return;
      }

      const now = Date.now();
      const latestOtp = state.otps
        .filter((item) => item.email === email)
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))[0];

      if (latestOtp && now - Number(latestOtp.createdAt) < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
        badRequest(res, 'کد قبلا ارسال شده است. یک دقیقه بعد دوباره تلاش کنید.', 429);
        return;
      }

      const code = generateOtpCode();
      const salt = crypto.randomBytes(16).toString('hex');
      const otp = {
        id: crypto.randomUUID(),
        email,
        mode,
        codeHash: sha256(`${salt}:${code}`),
        salt,
        fullName,
        attempts: 0,
        createdAt: now,
        expiresAt: now + OTP_TTL_SECONDS * 1000,
      };

      state.otps = state.otps.filter((item) => item.email !== email);
      state.otps.push(otp);

      sendOtpEmail(email, code, mode);
      persistState();

      ok(res, {
        message: 'کد تایید ارسال شد. لطفا Inbox و پوشه Spam/Junk را بررسی کنید.',
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/verify-otp') {
      const body = await readBody(req);
      const email = normalizeEmail(body.email);
      const token = String(body.token || '').trim();

      if (!email || !token) {
        badRequest(res, 'ایمیل و کد تایید الزامی است');
        return;
      }

      const otp = state.otps.find((item) => item.email === email);
      if (!otp) {
        badRequest(res, 'کد معتبر پیدا نشد. دوباره درخواست کد بدهید.', 404);
        return;
      }

      if (Date.now() > Number(otp.expiresAt)) {
        state.otps = state.otps.filter((item) => item.id !== otp.id);
        persistState();
        badRequest(res, 'کد منقضی شده است. دوباره درخواست کد بدهید.', 410);
        return;
      }

      otp.attempts += 1;
      const tokenHash = sha256(`${otp.salt}:${token}`);
      if (tokenHash !== otp.codeHash) {
        if (otp.attempts >= OTP_MAX_ATTEMPTS) {
          state.otps = state.otps.filter((item) => item.id !== otp.id);
        }
        persistState();
        badRequest(res, 'کد وارد شده صحیح نیست', 401);
        return;
      }

      state.otps = state.otps.filter((item) => item.id !== otp.id);

      let user = findUserByEmail(email);
      if (!user) {
        user = createUser(email, otp.fullName);
      }
      updateUserAfterLogin(user, otp.fullName);

      const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '');
      const userAgent = String(req.headers['user-agent'] || '');
      const sessionToken = createSession(user.id, ip, userAgent);

      persistState();

      ok(
        res,
        {
          user,
          message: 'احراز هویت موفق بود',
        },
        {
          'Set-Cookie': buildSetCookie(sessionToken),
        },
      );
      return;
    }

    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      const cookies = parseCookies(req.headers.cookie || '');
      removeSessionByToken(cookies.nova_auth);
      persistState();
      ok(
        res,
        {
          message: 'خروج انجام شد',
        },
        {
          'Set-Cookie': buildClearCookie(),
        },
      );
      return;
    }

    notFound(res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    json(res, 500, { error: message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Nova Shop auth API listening on 127.0.0.1:${PORT}`);
});
