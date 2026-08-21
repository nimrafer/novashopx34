import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  AudioLines,
  BadgeCheck,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  Clapperboard,
  CreditCard,
  FolderKanban,
  Headphones,
  Image as ImageIcon,
  MailCheck,
  ShieldCheck,
  Sparkles,
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
import "./chatgpt-page.css";

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

/* Factual ChatGPT Plus capabilities (public plan features) */
const FEATURES = [
  { icon: Sparkles, title: "جدیدترین مدل‌های GPT", text: "دسترسی به پیشرفته‌ترین مدل‌های OpenAI با سقف پیام بسیار بالاتر از نسخه رایگان." },
  { icon: Clapperboard, title: "ساخت ویدیو با Sora", text: "تولید ویدیو از متن با مدل ویدیویی OpenAI — همراه اشتراک Plus." },
  { icon: ImageIcon, title: "تصویرسازی پیشرفته", text: "ساخت و ویرایش تصویر با جدیدترین مدل تصویری ChatGPT." },
  { icon: AudioLines, title: "مکالمه صوتی پیشرفته", text: "Advanced Voice برای گفت‌وگوی طبیعی صوتی با هوش مصنوعی." },
  { icon: FolderKanban, title: "Projects و حافظه", text: "سازمان‌دهی گفت‌وگوها در پروژه‌ها با فایل و دستورالعمل اختصاصی." },
  { icon: Bot, title: "GPTهای سفارشی", text: "دسترسی به GPT Store و ساخت دستیارهای اختصاصی خودتان." },
];

const MATRIX: Array<[string, string | boolean, string | boolean]> = [
  ["مدل هوش مصنوعی", "مدل پایه", "جدیدترین مدل‌ها"],
  ["سقف پیام", "محدود", "چند برابر بیشتر"],
  ["ساخت ویدیو با Sora", false, true],
  ["تصویرسازی", "محدود", "کامل"],
  ["مکالمه صوتی پیشرفته", "محدود", "کامل"],
  ["Projects و GPTهای سفارشی", false, true],
  ["اولویت در ساعات شلوغ", false, true],
];

const STEPS = [
  { icon: BadgeCheck, title: "انتخاب پلن و ثبت سفارش", text: "اشتراکی اقتصادی یا اختصاصی روی ایمیل خودتان — انتخاب با شما." },
  { icon: CreditCard, title: "پرداخت با تأیید خودکار", text: "کارت‌به‌کارت؛ سیستم پرداخت را خودکار تأیید می‌کند." },
  { icon: MailCheck, title: "تحویل خودکار اکانت", text: "اطلاعات ورود در صفحه سفارش و ربات تلگرام — در پلن‌های اشتراکی با کد ورود امن." },
  { icon: Headphones, title: "گارانتی و پشتیبانی", text: "گارانتی طول دوره طبق پلن + پشتیبانی فارسی." },
];

const FAQ_FALLBACK = [
  { question: "تفاوت اکانت اشتراکی و اختصاصی چیست؟", answer: "در اکانت اختصاصی، اشتراک روی ایمیل شخصی شما فعال می‌شود و فقط خودتان استفاده می‌کنید. در اشتراکی، چند کاربر با ظرفیت مشخص از یک اکانت استفاده می‌کنند و به همین دلیل قیمت بسیار اقتصادی‌تر است؛ ورود با سیستم کد امن نوا انجام می‌شود." },
  { question: "تحویل چقدر طول می‌کشد؟", answer: "پرداخت خودکار تأیید می‌شود و تحویل پلن‌های اشتراکی معمولاً فوری است؛ زمان دقیق هر پلن در صفحه همان پلن ذکر شده است." },
  { question: "ChatGPT Plus چه امکاناتی دارد؟", answer: "دسترسی به جدیدترین مدل‌های OpenAI با سقف بالا، ساخت ویدیو با Sora، تصویرسازی، مکالمه صوتی پیشرفته، Projects و GPTهای سفارشی." },
  { question: "پرداخت چگونه است؟", answer: "کارت‌به‌کارت با تأیید خودکار سیستم. اگر اعتبار (موجودی) در حساب داشته باشید، خودکار از مبلغ نهایی کم می‌شود." },
  { question: "اگر مشکلی پیش بیاید چه؟", answer: "هر پلن گارانتی مخصوص خودش را دارد و پشتیبانی فارسی نوا در تلگرام پاسخگوی شماست؛ در پلن‌های اشتراکی امکان صدور کد ورود مجدد از طرف پشتیبانی وجود دارد." },
];

