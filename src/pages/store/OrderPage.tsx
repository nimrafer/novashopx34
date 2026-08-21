import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  Headset,
  Loader2,
  PackageCheck,
} from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import { formatToman } from "@/hooks/useStoreCatalog";
import { ensureNovaSession, novaApi } from "@/lib/novaApi";

/** Site-native order page: payment instructions with automatic verification
 *  polling, then the delivered credentials — no detour into the mini app. */

interface OrderPayment {
  type: "card" | "verified" | "support" | "expired";
  automated?: boolean;
  card_number?: string;
  card_owner?: string;
  payable_amount_toman?: number;
  remaining_seconds?: number | null;
  instructions?: string;
  support_url?: string;
}

interface OrderPayload {
  username?: string;
  password?: string;
  totp?: string;
  subscription_url?: string;
  config_url?: string;
  link?: string;
  note?: string;
  description?: string;
}

/** Admin-authored delivery blocks — the same schema the mini app renders, so
 *  instructions written once in the panel appear identically on both surfaces. */
interface DeliveryBlock {
  id?: string;
  type: string;
  enabled?: boolean;
  title?: string;
  body?: string;
  url?: string;
  button_label?: string;
  username?: string;
  password?: string;
  items?: { title?: string; description?: string; url?: string }[];
}

interface OrderData {
  public_id: string;
  status: string;
  subtotal: number;
  discount: number;
  balance_used: number;
  total: number;
  payment_method: string;
  created_at: string;
  items: { product_name: string; plan_name: string }[];
  payment?: OrderPayment;
  delivery?: {
    status: string;
    title: string;
    subtitle: string;
    payload: OrderPayload;
    blocks?: DeliveryBlock[];
    message?: string;
  };
  vpn_gift?: {
    status: string;
    label: string;
    volume_gb: number;
    subscription_url: string;
    config_url: string;
  };
}

const STATUS_FA: Record<string, [string, string]> = {
  awaiting_payment: ["در انتظار پرداخت", "bg-amber-100 text-amber-800"],
  payment_review: ["در حال بررسی پرداخت", "bg-blue-100 text-blue-800"],
  paid: ["پرداخت‌شده", "bg-blue-100 text-blue-800"],
  processing: ["در حال انجام", "bg-blue-100 text-blue-800"],
  fulfilled: ["تکمیل‌شده", "bg-emerald-100 text-emerald-800"],
  cancelled: ["لغوشده", "bg-zinc-200 text-zinc-700"],
};

