import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  Clapperboard,
  CreditCard,
  HardDrive,
  Headphones,
  Image as ImageIcon,
  MailCheck,
  ShieldCheck,
  Sparkles,
  Telescope,
  Zap,
} from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SaleTimer from "@/components/shop/SaleTimer";
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
import "./gemini-page.css";

/* ---------------------------------------------------------------- helpers */

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

/* Factual Google AI Pro capabilities (public plan features) */
const FEATURES = [
  { icon: Sparkles, title: "مدل‌های پیشرفته Gemini", text: "دسترسی به جدیدترین مدل‌های Pro با سقف استفاده بسیار بالاتر از نسخه رایگان." },
  { icon: Clapperboard, title: "ساخت ویدیو با Veo 3.1", text: "تولید ویدیو از متن و تصویر با جدیدترین مدل ویدیویی گوگل." },
  { icon: ImageIcon, title: "Nano Banana Pro", text: "تصویرسازی و ادیت عکس پیشرفته — همان ابزاری که به «قاتل فتوشاپ» معروف شد." },
  { icon: HardDrive, title: "۲ ترابایت فضای ابری", text: "فضای Google One برای Drive، Gmail و Photos روی همان جیمیل شما." },
  { icon: Telescope, title: "Deep Research", text: "تحقیق عمیق چندمرحله‌ای با گزارش مستند — مناسب پژوهش و تحلیل." },
  { icon: Zap, title: "Gemini در ابزارهای گوگل", text: "دستیار هوشمند داخل Gmail، Docs و NotebookLM با سقف بالاتر." },
];

const MATRIX: Array<[string, string | boolean, string | boolean]> = [
  ["مدل هوش مصنوعی", "مدل پایه", "مدل‌های Pro با سقف بالا"],
  ["ساخت ویدیو (Veo 3.1)", false, true],
  ["تصویرسازی Nano Banana Pro", "محدود", "کامل"],
  ["Deep Research", "محدود", "گسترده"],
  ["فضای ابری Google One", "۱۵ گیگ", "۲ ترابایت"],
  ["Gemini در Gmail و Docs", false, true],
  ["NotebookLM", "پایه", "سقف بالاتر"],
];

const STEPS = [
  { icon: BadgeCheck, title: "انتخاب پلن و ثبت سفارش", text: "پلن مناسب را انتخاب کنید؛ سفارش در چند ثانیه ثبت می‌شود." },
  { icon: CreditCard, title: "پرداخت با تأیید خودکار", text: "کارت‌به‌کارت؛ سیستم پرداخت را خودکار تأیید می‌کند." },
  { icon: MailCheck, title: "فعال‌سازی روی جیمیل شما", text: "اشتراک روی جیمیل شخصی خودتان فعال می‌شود — نه اکانت اشتراکی." },
  { icon: Headphones, title: "گارانتی و پشتیبانی", text: "آفرهای بلندمدت با ۶۰ روز گارانتی تعویض + پشتیبانی فارسی." },
];

const FAQ_FALLBACK = [
  { question: "اشتراک روی جیمیل خودم فعال می‌شود؟", answer: "بله. Gemini Pro روی جیمیل شخصی شما فعال می‌شود و همه امکانات (Veo، فضای ۲ ترابایتی، Gemini در Gmail/Docs) روی همان اکانت در دسترس است." },
  { question: "تحویل چقدر طول می‌کشد؟", answer: "پرداخت به‌صورت خودکار تأیید می‌شود و فعال‌سازی معمولاً در کوتاه‌ترین زمان ممکن انجام می‌شود؛ جزئیات زمان‌بندی هر پلن در صفحه همان پلن ذکر شده است." },
  { question: "آفرهای ۱۲ و ۱۸ ماهه گارانتی دارند؟", answer: "بله. تمام آفرهای ۱۲ و ۱۸ ماهه شامل ۶۰ روز گارانتی تعویض رایگان هستند؛ شرایط کامل در صفحه شرایط گارانتی آمده است." },
  { question: "تفاوت پلن Owner و Member چیست؟", answer: "در پلن Owner مالکیت Family Group با شماست و لینک فعال‌سازی مستقیم دریافت می‌کنید؛ در Member با دعوت‌نامه به گروه اضافه می‌شوید. هر دو امکانات کامل Gemini Pro را دارند." },
  { question: "پرداخت چگونه است؟", answer: "کارت‌به‌کارت با تأیید خودکار سیستم. اگر اعتبار (موجودی) در حساب داشته باشید، به‌صورت خودکار از مبلغ نهایی کم می‌شود." },
];

