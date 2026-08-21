import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Headset,
  CreditCard,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import SaleTimer from "@/components/shop/SaleTimer";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import {
  useStoreCatalog,
  planEffectivePrice,
  formatToman,
  storeMediaUrl,
  type StorePlan,
  type StoreProduct,
} from "@/hooks/useStoreCatalog";
import {
  ensureNovaSession,
  isNovaGuest,
  novaApi,
  novaUser,
  refreshNovaBalance,
} from "@/lib/novaApi";

/** The site's own checkout — same backend, plans and festivals as the mini
 *  app (one admin panel controls both), rendered for real desktop screens. */

interface DiscountPreview {
  code: string;
  discount_amount: number;
}

const newIdempotencyKey = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `web-${Date.now()}-${Math.random()}`);

const CheckoutPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { catalog, loading } = useStoreCatalog();

  const found = useMemo(() => {
    if (!catalog) return null;
    for (const product of catalog.products) {
      const plan = (product.plans || []).find(
        (item) => String(item.id) === String(planId)
      );
      if (plan) return { product, plan } as { product: StoreProduct; plan: StorePlan };
    }
    return null;
  }, [catalog, planId]);

  const [ready, setReady] = useState(false);
  const [guest, setGuest] = useState(true);
  const [balance, setBalance] = useState(0);
  const [verifiedPhone, setVerifiedPhone] = useState("");

  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<"card" | "support">("card");
  const [useBalance, setUseBalance] = useState(true);
  const [tosAccepted, setTosAccepted] = useState(false);

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<DiscountPreview | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);
  const [codeError, setCodeError] = useState("");

  const [phone, setPhone] = useState("");
  const faDigitsFix = (value: string) =>
    value
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState<"idle" | "sent">("idle");
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpNotice, setOtpNotice] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const idempotencyKey = useRef(newIdempotencyKey());

  useEffect(() => {
    let alive = true;
    ensureNovaSession().then(async (user) => {
      if (!alive) return;
      setReady(true);
      setGuest(isNovaGuest());
      if (user) {
        setVerifiedPhone(user.verified_phone || "");
        setBalance(await refreshNovaBalance());
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const timer = setTimeout(() => setOtpTimer((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const plan = found?.plan;
  const product = found?.product;
  const effective = plan ? planEffectivePrice(plan) : 0;
  const hasSale = !!(plan?.sale && plan.sale.sale_price > 0 && plan.sale.sale_price < plan.price);
  const discountAmount = discount?.discount_amount || 0;
  const afterDiscount = Math.max(0, effective - discountAmount);
  const balanceCut = useBalance ? Math.min(balance, afterDiscount) : 0;
  const payable = Math.max(0, afterDiscount - balanceCut);
  const requiresPhone = !!product?.requires_phone_verification;
  const tos = (plan as StorePlan & { tos?: { required?: boolean; text?: string; link_label?: string; link_url?: string } })?.tos;
  const needsTos = !!(tos && tos.required !== false && (tos.text || tos.link_url));

  const applyCode = async () => {
    if (!plan || !code.trim()) return;
    setCodeBusy(true);
    setCodeError("");
    try {
      const data = await novaApi<{ discount: DiscountPreview }>(
        "/api/v1/discounts/validate",
        {
          method: "POST",
          body: JSON.stringify({ code: code.trim(), plan_id: plan.id }),
        }
      );
      setDiscount(data.discount);
    } catch (err) {
      setDiscount(null);
      setCodeError(err instanceof Error ? err.message : "کد معتبر نیست");
    } finally {
      setCodeBusy(false);
    }
  };

  const sendOtp = async () => {
    setOtpBusy(true);
    setOtpNotice("");
    try {
      const data = await novaApi<{ cooldown: number }>("/api/v1/phone/request-code", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      setOtpStep("sent");
      setOtpTimer(Number(data.cooldown) || 90);
      setOtpNotice("کد ۵ رقمی پیامک شد");
    } catch (err) {
      setOtpNotice(err instanceof Error ? err.message : "ارسال کد ممکن نشد");
    } finally {
      setOtpBusy(false);
    }
  };

  const verifyOtp = async () => {
    setOtpBusy(true);
    setOtpNotice("");
    try {
      const data = await novaApi<{ phone: string }>("/api/v1/phone/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code: otp }),
      });
      setVerifiedPhone(data.phone);
      setOtpStep("idle");
    } catch (err) {
      setOtpNotice(err instanceof Error ? err.message : "کد درست نیست");
    } finally {
      setOtpBusy(false);
    }
  };

  const submit = async () => {
    if (!plan) return;
    setError("");
    if (guest && !telegram.trim()) {
      setError("آیدی تلگرام برای هماهنگی و تحویل سفارش لازم است");
      return;
    }
    if (needsTos && !tosAccepted) {
      setError("برای ادامه باید شرایط این پلن را بپذیرید");
      return;
    }
    if (requiresPhone && !verifiedPhone) {
      setError("برای این محصول ابتدا شماره موبایل خود را تأیید کنید");
      return;
    }
    setSubmitting(true);
    try {
      const data = await novaApi<{ order: { public_id: string } }>("/api/v1/orders", {
        method: "POST",
        headers: { "X-Idempotency-Key": idempotencyKey.current },
        body: JSON.stringify({
          plan_id: plan.id,
          payment_method: payment,
          customer_email: email.trim(),
          customer_telegram: telegram.trim(),
          note: note.trim(),
          discount_code: discount?.code || "",
          use_balance: useBalance && balance > 0,
        }),
      });
      navigate(`/order/${encodeURIComponent(data.order.public_id)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت سفارش ممکن نشد");
      idempotencyKey.current = newIdempotencyKey();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !ready) {
    return (
      <div className="nv-scope min-h-screen">
        <ShopHeader />
        <main className="pt-40 pb-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" aria-label="در حال بارگذاری" />
        </main>
      </div>
    );
  }

  if (plan && plan.out_of_stock) {
    return (
      <div className="nv-scope min-h-screen">
        <ShopHeader />
        <main className="pt-40 pb-24 text-center px-4">
          <h1 className="text-2xl font-black mb-3">این پلن فعلاً ناموجود است</h1>
          <p className="text-muted-foreground mb-6">به‌زودی دوباره شارژ می‌شود؛ کمی بعد سر بزنید.</p>
          <Link to="/" className="text-accent font-bold hover:underline">بازگشت به فروشگاه</Link>
        </main>
        <ShopFooter />
      </div>
    );
  }

  if (!plan || !product) {
    return (
      <div className="nv-scope min-h-screen">
        <ShopHeader />
        <main className="pt-40 pb-24 text-center px-4">
          <h1 className="text-2xl font-black mb-3">این پلن در دسترس نیست</h1>
          <p className="text-muted-foreground mb-6">شاید موجودی تمام شده یا پلن تغییر کرده باشد.</p>
          <Link to="/" className="text-accent font-bold hover:underline">بازگشت به فروشگاه</Link>
        </main>
        <ShopFooter />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`خرید ${plan.name} — ${product.name} | نوا شاپ`}
        description={`تکمیل خرید ${plan.name} از ${product.name} با پرداخت امن و تحویل سریع.`}
        canonicalUrl={`/checkout/${plan.id}`}
      />
      <div className="nv-scope min-h-screen">
        <ShopHeader />
        <main className="pt-28 md:pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8" aria-label="مسیر">
              <Link to="/" className="hover:text-foreground">فروشگاه</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground font-medium">تکمیل خرید</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
              {/* ---------------- form ---------------- */}
              <div className="space-y-5">
                <section className="rounded-2xl bg-card border border-border/70 p-6">
                  <h1 className="text-xl font-black mb-5">اطلاعات سفارش</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guest && (
                      <div>
                        <label className="block text-sm font-bold mb-2" htmlFor="co-telegram">
                          آیدی تلگرام <span className="text-accent">*</span>
                          <span className="block text-xs font-normal text-muted-foreground mt-0.5">برای هماهنگی و تحویل سفارش لازم است</span>
                        </label>
                        <input
                          id="co-telegram"
                          dir="ltr"
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                          placeholder="@username"
                          value={telegram}
                          onChange={(event) => setTelegram(event.target.value)}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-bold mb-2" htmlFor="co-email">
                        ایمیل / جیمیل
                        <span className="block text-xs font-normal text-muted-foreground mt-0.5">برای فعال‌سازی و اطلاع‌رسانی سریع‌تر</span>
                      </label>
                      <input
                        id="co-email"
                        dir="ltr"
                        type="email"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  </div>

                  {requiresPhone && (
                    <div className="mt-5">
                      {verifiedPhone ? (
                        <div>
                          <p className="text-sm font-bold mb-3 text-emerald-600">
                            تأیید شماره موبایل <span className="text-xs font-normal text-emerald-600/70">— برای این محصول الزامی است</span>
                          </p>
                          <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-white"
                            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                            <b className="text-sm">شماره تأیید شد</b>
                            <span dir="ltr" className="font-bold tracking-wider">{verifiedPhone}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border p-4">
                          <p className="text-sm font-bold mb-3">
                            تأیید شماره موبایل <span className="text-xs font-normal text-muted-foreground">— برای این محصول الزامی است</span>
                          </p>
                          {otpStep === "idle" ? (
                            <div className="flex gap-2">
                              <input
                                dir="ltr"
                                inputMode="tel"
                                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm"
                                placeholder="09121234567"
                                value={phone}
                                onChange={(event) => setPhone(faDigitsFix(event.target.value))}
                              />
                              <button
                                type="button"
                                onClick={sendOtp}
                                disabled={otpBusy || phone.length < 10}
                                className="rounded-xl bg-accent text-accent-foreground px-5 text-sm font-bold disabled:opacity-50"
                              >
                                {otpBusy ? "..." : "دریافت کد"}
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center flex-wrap">
                              <input
                                dir="ltr"
                                inputMode="numeric"
                                maxLength={6}
                                className="w-36 rounded-xl border border-border bg-background px-4 py-3 text-sm tracking-widest"
                                placeholder="کد ۵ رقمی"
                                value={otp}
                                onChange={(event) => setOtp(event.target.value)}
                              />
                              <button
                                type="button"
                                onClick={verifyOtp}
                                disabled={otpBusy || otp.length < 4}
                                className="rounded-xl bg-accent text-accent-foreground px-5 py-3 text-sm font-bold disabled:opacity-50"
                              >
                                تأیید کد
                              </button>
                              <button
                                type="button"
                                onClick={sendOtp}
                                disabled={otpTimer > 0 || otpBusy}
                                className="text-xs text-accent font-bold disabled:text-muted-foreground"
                              >
                                ارسال مجدد {otpTimer > 0 ? `(${otpTimer})` : ""}
                              </button>
                            </div>
                          )}
                          {otpNotice && <p className="text-xs text-muted-foreground mt-2">{otpNotice}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-5">
                    <label className="block text-sm font-bold mb-2" htmlFor="co-note">توضیحات سفارش <span className="text-xs font-normal text-muted-foreground">— اختیاری</span></label>
                    <textarea
                      id="co-note"
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder="اگر نکته‌ای دارید بنویسید..."
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </div>
                </section>

                <section className="rounded-2xl bg-card border border-border/70 p-6">
                  <h2 className="text-base font-black mb-4">کد تخفیف</h2>
                  <div className="flex gap-2">
                    <input
                      dir="ltr"
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm"
                      placeholder="کد را وارد کنید"
                      value={code}
                      onChange={(event) => setCode(faDigitsFix(event.target.value))}
                    />
                    <button
                      type="button"
                      onClick={applyCode}
                      disabled={codeBusy || !code.trim()}
                      className="rounded-xl border border-accent text-accent px-5 text-sm font-bold disabled:opacity-50"
                    >
                      {codeBusy ? "..." : "اعمال کد"}
                    </button>
                  </div>
                  {discount && (
                    <p className="text-sm text-accent font-bold mt-3 flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4" aria-hidden="true" />
                      کد {discount.code} اعمال شد — {formatToman(discount.discount_amount)} تومان تخفیف
                    </p>
                  )}
                  {codeError && <p className="text-sm text-destructive mt-3">{codeError}</p>}
                </section>

                {balance > 0 && (
                  <section className="rounded-2xl bg-card border border-border/70 p-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useBalance}
                        onChange={(event) => setUseBalance(event.target.checked)}
                        className="w-5 h-5 accent-[#059669]"
                      />
                      <span className="text-sm">
                        <b>استفاده از اعتبار حساب</b> — موجودی: {formatToman(balance)} تومان
                      </span>
                    </label>
                  </section>
                )}

                <section className="rounded-2xl bg-card border border-border/70 p-6">
                  <h2 className="text-base font-black mb-4">روش پرداخت</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayment("card")}
                      className={`rounded-xl border-2 p-4 text-right transition-colors ${payment === "card" ? "border-accent bg-accent/5" : "border-border"}`}
                    >
                      <CreditCard className="w-5 h-5 text-accent mb-2" aria-hidden="true" />
                      <b className="block text-sm">کارت به کارت</b>
                      <span className="text-xs text-muted-foreground">تأیید خودکار و لحظه‌ای در سامانه مرکزی نوا</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment("support")}
                      className={`rounded-xl border-2 p-4 text-right transition-colors ${payment === "support" ? "border-accent bg-accent/5" : "border-border"}`}
                    >
                      <Headset className="w-5 h-5 text-accent mb-2" aria-hidden="true" />
                      <b className="block text-sm">هماهنگی با پشتیبانی</b>
                      <span className="text-xs text-muted-foreground">گفتگو در تلگرام و پرداخت با راهنمایی</span>
                    </button>
                  </div>
                </section>

                {needsTos && (
                  <section className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
                    <label className="flex items-start gap-3 cursor-pointer text-sm leading-7">
                      <input
                        type="checkbox"
                        checked={tosAccepted}
                        onChange={(event) => setTosAccepted(event.target.checked)}
                        className="w-5 h-5 mt-1 accent-[#059669]"
                      />
                      <span>
                        {tos?.text || "شرایط این پلن را می‌پذیرم."}{" "}
                        {tos?.link_url && (
                          <a href={tos.link_url} target="_blank" rel="noreferrer" className="text-accent font-bold underline underline-offset-4">
                            {tos.link_label || "شرایط گارانتی"}
                          </a>
                        )}
                      </span>
                    </label>
                  </section>
                )}
              </div>

              {/* ---------------- summary (the green world) ---------------- */}
              <aside className="lg:sticky lg:top-28">
                <div
                  className="relative overflow-hidden rounded-3xl text-accent-foreground p-6 shadow-[0_32px_64px_-36px_hsl(165_52%_20%/0.7)]"
                  style={{ background: "hsl(165 52% 33%)" }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden="true"
                    style={{
                      background:
                        "radial-gradient(420px 220px at 12% -10%, hsl(92 74% 68% / 0.22), transparent 62%), radial-gradient(380px 220px at 95% 115%, hsl(165 60% 22% / 0.85), transparent 60%)",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      {plan.image_url || product.image_url ? (
                        <img
                          src={storeMediaUrl(plan.image_url || product.image_url)}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1.5"
                        />
                      ) : null}
                      <div>
                        <p className="font-black">{product.name}</p>
                        <p className="text-sm text-accent-foreground/75">{plan.name}</p>
                      </div>
                    </div>

                    {hasSale && (
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <p className="text-xs font-bold bg-primary text-primary-foreground rounded-full px-3 py-1">
                          جشنواره ٪{plan.sale!.percent.toLocaleString("fa-IR")} تخفیف
                        </p>
                        <SaleTimer endsAt={plan.sale!.ends_at} tone="dark" />
                      </div>
                    )}

                    <dl className="space-y-2.5 text-sm border-t border-white/15 pt-4">
                      <div className="flex justify-between">
                        <dt className="text-accent-foreground/75">قیمت پلن</dt>
                        <dd className={hasSale ? "line-through text-accent-foreground/50" : "font-bold"}>
                          {formatToman(plan.price)} تومان
                        </dd>
                      </div>
                      {hasSale && (
                        <div className="flex justify-between">
                          <dt className="text-accent-foreground/75">قیمت جشنواره</dt>
                          <dd className="font-bold">{formatToman(effective)} تومان</dd>
                        </div>
                      )}
                      {discountAmount > 0 && (
                        <div className="flex justify-between">
                          <dt className="text-accent-foreground/75">کد تخفیف</dt>
                          <dd className="font-bold">− {formatToman(discountAmount)}</dd>
                        </div>
                      )}
                      {balanceCut > 0 && (
                        <div className="flex justify-between">
                          <dt className="text-accent-foreground/75">اعتبار حساب</dt>
                          <dd className="font-bold">− {formatToman(balanceCut)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between items-baseline border-t border-white/15 pt-3">
                        <dt className="font-black">مبلغ قابل پرداخت</dt>
                        <dd className="font-black text-2xl">
                          {formatToman(payable)} <span className="text-sm font-bold">تومان</span>
                        </dd>
                      </div>
                    </dl>

                    {error && (
                      <p className="mt-4 text-sm bg-white/10 border border-white/20 rounded-xl px-4 py-3">{error}</p>
                    )}

                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="mt-5 w-full rounded-xl bg-primary text-primary-foreground font-black py-4 text-base hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : null}
                      {payable === 0 ? "ثبت سفارش رایگان" : "ثبت سفارش و دریافت اطلاعات پرداخت"}
                    </button>

                    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] text-accent-foreground/80">
                      <span className="flex flex-col items-center gap-1"><Zap className="w-4 h-4 text-primary" aria-hidden="true" />تحویل سریع</span>
                      <span className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />گارانتی تعویض</span>
                      <span className="flex flex-col items-center gap-1"><BadgeCheck className="w-4 h-4 text-primary" aria-hidden="true" />تأیید خودکار</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/services/${product.slug === "adm_item_ff9df3" ? "claude" : product.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  بازگشت و تغییر پلن
                </Link>
              </aside>
            </div>
          </div>
        </main>
        <ShopFooter />
      </div>
    </>
  );
};

export default CheckoutPage;