const CopyRow = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <code dir="ltr" className="flex-1 text-sm break-all">{value}</code>
      <button
        type="button"
        aria-label={`کپی ${label}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            /* clipboard blocked */
          }
        }}
        className="text-accent shrink-0"
      >
        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const OrderPage = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [failed, setFailed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout>>();

  const load = useCallback(async () => {
    try {
      const data = await novaApi<{ order: OrderData }>(
        `/api/v1/orders/${encodeURIComponent(publicId || "")}`
      );
      setOrder(data.order);
      if (data.order.payment?.remaining_seconds != null) {
        setCountdown(data.order.payment.remaining_seconds);
      }
      if (["awaiting_payment", "payment_review", "paid", "processing"].includes(data.order.status)) {
        pollRef.current = setTimeout(load, 12000);
      }
    } catch {
      setFailed(true);
    }
  }, [publicId]);

  useEffect(() => {
    ensureNovaSession().then(load);
    return () => clearTimeout(pollRef.current);
  }, [load]);

  useEffect(() => {
    if (countdown == null || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((value) => (value == null ? null : value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const payment = order?.payment;
  const payload = order?.delivery?.payload || {};
  const payloadRows: [string, string | undefined][] = [
    ["نام کاربری", payload.username],
    ["رمز عبور", payload.password],
    ["کد 2FA", payload.totp],
    ["لینک اشتراک", payload.subscription_url],
    ["لینک کانفیگ", payload.config_url],
    ["لینک تحویل", payload.link],
  ];
  const [statusLabel, statusClass] = order
    ? STATUS_FA[order.status] || [order.status, "bg-zinc-100 text-zinc-700"]
    : ["", ""];

  return (
    <>
      <SEOHead title={`سفارش ${publicId} | نوا شاپ`} description="پیگیری سفارش نوا شاپ" canonicalUrl={`/order/${publicId}`} />
      <div className="nv-scope min-h-screen">
        <ShopHeader />
        <main className="pt-28 md:pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8" aria-label="مسیر">
              <Link to="/" className="hover:text-foreground">فروشگاه</Link>
              <span aria-hidden="true">/</span>
              <Link to="/orders" className="hover:text-foreground">سفارش‌های من</Link>
              <span aria-hidden="true">/</span>
              <span dir="ltr" className="text-foreground font-medium">{publicId}</span>
            </nav>

            {failed && (
              <div className="rounded-2xl bg-card border border-border p-8 text-center">
                <h1 className="text-xl font-black mb-2">سفارش پیدا نشد</h1>
                <p className="text-muted-foreground text-sm mb-5">شاید این سفارش متعلق به حساب دیگری باشد.</p>
                <Link to="/orders" className="text-accent font-bold hover:underline">مشاهده سفارش‌های من</Link>
              </div>
            )}

            {!order && !failed && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent" aria-label="در حال بارگذاری" />
              </div>
            )}

            {order && (
              <div className="space-y-5">
                <section className="rounded-2xl bg-card border border-border/70 p-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h1 className="font-black text-lg">{order.items[0]?.product_name}</h1>
                      <p className="text-sm text-muted-foreground">{order.items[0]?.plan_name}</p>
                    </div>
                    <span className={`text-xs font-bold rounded-full px-3 py-1.5 ${statusClass}`}>{statusLabel}</span>
                  </div>
                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-sm border-t border-border/60 pt-4">
                    <div><dt className="text-xs text-muted-foreground mb-1">کد سفارش</dt><dd dir="ltr" className="font-bold">{order.public_id}</dd></div>
                    <div><dt className="text-xs text-muted-foreground mb-1">مبلغ کل</dt><dd className="font-bold">{formatToman(order.total)} تومان</dd></div>
                    {order.discount > 0 && <div><dt className="text-xs text-muted-foreground mb-1">تخفیف</dt><dd className="font-bold text-accent">{formatToman(order.discount)}</dd></div>}
                    {order.balance_used > 0 && <div><dt className="text-xs text-muted-foreground mb-1">اعتبار مصرفی</dt><dd className="font-bold text-accent">{formatToman(order.balance_used)}</dd></div>}
                  </dl>
                </section>

                {payment?.type === "card" && (
                  <section
                    className="relative overflow-hidden rounded-3xl text-accent-foreground p-6 md:p-8 shadow-[0_32px_64px_-36px_hsl(165_52%_20%/0.7)]"
                    style={{ background: "hsl(165 52% 33%)" }}
                  >
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: "radial-gradient(480px 240px at 12% -10%, hsl(92 74% 68% / 0.22), transparent 62%), radial-gradient(420px 240px at 95% 115%, hsl(165 60% 22% / 0.85), transparent 60%)" }} />
                    <div className="relative">
                      <h2 className="font-black text-lg mb-1">پرداخت کارت به کارت</h2>
                      <p className="text-sm text-accent-foreground/80 mb-5">{payment.instructions}</p>
                      <p className="text-sm text-accent-foreground/75 mb-1">مبلغ دقیق قابل پرداخت</p>
                      <p className="font-black text-3xl mb-5">
                        {formatToman(payment.payable_amount_toman || order.total)} <span className="text-base font-bold">تومان</span>
                      </p>
                      <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
                        <p className="text-xs text-accent-foreground/75 mb-1">شماره کارت — {payment.card_owner}</p>
                        <div className="flex items-center justify-between gap-3">
                          <code dir="ltr" className="text-xl md:text-2xl font-black tracking-[0.15em]">{payment.card_number}</code>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard?.writeText((payment.card_number || "").replace(/\D/g, ""))}
                            className="rounded-lg bg-primary text-primary-foreground text-xs font-bold px-3 py-2"
                          >
                            کپی شماره کارت
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-sm text-accent-foreground/85">
                        <Clock3 className="w-4 h-4 text-primary" aria-hidden="true" />
                        {payment.automated
                          ? countdown != null && countdown > 0
                            ? `تأیید خودکار فعال است — مهلت واریز: ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, "0")}`
                            : "تأیید خودکار فعال است؛ بعد از واریز همین صفحه به‌روز می‌شود"
                          : "بعد از واریز، رسید را برای پشتیبانی بفرستید"}
                      </div>
                    </div>
                  </section>
                )}

                {payment?.type === "support" && (
                  <section className="rounded-2xl bg-card border border-border/70 p-6 text-center">
                    <Headset className="w-8 h-8 text-accent mx-auto mb-3" aria-hidden="true" />
                    <h2 className="font-black mb-2">هماهنگی با پشتیبانی</h2>
                    <p className="text-sm text-muted-foreground mb-4 leading-7">سفارش شما ثبت شد؛ برای پرداخت و تحویل با پشتیبانی در تلگرام گفتگو کنید و کد سفارش را بفرستید.</p>
                    <a href={payment.support_url} target="_blank" rel="noreferrer" className="inline-block rounded-xl bg-accent text-accent-foreground font-bold px-6 py-3 text-sm">گفتگو با پشتیبانی</a>
                  </section>
                )}

                {payment?.type === "verified" && order.status !== "fulfilled" && (
                  <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-accent shrink-0" aria-hidden="true" />
                    <div>
                      <h2 className="font-black">پرداخت تأیید شد</h2>
                      <p className="text-sm text-muted-foreground">سفارش در حال آماده‌سازی است؛ همین صفحه خودکار به‌روز می‌شود.</p>
                    </div>
                  </section>
                )}

                {order.delivery && (
                  <section className="rounded-2xl bg-card border border-border/70 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <PackageCheck className="w-6 h-6 text-accent" aria-hidden="true" />
                      <div>
                        <h2 className="font-black">
                          {order.delivery.title ||
                            (order.delivery.status === "delivered"
                              ? "سفارش شما آماده است"
                              : "سفارش شما در حال آماده‌سازی است")}
                        </h2>
                        {order.delivery.subtitle && <p className="text-sm text-muted-foreground">{order.delivery.subtitle}</p>}
                      </div>
                    </div>

                    {/* Admin-authored instruction blocks — synced with the mini app */}
                    {(order.delivery.blocks || [])
                      .filter((block) => block && block.enabled !== false)
                      .map((block, index) => {
                        const key = block.id || `${block.type}-${index}`;
                        if (block.type === "divider") return <hr key={key} className="my-5 border-border/60" />;
                        if (block.type === "spacer") return <div key={key} className="h-4" aria-hidden="true" />;
                        if (block.type === "payload") {
                          return (
                            <div key={key} className="space-y-2.5 my-4">
                              {block.title && <h3 className="font-bold text-sm mb-2">{block.title}</h3>}
                              {payloadRows.filter(([, value]) => value).map(([label, value]) => (
                                <CopyRow key={label} label={label} value={String(value)} />
                              ))}
                            </div>
                          );
                        }
                        if (block.type === "steps") {
                          return (
                            <div key={key} className="my-4">
                              {block.title && <h3 className="font-bold text-sm mb-3">{block.title}</h3>}
                              <ol className="space-y-2.5">
                                {(block.items || []).map((item, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start gap-3 text-sm leading-7">
                                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                                      {(stepIndex + 1).toLocaleString("fa-IR")}
                                    </span>
                                    <span>
                                      {item.title && <b className="block">{item.title}</b>}
                                      {item.description && <span className="text-muted-foreground">{item.description}</span>}
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          );
                        }
                        if (block.type === "link" && block.url) {
                          return (
                            <div key={key} className="my-4">
                              {block.title && <h3 className="font-bold text-sm mb-1">{block.title}</h3>}
                              {block.body && <p className="text-sm text-muted-foreground leading-7 mb-2 whitespace-pre-line">{block.body}</p>}
                              <a href={block.url} target="_blank" rel="noreferrer" className="inline-block rounded-xl bg-accent text-accent-foreground text-sm font-bold px-5 py-2.5">
                                {block.button_label || "باز کردن لینک"}
                              </a>
                            </div>
                          );
                        }
                        if (block.type === "code") {
                          const code = payload.config_url || block.body || "";
                          return code ? (
                            <div key={key} className="my-4">
                              {block.title && <h3 className="font-bold text-sm mb-2">{block.title}</h3>}
                              <CopyRow label="کد / کانفیگ" value={code} />
                            </div>
                          ) : null;
                        }
                        if ((block.type === "image" || block.type === "gif") && block.url) {
                          return (
                            <figure key={key} className="my-4">
                              {block.title && <h3 className="font-bold text-sm mb-2">{block.title}</h3>}
                              <img src={block.url} alt={block.title || "راهنمای تحویل"} loading="lazy" className="w-full rounded-xl border border-border/60" />
                            </figure>
                          );
                        }
                        if (block.type === "credentials") {
                          return (
                            <div key={key} className="space-y-2.5 my-4">
                              {block.title && <h3 className="font-bold text-sm mb-2">{block.title}</h3>}
                              {payload.username || block.username ? <CopyRow label="نام کاربری" value={String(payload.username || block.username)} /> : null}
                              {payload.password || block.password ? <CopyRow label="رمز عبور" value={String(payload.password || block.password)} /> : null}
                            </div>
                          );
                        }
                        // text and anything unknown-but-texty
                        return block.title || block.body ? (
                          <div key={key} className="rounded-xl bg-background border border-border/60 p-4 my-3">
                            {block.title && <h3 className="font-bold text-sm mb-1.5">{block.title}</h3>}
                            {block.body && <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line">{block.body}</p>}
                          </div>
                        ) : null;
                      })}

                    {/* Default payload section when the plan has no payload block */}
                    {!(order.delivery.blocks || []).some((block) => block.type === "payload") && (
                      <div className="space-y-2.5">
                        {payloadRows.filter(([, value]) => value).map(([label, value]) => (
                          <CopyRow key={label} label={label} value={String(value)} />
                        ))}
                      </div>
                    )}
                    {(payload.description || payload.note) && (
                      <p className="text-sm text-muted-foreground leading-7 mt-4 whitespace-pre-line">
                        {[payload.description, payload.note].filter(Boolean).join("\n")}
                      </p>
                    )}
                  </section>
                )}

                {order.vpn_gift && order.vpn_gift.status === "delivered" && (
                  <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                    <h2 className="font-black mb-1">🎁 {order.vpn_gift.label || "هدیه VPN شما"}</h2>
                    <p className="text-sm text-muted-foreground leading-7 mb-4">
                      به‌خاطر خریدتان، {order.vpn_gift.volume_gb.toLocaleString("fa-IR")} گیگ VPN هدیه گرفتید. لینک زیر را در برنامه V2Ray (مثل v2rayNG یا Streisand) وارد کنید.
                    </p>
                    <div className="space-y-2.5">
                      {order.vpn_gift.subscription_url && <CopyRow label="لینک اشتراک" value={order.vpn_gift.subscription_url} />}
                      {order.vpn_gift.config_url && <CopyRow label="کانفیگ مستقیم" value={order.vpn_gift.config_url} />}
                    </div>
                  </section>
                )}

                <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  همه سفارش‌های من
                </Link>
              </div>
            )}
          </div>
        </main>
        <ShopFooter />
      </div>
    </>
  );
};

export default OrderPage;
