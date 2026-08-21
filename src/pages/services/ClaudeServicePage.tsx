import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BookOpen,
  Braces,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  FolderKanban,
  Headphones,
  MailCheck,
  ShieldCheck,
  Sparkles,
  Telescope,
  TerminalSquare,
  Zap,
} from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import {
  createFAQSchema,
} from "@/components/seo/schemas";
import {
  findStoreProduct,
  formatToman,
  planEffectivePrice,
  storeMinPrice,
  useStoreCatalog,
  groupStorePlans,
} from "@/hooks/useStoreCatalog";
import "./claude-page.css";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if ((existing as HTMLScriptElement).dataset.loaded === "1") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => {
      el.dataset.loaded = "1";
      resolve();
    };
    el.onerror = () => reject(new Error(`load failed: ${src}`));
    document.head.appendChild(el);
  });

/* Factual Claude Pro capabilities (public plan features) */
const FEATURES = [
  { icon: Sparkles, title: "جدیدترین مدل‌های Claude", text: "دسترسی به مدل‌های Sonnet و Opus با سقف استفاده چند برابر نسخه رایگان." },
  { icon: TerminalSquare, title: "Claude Code", text: "ایجنت کدنویسی در ترمینال — پروژه را می‌فهمد، ویرایش می‌کند و کامل می‌کند." },
  { icon: FileText, title: "متن‌های بسیار بلند", text: "پنجره متنی ۲۰۰ هزار توکنی؛ تحلیل اسناد و کدبیس‌های بزرگ در یک گفت‌وگو." },
  { icon: Braces, title: "Artifacts", text: "ساخت و ویرایش زنده کد، صفحه وب و سند در پنل کنار گفت‌وگو." },
  { icon: FolderKanban, title: "Projects", text: "سازمان‌دهی گفت‌وگوها با دانش و دستورالعمل اختصاصی هر پروژه." },
  { icon: Telescope, title: "Research و اتصال‌ها", text: "جست‌وجوی وب و تحقیق چندمرحله‌ای با اتصال به ابزارهای کاری." },
];

const MATRIX: Array<[string, string | boolean, string | boolean]> = [
  ["مدل هوش مصنوعی", "مدل پایه", "Sonnet و Opus"],
  ["سقف استفاده", "محدود", "چند برابر بیشتر"],
  ["Claude Code", false, true],
  ["Projects و Artifacts", "محدود", "کامل"],
  ["Research (تحقیق عمیق)", false, true],
  ["اولویت در ساعات شلوغ", false, true],
];

const STEPS = [
  { icon: BadgeCheck, title: "انتخاب پلن و ثبت سفارش", text: "Pro برای استفاده حرفه‌ای، Max برای سنگین‌کارها." },
  { icon: CreditCard, title: "پرداخت با تأیید خودکار", text: "کارت‌به‌کارت؛ سیستم پرداخت را خودکار تأیید می‌کند." },
  { icon: MailCheck, title: "تحویل و فعال‌سازی", text: "اطلاعات اکانت در صفحه سفارش و ربات تلگرام تحویل می‌شود." },
  { icon: Headphones, title: "گارانتی و پشتیبانی", text: "گارانتی طول دوره طبق پلن + پشتیبانی فارسی." },
];

const FAQ_FALLBACK = [
  { question: "Claude برای چه کارهایی بهتر از بقیه است؟", answer: "کلود در کدنویسی، تحلیل متن‌های بلند و نوشتن دقیق شهرت دارد؛ با Claude Code می‌توانید کل یک پروژه نرم‌افزاری را به آن بسپارید و پنجره ۲۰۰ هزار توکنی آن برای اسناد بزرگ عالی است." },
  { question: "تفاوت پلن Pro و Max چیست؟", answer: "Pro برای استفاده حرفه‌ای روزانه کافی است؛ Max سقف استفاده چند برابری (5x یا بیشتر) برای کاربران سنگین مثل توسعه‌دهنده‌هایی که مدام با Claude Code کار می‌کنند دارد." },
  { question: "تحویل چقدر طول می‌کشد؟", answer: "پرداخت به‌صورت خودکار تأیید می‌شود و تحویل معمولاً در کوتاه‌ترین زمان انجام می‌شود؛ جزئیات هر پلن در صفحه همان پلن ذکر شده است." },
  { question: "پرداخت چگونه است؟", answer: "کارت‌به‌کارت با تأیید خودکار سیستم. اگر اعتبار (موجودی) در حساب داشته باشید، خودکار از مبلغ نهایی کم می‌شود." },
  { question: "اگر مشکلی پیش بیاید چه؟", answer: "هر پلن گارانتی مخصوص خودش را دارد و پشتیبانی فارسی نوا در تلگرام پاسخگوی شماست." },
];