const GUIDES = [
  { href: "/blog/kharid-chatgpt-plus", label: "راهنمای انتخاب پلن ChatGPT" },
  { href: "/blog/sakht-video-ba-chatgpt-sora", label: "آموزش ساخت ویدیو با Sora" },
  { href: "/blog/gpt5-new-features", label: "همه چیز درباره GPT-5" },
  { href: "/blog/chatgpt-vs-gemini-vs-claude", label: "مقایسه ChatGPT، Gemini و Claude" },
];

const ChatGPTServicePage = () => {
  const { catalog, loading } = useStoreCatalog();
  const rootRef = useRef<HTMLDivElement>(null);

  const product = useMemo(
    () => (catalog ? findStoreProduct(catalog.products, "chatgpt") : undefined),
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

  /* GSAP motion system — gsap.context + revert (gsap-react pattern) */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let killed = false;
    let ctx: any;
    (async () => {
      try {
        await loadScript("/gemini-terms-assets/gsap.min.js");
        await loadScript("/gemini-terms-assets/ScrollTrigger.min.js");
      } catch {
        return; // CSS keyframes remain as the motion layer
      }
      if (killed || !rootRef.current) return;
      const w = window as any;
      const gsap = w.gsap;
      if (!gsap) return;
      gsap.registerPlugin(w.ScrollTrigger);
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        /* hero entrance — logo reveal per ai-logo-motion (no bounce) */
        const heroTl = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".cgx-hero__brand", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
          .fromTo(".cgx-hero h1", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.25")
          .fromTo(".cgx-hero__lead", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.4")
          .fromTo(".cgx-hero__price", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.35")
          .fromTo(".cgx-hero__cta", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
          .fromTo(".cgx-hero__trust", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2")
          .fromTo(
            ".cgx-logo-stage",
            { scale: 0.82, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.9 },
            "-=0.75"
          )
          .fromTo(".cgx-chip", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, "-=0.5");
        setTimeout(() => heroTl.progress() < 1 && heroTl.progress(1), 3500);

        /* the CSS keyframe spin keeps running; pause it off-screen to save power */
        const mark = rootRef.current!.querySelector<HTMLElement>(".cgx-logo-mark");
        if (mark) {
          w.ScrollTrigger.create({
            trigger: mark,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self: any) => {
              mark.style.animationPlayState = self.isActive ? "running" : "paused";
            },
          });
        }

        /* scroll reveals */
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

        /* stepper progress */
        gsap.fromTo(
          ".cgx-steps__fill",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: ".cgx-steps", start: "top 80%", end: "top 40%", scrub: 0.5 },
          }
        );
      }, rootRef);
    })();
    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  const seoTitle = "خرید اکانت ChatGPT | پلن‌های Plus، Go و Team با تحویل فوری | نوا شاپ";
  const seoDescription = `خرید اکانت چت جی پی تی (ChatGPT Plus، Go و Team) اشتراکی و اختصاصی با تحویل خودکار، دسترسی به Sora و جدیدترین مدل‌ها. ${
    plans.length ? `${plans.length.toLocaleString("fa-IR")} پلن فعال از ${formatToman(minPrice)} تومان. ` : ""
  }پشتیبانی فارسی و گارانتی.`;
  const jsonLd = [
    createFAQSchema(faqs),
  ];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords="خرید اکانت چت جی پی تی, خرید اکانت ChatGPT, خرید ChatGPT Plus, اکانت chatgpt اشتراکی, خرید chatgpt team, قیمت ChatGPT Plus"
        canonicalUrl="/services/chatgpt"
        ogType="product"
        jsonLd={jsonLd}
      />
      <div className="cgx min-h-screen bg-background font-vazir" dir="rtl" ref={rootRef}>
        <ShopHeader />

        {/* ================= HERO ================= */}
        <section className="cgx-hero">
          <div className="cgx-hero__aurora" aria-hidden="true" />
          <div className="cgx-hero__inner">
            <div>
              <div className="cgx-hero__brand">
                {/* official OpenAI/ChatGPT tile — untouched */}
                <img src="/logos/chatgpt.svg" alt="لوگوی رسمی ChatGPT" width={40} height={40} style={{ borderRadius: 10 }} />
                <span>
                  OpenAI ChatGPT
                  <small>Plus · Go · Team — اشتراکی و اختصاصی</small>
                </span>
              </div>
              <h1>
                خرید اکانت <span className="cgx-grad">ChatGPT</span>
                <br />
                با تحویل خودکار
              </h1>
              <p className="cgx-hero__lead">
                دسترسی به جدیدترین مدل‌های OpenAI، ساخت ویدیو با Sora، تصویرسازی و مکالمه
                صوتی پیشرفته — با پلن‌های اشتراکیِ اقتصادی یا اختصاصی روی ایمیل خودتان.
              </p>
              {minPrice > 0 && (
                <div className="cgx-hero__price">
                  شروع قیمت از <b>{formatToman(minPrice)}</b> تومان
                </div>
              )}
              <div className="cgx-hero__cta">
                <a className="cgx-btn cgx-btn--primary" href="#cgx-plans">
                  مشاهده پلن‌ها و خرید
                </a>
                <a className="cgx-btn cgx-btn--ghost" href="https://t.me/Nova_Ai_Support" target="_blank" rel="noopener noreferrer">
                  مشاوره قبل از خرید
                </a>
              </div>
              <div className="cgx-hero__trust">
                <span><Zap aria-hidden="true" /> تحویل خودکار و فوری</span>
                <span><ShieldCheck aria-hidden="true" /> گارانتی طول دوره</span>
                <span><CreditCard aria-hidden="true" /> پرداخت با تأیید خودکار</span>
                <span><Headphones aria-hidden="true" /> پشتیبانی فارسی</span>
              </div>
            </div>
            <div className="cgx-hero__vis" aria-hidden="true">
              <div className="cgx-logo-stage">
                <div className="cgx-logo-glow" />
                <div className="cgx-logo-ring" />
                <div className="cgx-logo-orbit"><i /><i /><i /></div>
                {/* official knot mark (mono-white official usage) — animated per ai-logo-motion */}
                <img className="cgx-logo-mark" src="/logos/chatgpt-knot.svg" alt="" width={210} height={210} />
                <div className="cgx-chip cgx-chip--1">
                  <Clapperboard />
                  <span>Sora<small>ساخت ویدیو از متن</small></span>
                </div>
                <div className="cgx-chip cgx-chip--2">
                  <AudioLines />
                  <span>Advanced Voice<small>مکالمه صوتی طبیعی</small></span>
                </div>
                <div className="cgx-chip cgx-chip--3">
                  <Sparkles />
                  <span>GPT-5<small>جدیدترین مدل‌ها</small></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="cgx-section" aria-labelledby="cgx-feats-h">
          <div className="cgx-container">
            <div className="cgx-kicker" data-gr>چه چیزی می‌گیرید؟</div>
            <h2 className="cgx-h2" id="cgx-feats-h" data-gr>همه امکانات ChatGPT Plus</h2>
            <p className="cgx-sub" data-gr>امکانات رسمی اشتراک Plus که بعد از تحویل در اختیار شماست.</p>
            <div className="cgx-feats">
              {FEATURES.map((feature) => (
                <div className="cgx-feat" key={feature.title} data-gr>
                  <div className="cgx-feat__ico"><feature.icon aria-hidden="true" /></div>
                  <b>{feature.title}</b>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= COMPARISON ================= */}
        <section className="cgx-section" style={{ paddingTop: 0 }} aria-labelledby="cgx-cmp-h">
          <div className="cgx-container">
            <div className="cgx-kicker" data-gr>رایگان یا Plus؟</div>
            <h2 className="cgx-h2" id="cgx-cmp-h" data-gr>مقایسه ChatGPT رایگان و Plus</h2>
            <div className="cgx-matrix" data-gr>
              <table>
                <thead>
                  <tr>
                    <th scope="col">ویژگی</th>
                    <th scope="col">رایگان</th>
                    <th scope="col" className="cgx-pro">ChatGPT Plus</th>
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
        <section className="cgx-section" id="cgx-plans" style={{ paddingTop: 8 }} aria-labelledby="cgx-plans-h">
          <div className="cgx-container">
            <div className="cgx-kicker" data-gr>پلن‌ها و قیمت</div>
            <h2 className="cgx-h2" id="cgx-plans-h" data-gr>پلن مناسب خودتان را انتخاب کنید</h2>
            <p className="cgx-sub" data-gr>
              قیمت‌ها لحظه‌ای و مستقیم از فروشگاه خوانده می‌شوند — اشتراکی برای صرفه اقتصادی،
              اختصاصی برای استفاده کاملاً شخصی، و Team برای کسب‌وکارها.
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
                    <div className="cgx-plans mt-3">
                      {group.plans.map((plan) => (
                  <div className={`cgx-plan ${plan.popular ? "cgx-plan--hot" : ""}`} key={plan.id} data-gr>
                    {plan.sale && plan.sale.sale_price > 0 ? <span className="cgx-plan__flag">جشنواره {plan.sale.percent.toLocaleString("fa-IR")}٪ تخفیف</span> : plan.popular ? <span className="cgx-plan__flag">پیشنهاد نوا</span> : null}
                    <b className="cgx-plan__name">{plan.name}</b>
                    <small className="cgx-plan__dur">{plan.short_description || " "}</small>
                    <div className="cgx-plan__price">
                      {plan.sale && plan.sale.sale_price > 0 && <del style={{ marginInlineEnd: 8, color: "#a6adc4", fontSize: 12 }}>{formatToman(plan.price)}</del>}<b>{formatToman(planEffectivePrice(plan))}</b> تومان
                    </div>
                    <ul>
                      {(plan.features || []).slice(0, 4).map((feature: string) => (
                        <li key={feature}><Check aria-hidden="true" /><span>{feature}</span></li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="cgx-btn cgx-btn--primary disabled:opacity-50 disabled:cursor-not-allowed"
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
        <section className="cgx-section" aria-labelledby="cgx-steps-h">
          <div className="cgx-container">
            <div className="cgx-kicker" data-gr>از خرید تا استفاده</div>
            <h2 className="cgx-h2" id="cgx-steps-h" data-gr>تحویل چطور انجام می‌شود؟</h2>
            <p className="cgx-sub" data-gr>مسیر شفاف — همان فرآیندی که هزاران سفارش قبلی طی کرده‌اند.</p>
            <div className="cgx-steps">
              <div className="cgx-steps__line" aria-hidden="true"><div className="cgx-steps__fill" /></div>
              {STEPS.map((step) => (
                <div className="cgx-step" key={step.title} data-gr>
                  <div className="cgx-step__dot"><step.icon aria-hidden="true" /></div>
                  <b>{step.title}</b>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="cgx-section" style={{ paddingTop: 0 }} aria-labelledby="cgx-faq-h">
          <div className="cgx-container" style={{ maxWidth: 820 }}>
            <div className="cgx-kicker" data-gr>سوالات پرتکرار</div>
            <h2 className="cgx-h2" id="cgx-faq-h" data-gr>قبل از خرید بدانید</h2>
            <div className="cgx-faq" style={{ marginTop: 18 }}>
              {faqs.map((faq) => (
                <details key={faq.question} data-gr>
                  <summary>
                    {faq.question}
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <div className="cgx-faq__a">{faq.answer}</div>
                </details>
              ))}
            </div>
            <div className="cgx-hero__cta" style={{ justifyContent: "center", marginTop: 28 }}>
              <a className="cgx-btn cgx-btn--primary" href="#cgx-plans">انتخاب پلن و خرید</a>
              <a className="cgx-btn cgx-btn--ghost" href="https://t.me/Nova_Ai_Support" target="_blank" rel="noopener noreferrer" style={{ color: "#101527", borderColor: "#d5e2dc", background: "#fff" }}>
                سوال دارم — پشتیبانی
              </a>
            </div>
          </div>
        </section>

        {/* ================= GUIDES ================= */}
        <section className="cgx-section" style={{ paddingTop: 0 }} aria-labelledby="cgx-guides-h">
          <div className="cgx-container">
            <div className="cgx-kicker" data-gr>بیشتر بخوانید</div>
            <h2 className="cgx-h2" id="cgx-guides-h" data-gr>راهنماهای ChatGPT</h2>
            <div className="cgx-guides" style={{ marginTop: 16 }}>
              {GUIDES.map((guide) => (
                <Link className="cgx-guide" to={guide.href} key={guide.href} data-gr>
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

export default ChatGPTServicePage;