const GUIDES = [
  { href: "/blog/kharid-gemini-pro", label: "راهنمای کامل خرید Gemini Pro" },
  { href: "/blog/sakht-video-ba-gemini-veo", label: "آموزش ساخت ویدیو با Veo 3" },
  { href: "/blog/nano-banana-sakht-adit-aks", label: "آموزش ادیت عکس با Nano Banana" },
  { href: "/gemini-offer-terms", label: "شرایط گارانتی آفرهای Gemini" },
];

/* ---------------------------------------------------------------- page */

const GeminiServicePage = () => {
  const { catalog, loading } = useStoreCatalog();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const product = useMemo(
    () => (catalog ? findStoreProduct(catalog.products, "gemini") : undefined),
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

  /* ---------------- GSAP motion system (progressive enhancement) -------- */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let killed = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        await loadScript("/gemini-terms-assets/gsap.min.js");
        await loadScript("/gemini-terms-assets/ScrollTrigger.min.js");
      } catch {
        return; // no libs → page simply stays static (fully visible)
      }
      if (killed || !rootRef.current) return;
      const w = window as any;
      const gsap = w.gsap;
      if (!gsap) return;
      gsap.registerPlugin(w.ScrollTrigger);
      gsap.ticker.lagSmoothing(0);
      const q = (sel: string) => rootRef.current!.querySelectorAll(sel);

      /* hero entrance — premium stagger, no overshoot */
      const heroTl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q(".gmx-hero__brand"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
        .fromTo(q(".gmx-hero h1"), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.25")
        .fromTo(q(".gmx-hero__lead"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.4")
        .fromTo(q(".gmx-hero__price"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.35")
        .fromTo(q(".gmx-hero__cta"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(q(".gmx-hero__trust"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2")
        .fromTo(
          q(".gmx-glass"),
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
          "-=0.6"
        );
      setTimeout(() => heroTl.progress() < 1 && heroTl.progress(1), 3500);

      /* scroll reveals — once, short, batched */
      w.ScrollTrigger.batch(q("[data-gr]"), {
        start: "top 88%",
        once: true,
        onEnter: (batch: Element[]) =>
          gsap.fromTo(
            batch,
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08, overwrite: true }
          ),
      });

      /* delivery stepper line fills as it scrolls into view (short scrub) */
      const fill = rootRef.current!.querySelector(".gmx-steps__fill");
      if (fill) {
        gsap.fromTo(
          fill,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: ".gmx-steps", start: "top 80%", end: "top 40%", scrub: 0.5 },
          }
        );
      }
      cleanup = () => {
        heroTl.kill();
        w.ScrollTrigger.getAll().forEach((t: any) => t.kill());
      };
    })();
    return () => {
      killed = true;
      cleanup?.();
    };
  }, []);

  /* ---------------- Three.js hero constellation (desktop only) ---------- */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    let raf = 0;
    let renderer: any;
    let killed = false;
    (async () => {
      try {
        await loadScript("/gemini-terms-assets/three.min.js");
      } catch {
        return; // fallback: CSS orb + glass cards carry the visual
      }
      const THREE = (window as any).THREE;
      const canvas = canvasRef.current;
      if (!THREE || !canvas || killed) return;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
      } catch {
        return; // WebGL unavailable → CSS fallback
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 60);
      camera.position.set(0, 0, 14);

      const COUNT = 420;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const palette = [new THREE.Color(0x4796e3), new THREE.Color(0x9168c0), new THREE.Color(0xd96570)];
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        const color = palette[i % 3];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size: 0.09,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let mouseX = 0;
      let mouseY = 0;
      const onMove = (event: PointerEvent) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const resize = () => {
        const host = canvas.parentElement!;
        renderer.setSize(host.clientWidth, host.clientHeight, false);
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);
      resize();

      /* render only while the hero is on screen and the tab is visible */
      let inView = true;
      const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting));
      io.observe(canvas);

      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!inView || document.hidden) return;
        points.rotation.y += 0.0009;
        points.rotation.x += (mouseY * 0.14 - points.rotation.x) * 0.03;
        points.position.x += (mouseX * 1.4 - points.position.x) * 0.03;
        renderer.render(scene, camera);
      };
      tick();
      (renderer as any).__cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
        io.disconnect();
        geometry.dispose();
        material.dispose();
      };
    })();
    return () => {
      killed = true;
      cancelAnimationFrame(raf);
      if (renderer) {
        (renderer as any).__cleanup?.();
        renderer.dispose?.();
      }
    };
  }, []);

  /* ---------------- SEO ---------------- */
  const seoTitle = "خرید اکانت Gemini Pro (Google AI Pro) | آفر ۱۲ و ۱۸ ماهه | نوا شاپ";
  const seoDescription = `خرید اکانت جمینای پرو با فعال‌سازی روی جیمیل شما: Veo 3.1، Nano Banana Pro و ۲ ترابایت فضا. ${
    plans.length ? `${plans.length.toLocaleString("fa-IR")} پلن فعال از ${formatToman(minPrice)}. ` : ""
  }گارانتی ۶۰ روزه آفرها و پشتیبانی فارسی.`;
  const jsonLd = [
    createFAQSchema(faqs),
  ];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords="خرید اکانت جمینای, خرید اکانت Gemini Pro, خرید Google AI Pro, آفر ۱۸ ماهه جمینای, قیمت Gemini Pro"
        canonicalUrl="/services/gemini"
        ogType="product"
        jsonLd={jsonLd}
      />
      <div className="gmx min-h-screen bg-background font-vazir" dir="rtl" ref={rootRef}>
        <ShopHeader />

        {/* ================= HERO ================= */}
        <section className="gmx-hero">
          <div className="gmx-hero__aurora" aria-hidden="true" />
          <canvas ref={canvasRef} className="gmx-hero__canvas" aria-hidden="true" />
          <div className="gmx-hero__inner">
            <div>
              <div className="gmx-hero__brand">
                {/* official Gemini asset — do not restyle */}
                <img src="/logos/gemini-2025.svg" alt="لوگوی رسمی Gemini" width={42} height={42} />
                <span>
                  Google Gemini Pro
                  <small>Google AI Pro — نام جدید همین پلن</small>
                </span>
              </div>
              <h1>
                خرید اکانت <span className="gmx-grad">Gemini Pro</span>
                <br />
                روی جیمیل خودتان
              </h1>
              <p className="gmx-hero__lead">
                دسترسی کامل به مدل‌های پیشرفته گوگل، ساخت ویدیو با Veo 3.1، ادیت عکس با
                Nano Banana Pro و ۲ ترابایت فضای ابری — با فعال‌سازی روی جیمیل شخصی شما.
              </p>
              {minPrice > 0 && (
                <div className="gmx-hero__price">
                  شروع قیمت از <b>{formatToman(minPrice)}</b> تومان
                </div>
              )}
              <div className="gmx-hero__cta">
                <a className="gmx-btn gmx-btn--primary" href="#gmx-plans">
                  مشاهده پلن‌ها و خرید
                </a>
                <a className="gmx-btn gmx-btn--ghost" href="/gemini-offer-terms">
                  شرایط گارانتی ۶۰ روزه
                </a>
              </div>
              <div className="gmx-hero__trust">
                <span><ShieldCheck aria-hidden="true" /> گارانتی ۶۰ روزه آفرها</span>
                <span><MailCheck aria-hidden="true" /> فعال‌سازی روی جیمیل شما</span>
                <span><Zap aria-hidden="true" /> پرداخت با تأیید خودکار</span>
                <span><Headphones aria-hidden="true" /> پشتیبانی فارسی</span>
              </div>
            </div>
            <div className="gmx-hero__vis" aria-hidden="true">
              <div className="gmx-orb" />
              <div className="gmx-glass gmx-glass--1">
                <Clapperboard />
                <span>Veo 3.1<small>ساخت ویدیو از متن</small></span>
              </div>
              <div className="gmx-glass gmx-glass--2">
                <ImageIcon />
                <span>Nano Banana Pro<small>ادیت و تصویرسازی</small></span>
              </div>
              <div className="gmx-glass gmx-glass--3">
                <HardDrive />
                <span>۲TB فضای گوگل<small>Drive · Gmail · Photos</small></span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="gmx-section" aria-labelledby="gmx-feats-h">
          <div className="gmx-container">
            <div className="gmx-kicker" data-gr>چه چیزی می‌گیرید؟</div>
            <h2 className="gmx-h2" id="gmx-feats-h" data-gr>همه امکانات Google AI Pro، روی اکانت خودتان</h2>
            <p className="gmx-sub" data-gr>این‌ها امکانات رسمی پلن Google AI Pro هستند که بعد از فعال‌سازی روی جیمیل شما در دسترس‌اند.</p>
            <div className="gmx-feats">
              {FEATURES.map((feature) => (
                <div className="gmx-feat" key={feature.title} data-gr>
                  <div className="gmx-feat__ico"><feature.icon aria-hidden="true" /></div>
                  <b>{feature.title}</b>
                  <p>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= COMPARISON ================= */}
        <section className="gmx-section" style={{ paddingTop: 0 }} aria-labelledby="gmx-cmp-h">
          <div className="gmx-container">
            <div className="gmx-kicker" data-gr>رایگان یا Pro؟</div>
            <h2 className="gmx-h2" id="gmx-cmp-h" data-gr>مقایسه Gemini رایگان و Google AI Pro</h2>
            <div className="gmx-matrix" data-gr>
              <table>
                <thead>
                  <tr>
                    <th scope="col">ویژگی</th>
                    <th scope="col">Gemini رایگان</th>
                    <th scope="col" className="gmx-pro">Google AI Pro</th>
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
        <section className="gmx-section" id="gmx-plans" style={{ paddingTop: 8 }} aria-labelledby="gmx-plans-h">
          <div className="gmx-container">
            <div className="gmx-kicker" data-gr>پلن‌ها و قیمت</div>
            <h2 className="gmx-h2" id="gmx-plans-h" data-gr>پلن مناسب خودتان را انتخاب کنید</h2>
            <p className="gmx-sub" data-gr>
              قیمت‌ها لحظه‌ای و مستقیم از فروشگاه خوانده می‌شوند. آفرهای ۱۲ و ۱۸ ماهه شامل{" "}
              <a href="/gemini-offer-terms">گارانتی ۶۰ روز تعویض رایگان</a> هستند.
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
                    <div className="gmx-plans mt-3">
                      {group.plans.map((plan) => (
                  <div className={`gmx-plan ${plan.popular && !plan.out_of_stock ? "gmx-plan--hot" : ""} ${plan.out_of_stock ? "opacity-60 grayscale-[30%]" : ""}`} key={plan.id} data-gr>
                    {plan.out_of_stock ? <span className="gmx-plan__flag" style={{ background: "#64748b" }}>ناموجود</span> : plan.sale && plan.sale.sale_price > 0 ? <span className="gmx-plan__flag">جشنواره {plan.sale.percent.toLocaleString("fa-IR")}٪ تخفیف</span> : plan.popular ? <span className="gmx-plan__flag">پیشنهاد نوا</span> : null}
                    {!plan.out_of_stock && plan.sale && plan.sale.sale_price > 0 && plan.sale.ends_at ? <SaleTimer endsAt={plan.sale.ends_at} className="mt-2" /> : null}
                    <b className="gmx-plan__name">{plan.name}</b>
                    <small className="gmx-plan__dur">{plan.short_description || " "}</small>
                    <div className="gmx-plan__price">
                      {plan.sale && plan.sale.sale_price > 0 && <del style={{ marginInlineEnd: 8, color: "#a6adc4", fontSize: 12 }}>{formatToman(plan.price)}</del>}<b>{formatToman(planEffectivePrice(plan))}</b> تومان
                    </div>
                    <ul>
                      {(plan.features || []).slice(0, 4).map((feature: string) => (
                        <li key={feature}><Check aria-hidden="true" /><span>{feature}</span></li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="gmx-btn gmx-btn--primary disabled:opacity-50 disabled:cursor-not-allowed"
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
        <section className="gmx-section" aria-labelledby="gmx-steps-h">
          <div className="gmx-container">
            <div className="gmx-kicker" data-gr>از خرید تا فعال‌سازی</div>
            <h2 className="gmx-h2" id="gmx-steps-h" data-gr>تحویل چطور انجام می‌شود؟</h2>
            <p className="gmx-sub" data-gr>کل مسیر شفاف است — همان چیزی که هزاران سفارش قبلی طی کرده‌اند.</p>
            <div className="gmx-steps">
              <div className="gmx-steps__line" aria-hidden="true"><div className="gmx-steps__fill" /></div>
              {STEPS.map((step) => (
                <div className="gmx-step" key={step.title} data-gr>
                  <div className="gmx-step__dot"><step.icon aria-hidden="true" /></div>
                  <b>{step.title}</b>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= GUARANTEE ================= */}
        <section className="gmx-section" style={{ paddingTop: 0 }}>
          <div className="gmx-container">
            <div className="gmx-guar" data-gr>
              <div className="gmx-guar__badge"><div><b>۶۰</b><small>روز گارانتی</small></div></div>
              <div>
                <h3>خیالتان در دو ماه اول کاملاً راحت باشد</h3>
                <p>
                  اگر در ۶۰ روز اول برای اکانت آفرهای ۱۲ و ۱۸ ماهه مشکلی پیش بیاید که قابل رفع نباشد،
                  بدون هزینه اکانت جایگزین می‌گیرید. جزئیات کامل در{" "}
                  <a href="/gemini-offer-terms">صفحه شرایط گارانتی</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="gmx-section" style={{ paddingTop: 0 }} aria-labelledby="gmx-faq-h">
          <div className="gmx-container" style={{ maxWidth: 820 }}>
            <div className="gmx-kicker" data-gr>سوالات پرتکرار</div>
            <h2 className="gmx-h2" id="gmx-faq-h" data-gr>قبل از خرید بدانید</h2>
            <div className="gmx-faq" style={{ marginTop: 18 }}>
              {faqs.map((faq) => (
                <details key={faq.question} data-gr>
                  <summary>
                    {faq.question}
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <div className="gmx-faq__a">{faq.answer}</div>
                </details>
              ))}
            </div>
            <div className="gmx-hero__cta" style={{ justifyContent: "center", marginTop: 28 }}>
              <a className="gmx-btn gmx-btn--primary" href="#gmx-plans">انتخاب پلن و خرید</a>
              <a className="gmx-btn gmx-btn--ghost" href="https://t.me/Nova_Ai_Support" target="_blank" rel="noopener noreferrer" style={{ color: "#101527", borderColor: "#d7dcef", background: "#fff" }}>
                سوال دارم — پشتیبانی
              </a>
            </div>
          </div>
        </section>

        {/* ================= GUIDES ================= */}
        <section className="gmx-section" style={{ paddingTop: 0 }} aria-labelledby="gmx-guides-h">
          <div className="gmx-container">
            <div className="gmx-kicker" data-gr>بیشتر بخوانید</div>
            <h2 className="gmx-h2" id="gmx-guides-h" data-gr>راهنماهای Gemini</h2>
            <div className="gmx-guides" style={{ marginTop: 16 }}>
              {GUIDES.map((guide) => (
                <Link className="gmx-guide" to={guide.href} key={guide.href} data-gr>
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

export default GeminiServicePage;