const GUIDES = [
  { href: "/blog/kharid-claude-pro", label: "راهنمای خرید Claude Pro" },
  { href: "/blog/claude-code-chist-amoozesh-farsi", label: "Claude Code چیست؟ آموزش فارسی" },
  { href: "/blog/chatgpt-vs-gemini-vs-claude", label: "مقایسه ChatGPT، Gemini و Claude" },
  { href: "/categories/dev-ai", label: "ابزارهای کدنویسی هوش مصنوعی" },
];

const ClaudeServicePage = () => {
  const { catalog, loading } = useStoreCatalog();
  const rootRef = useRef<HTMLDivElement>(null);

  const product = useMemo(
    () => (catalog ? findStoreProduct(catalog.products, "claude") : undefined),
    [catalog]
  );

  const planGroups = useMemo(() => groupStorePlans(product), [product]);
  const plans = useMemo(() => planGroups.flatMap((group) => group.plans), [planGroups]);

  const faqs = useMemo(() => {
    const blocks = (product?.content_blocks || []).filter(
      (block) => block && block.enabled !== false && block.type === "faq"
    );
    const live = blocks.flatMap((block) =>
      (block.items || [])
        .map((item) => {
          const parts = String(item).split(/\s*(?:::|\|)\s*/);
          const question = parts.shift() || "";
          return { question, answer: parts.join(" — ") };
        })
        .filter((faq) => faq.question && faq.answer)
    );
    return live.length ? live : FAQ_FALLBACK;
  }, [product]);

  const minPrice = product ? storeMinPrice(product) : 0;

  const goCheckout = (planId: number | string) => {
    window.location.assign(`/checkout/${encodeURIComponent(String(planId))}`);
  };

  /* GSAP motion — gsap.context + revert (gsap-react pattern) */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let killed = false;
    let ctx: any;
    (async () => {
      try {
        await loadScript("/gemini-terms-assets/gsap.min.js");
        await loadScript("/gemini-terms-assets/ScrollTrigger.min.js");
      } catch {
        return;
      }
      if (killed || !rootRef.current) return;
      const w = window as any;
      const gsap = w.gsap;
      if (!gsap) return;
      gsap.registerPlugin(w.ScrollTrigger);
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        const heroTl = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".clx-hero__brand", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
          .fromTo(".clx-hero h1", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.25")
          .fromTo(".clx-hero__lead", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.4")
          .fromTo(".clx-hero__price", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.35")
          .fromTo(".clx-hero__cta", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
          .fromTo(".clx-hero__trust", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2")
          .fromTo(
            ".clx-logo-stage",
            { scale: 0.85, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.9 },
            "-=0.75"
          )
          .fromTo(".clx-chip", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, "-=0.5");
        setTimeout(() => heroTl.progress() < 1 && heroTl.progress(1), 3500);

        /* pause the CSS sway/pulse off-screen (battery) */
        const stage = rootRef.current!.querySelector<HTMLElement>(".clx-logo-stage");
        if (stage) {
          w.ScrollTrigger.create({
            trigger: stage,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self: any) => {
              stage.querySelectorAll<HTMLElement>(".clx-logo-mark, .clx-logo-glow").forEach((el) => {
                el.style.animationPlayState = self.isActive ? "running" : "paused";
              });
            },
          });
        }

        w.ScrollTrigger.batch(rootRef.current!.querySelectorAll("[data-gr]"), {
          start: "top 88%",
          once: true,
          onEnter: (batch: Element[]) =>
            gsap.fromTo(
              batch,
              { y: 26, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08, overwrite: true }
            ),
        });

        gsap.fromTo(
          ".clx-steps__fill",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: ".clx-steps", start: "top 80%", end: "top 40%", scrub: 0.5 },
          }
        );
      }, rootRef);
    })();
    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  const seoTitle = "خرید اکانت Claude Pro و Max | اشتراک Anthropic با تحویل سریع | نوا شاپ";
  const seoDescription = `خرید اکانت کلود (Claude Pro و Max): بهترین هوش مصنوعی برای کدنویسی با Claude Code و تحلیل متن‌های بلند. ${
    plans.length ? `${plans.length.toLocaleString("fa-IR")} پلن فعال از ${formatToman(minPrice)} تومان. ` : ""
  }گارانتی و پشتیبانی فارسی.`;
  const jsonLd = [
    createFAQSchema(faqs),
  ];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords="خرید اکانت کلود, خرید اکانت Claude, خرید Claude Pro, خرید Claude Max, اکانت Anthropic, Claude Code"
        canonicalUrl="/services/claude"
        ogType="product"
        jsonLd={jsonLd}
      />
      <div className="clx min-h-screen bg-background font-vazir" dir="rtl" ref={rootRef}>
        <ShopHeader />

        {/* ================= HERO ================= */}
        <section className="clx-hero">
          <div className="clx-hero__aurora" aria-hidden="true" />
          <div className="clx-hero__inner">
            <div>
              <div className="clx-hero__brand">
                {/* official Anthropic starburst — untouched */}
                <img src="/logos/claude-mark.svg" alt="لوگوی رسمی Claude" width={38} height={38} />
                <span>
                  Anthropic Claude
                  <small>Pro · Max — انتخاب اول برنامه‌نویس‌ها</small>
                </span>
              </div>
              <h1>
                خرید اکانت <span className="clx-accent">Claude</span>
                <br />
                برای کار جدی و کدنویسی
              </h1>
              <p className="clx-hero__lead">
                دسترسی به مدل‌های Sonnet و Opus، ایجنت کدنویسی Claude Code و تحلیل
                اسناد بلند با پنجره ۲۰۰ هزار توکنی — با تحویل سریع و پشتیبانی فارسی.
              </p>
              {minPrice > 0 && (
                <div className="clx-hero__price">
                  شروع قیمت از <b>{formatToman(minPrice)}</b> تومان
                </div>
              )}
              <div className="clx-hero__cta">
                <a className="clx-btn clx-btn--primary" href="#clx-plans">
                  مشاهده پلن‌ها و خرید
                </a>
                <a className="clx-btn clx-btn--ghost" href="https://t.me/Nova_Ai_Support" target="_blank" rel="noopener noreferrer">
                  مشاوره قبل از خرید
                </a>
              </div>
              <div className="clx-hero__trust">
                <span><Zap aria-hidden="true" /> تحویل سریع</span>
                <span><ShieldCheck aria-hidden="true" /> گارانتی طول دوره</span>
                <span><CreditCard aria-hidden="true" /> پرداخت با تأیید خودکار</span>
                <span><Headphones aria-hidden="true" /> پشتیبانی فارسی</span>
              </div>
            </div>
            <div className="clx-hero__vis" aria-hidden="true">
              <div className="clx-logo-stage">
                <div className="clx-logo-glow" />
                {/* official starburst mark — sway animation per ai-logo-motion */}
                <img className="clx-logo-mark" src="/logos/claude-mark.svg" alt="" width={200} height={200} />
                <div className="clx-chip clx-chip--1">
                  <TerminalSquare />
                  <span>Claude Code<small>ایجنت کدنویسی</small></span>
                </div>
                <div className="clx-chip clx-chip--2">
                  <FileText />
                  <span>۲۰۰K توکن<small>متن‌های بسیار بلند</small></span>
                </div>
                <div className="clx-chip clx-chip--3">
                  <Braces />
                  <span>Artifacts<small>ساخت زنده کد و صفحه</small></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="clx-section" aria-labelledby="clx-feats-h">
          <div className="clx-container">
            <div className="clx-kicker" data-gr>چه چیزی می‌گیرید؟</div>
            <h2 className="clx-h2" id="clx-feats-h" data-gr>همه امکانات Claude Pro</h2>
            <p className="clx-sub" data-gr>امکانات رسمی اشتراک Pro و Max که بعد از تحویل در اختیار شماست.</p>
            <div className="clx-feats">
              {FEATURES.map((feature) => (
                <div className="clx-feat" key={feature.title} data-gr>
                  <div className="clx-feat__ico"><feature.icon aria-hidden="true" /></div>
                  <b>{feature.title}</b>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= COMPARISON ================= */}
        <section className="clx-section" style={{ paddingTop: 0 }} aria-labelledby="clx-cmp-h">
          <div className="clx-container">
            <div className="clx-kicker" data-gr>رایگان یا Pro؟</div>
            <h2 className="clx-h2" id="clx-cmp-h" data-gr>مقایسه Claude رایگان و Pro</h2>
            <div className="clx-matrix" data-gr>
              <table>
                <thead>
                  <tr>
                    <th scope="col">ویژگی</th>
                    <th scope="col">رایگان</th>
                    <th scope="col" className="clx-pro">Claude Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map(([feature, free, pro]) => (
                    <tr key={feature}>
                      <td>{feature}</td>
                      <td>{typeof free === "boolean" ? (free ? <span className="yes">✓</span> : <span className="no">—</span>) : <span className="no">{free}</span>}</td>
                      <td>{typeof pro === "boolean" ? (pro ? <span className="pro">✓</span> : <span className="no">—</span>) : <span className="pro">{pro}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= PLANS ================= */}
        <section className="clx-section" id="clx-plans" style={{ paddingTop: 8 }} aria-labelledby="clx-plans-h">
          <div className="clx-container">
            <div className="clx-kicker" data-gr>پلن‌ها و قیمت</div>
            <h2 className="clx-h2" id="clx-plans-h" data-gr>پلن مناسب خودتان را انتخاب کنید</h2>
            <p className="clx-sub" data-gr>
              قیمت‌ها لحظه‌ای و مستقیم از فروشگاه خوانده می‌شوند — Pro برای استفاده
              حرفه‌ای روزانه، Max برای کار سنگین با Claude Code.
            </p>
            {loading && !plans.length ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              </div>
            ) : (
              <div>
                {planGroups.map((group) => (
                  <div key={group.id} className="mb-10">
                    {group.title ? <h3 className="text-lg font-black mb-1">{group.title}</h3> : null}
                    {group.description ? <p className="text-sm text-muted-foreground mb-3">{group.description}</p> : null}
                    <div className="clx-plans mt-3">
                      {group.plans.map((plan) => (
                  <div className={`clx-plan ${plan.popular ? "clx-plan--hot" : ""}`} key={plan.id} data-gr>
                    {plan.sale && plan.sale.sale_price > 0 ? (
                      <span className="clx-plan__flag">جشنواره {plan.sale.percent.toLocaleString("fa-IR")}٪ تخفیف</span>
                    ) : plan.popular ? (
                      <span className="clx-plan__flag">پیشنهاد نوا</span>
                    ) : null}
                    <b className="clx-plan__name">{plan.name}</b>
                    <small className="clx-plan__dur">{plan.short_description || " "}</small>
                    <div className="clx-plan__price">
                      {plan.sale && plan.sale.sale_price > 0 && (
                        <del style={{ marginInlineEnd: 8, color: "#a6adc4", fontSize: 12 }}>{formatToman(plan.price)}</del>
                      )}
                      <b>{formatToman(planEffectivePrice(plan))}</b> تومان
                    </div>
                    <ul>
                      {(plan.features || []).slice(0, 4).map((feature: string) => (
                        <li key={feature}><Check aria-hidden="true" /><span>{feature}</span></li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="clx-btn clx-btn--primary disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={plan.out_of_stock}
                      onClick={() => goCheckout(plan.id)}
                    >
                      {plan.out_of_stock ? "ناموجود — به‌زودی شارژ می‌شود" : "خرید این پلن"}
                    </button>
                  </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= DELIVERY STEPS ================= */}
        <section className="clx-section" aria-labelledby="clx-steps-h">
          <div className="clx-container">
            <div className="clx-kicker" data-gr>از خرید تا استفاده</div>
            <h2 className="clx-h2" id="clx-steps-h" data-gr>تحویل چطور انجام می‌شود؟</h2>
            <p className="clx-sub" data-gr>مسیر شفاف — همان فرآیندی که هزاران سفارش قبلی طی کرده‌اند.</p>
            <div className="clx-steps">
              <div className="clx-steps__line" aria-hidden="true"><div className="clx-steps__fill" /></div>
              {STEPS.map((step) => (
                <div className="clx-step" key={step.title} data-gr>
                  <div className="clx-step__dot"><step.icon aria-hidden="true" /></div>
                  <b>{step.title}</b>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="clx-section" style={{ paddingTop: 0 }} aria-labelledby="clx-faq-h">
          <div className="clx-container" style={{ maxWidth: 820 }}>
            <div className="clx-kicker" data-gr>سوالات پرتکرار</div>
            <h2 className="clx-h2" id="clx-faq-h" data-gr>قبل از خرید بدانید</h2>
            <div className="clx-faq" style={{ marginTop: 18 }}>
              {faqs.map((faq) => (
                <details key={faq.question} data-gr>
                  <summary>
                    {faq.question}
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <div className="clx-faq__a">{faq.answer}</div>
                </details>
              ))}
            </div>
            <div className="clx-hero__cta" style={{ justifyContent: "center", marginTop: 28 }}>
              <a className="clx-btn clx-btn--primary" href="#clx-plans">انتخاب پلن و خرید</a>
              <a className="clx-btn clx-btn--ghost" href="https://t.me/Nova_Ai_Support" target="_blank" rel="noopener noreferrer" style={{ color: "#101527", borderColor: "#e7d8ce", background: "#fff" }}>
                سوال دارم — پشتیبانی
              </a>
            </div>
          </div>
        </section>

        {/* ================= GUIDES ================= */}
        <section className="clx-section" style={{ paddingTop: 0 }} aria-labelledby="clx-guides-h">
          <div className="clx-container">
            <div className="clx-kicker" data-gr>بیشتر بخوانید</div>
            <h2 className="clx-h2" id="clx-guides-h" data-gr>راهنماهای Claude</h2>
            <div className="clx-guides" style={{ marginTop: 16 }}>
              {GUIDES.map((guide) => (
                <Link className="clx-guide" to={guide.href} key={guide.href} data-gr>
                  <BookOpen aria-hidden="true" />
                  {guide.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ShopFooter />
      </div>
    </>
  );
};

export default ClaudeServicePage;
