import ServiceCard from "./ServiceCard";
import { usePricesContext } from "@/contexts/PricesContext";

// Logo paths
const logos = {
  chatgpt: "/logos/chatgpt.png",
  gemini: "/logos/gemini.png",
  grok: "/logos/grok.png",
  claude: "/logos/claude.png",
  perplexity: "/logos/perplexity.png",
  spotify: "/logos/spotify.png",
  cursor: "/logos/cursor.png",
  telegram: "/logos/telegram.png",
};

const ServicesSection = () => {
  const { getPrice } = usePricesContext();

  const services = [
    {
      id: "chatgpt",
      logo: logos.chatgpt,
      title: "اکانت اختصاصی ChatGPT Plus",
      description: "قدرتمندترین AI برای تولید محتوا و کدنویسی",
      color: "#10B981",
      badge: "پرفروش",
      discount: 34,
      features: [
        "دسترسی به GPT-4o و GPT-5",
        "ساخت تصویر با DALL-E 3",
        "وب‌گردی و تحلیل فایل",
        "تضمین تعویض + اتصال بدون VPN",
      ],
      plans: [
        {
          name: "Plus اشتراکی",
          duration: "۱ ماهه - اقتصادی",
          price: getPrice("cgpt_pro_shared"),
          features: ["اشتراکی با ۲ نفر"],
        },
        {
          name: "Plus ۳۰ روزه",
          duration: "۱ ماهه - شخصی",
          price: getPrice("cgpt_pro_30day"),
          popular: true,
        },
        {
          name: "Plus ۳۷ روزه",
          duration: "شخصی",
          price: getPrice("cgpt_pro_37day"),
        },
        { name: "Pro ماهانه", duration: "۲۰۰ دلار - O3 Pro", price: 12500000 },
        { name: "تیمی Plus", duration: "تا ۷ نفر", price: getPrice("cgpt_plus_team") },
      ],
    },
    {
      id: "chatgpt-shared",
      logo: logos.chatgpt,
      title: "اکانت اشتراکی ChatGPT Plus",
      description: "اقتصادی و مقرون به صرفه",
      color: "#3B82F6",
      discount: 14,
      features: ["دسترسی به GPT-4o", "مشترک با ۲ نفر دیگر", "قیمت مناسب"],
      plans: [{ name: "اشتراکی ماهانه", duration: "۱ ماهه", price: getPrice("cgpt_pro_shared"), popular: true }],
    },
    {
      id: "chatgpt-pro",
      logo: logos.chatgpt,
      title: "اکانت اختصاصی ChatGPT Pro",
      description: "دسترسی به جدیدترین ورژن ChatGPT Pro",
      color: "#8B5CF6",
      discount: 17,
      features: ["دسترسی به جدیدترین مدل‌ها", "بدون محدودیت", "پشتیبانی ویژه"],
      plans: [{ name: "Pro ماهانه", duration: "۱ ماهه", price: 3197000, popular: true }],
    },
    {
      id: "gemini",
      logo: logos.gemini,
      title: "اکانت اختصاصی Gemini Pro",
      description: "۲ ترابایت فضای ابری Google One",
      color: "#A855F7",
      discount: 17,
      features: [
        "یکپارچه با Gmail, Drive, Docs",
        "۲ ترابایت فضای Google One",
        "ساخت ویدیو با Veo 3",
        "Deep Research + NotebookLM",
      ],
      plans: [
        { name: "پلن یک‌ماهه", duration: "۱ ماهه", price: getPrice("gem_month") },
        { name: "پلن سه‌ماهه", duration: "۳ ماهه", price: getPrice("gem_3month"), popular: true },
        { name: "پلن شش‌ماهه", duration: "۶ ماهه", price: getPrice("gem_6month") },
        { name: "یکساله Gmail شخصی", duration: "۱ ساله", price: getPrice("gem_year_personal") },
      ],
    },
    {
      id: "gemini-ultra",
      logo: logos.gemini,
      title: "اکانت اختصاصی Gemini Ultra",
      description: "قدرتمندترین مدل گوگل برای پروژه‌های حرفه‌ای",
      color: "#10B981",
      discount: 12,
      features: ["تمام امکانات Gemini", "پردازش پیشرفته چندرسانه‌ای", "دسترسی به مدل‌های نسل جدید"],
      plans: [{ name: "Ultra ماهانه", duration: "۱ ماهه", price: 29500000, popular: true }],
    },
    {
      id: "grok",
      logo: logos.grok,
      title: "اکانت اختصاصی Grok",
      description: "هوش مصنوعی آزاد و بدون محدودیت از xAI",
      color: "#374151",
      discount: 16,
      badge: "بدون سانسور",
      features: [
        "پاسخ به سوالات حساس بدون فیلتر",
        "دسترسی به Grok-3 و Grok-4",
        "تولید تصویر با Aurora",
        "حالت استدلال پیشرفته",
      ],
      plans: [{ name: "پلن ماهانه", duration: "۱ ماهه", price: getPrice("grok_monthly"), popular: true }],
    },
    {
      id: "claude",
      logo: logos.claude,
      title: "اکانت Claude",
      description: "بهترین AI برای متون طولانی",
      color: "#F97316",
      discount: 15,
      features: [
        "پنجره کانتکست ۲۰۰ هزار توکنی",
        "Claude 3.5 Sonnet + Opus",
        "بهترین برای تحلیل کتاب‌ها",
        "Artifacts برای خروجی بصری",
      ],
      plans: [
        { name: "Pro ماهانه", duration: "۱ ماهه - شخصی", price: 2797000, popular: true },
        { name: "Pro اشتراکی", duration: "۱ ماهه - اقتصادی", price: 450000 },
      ],
    },
    {
      id: "cursor",
      logo: logos.cursor,
      title: "اکانت Cursor",
      description: "ادیتور کدنویسی هوشمند",
      color: "#3B82F6",
      discount: 13,
      badge: "مخصوص برنامه‌نویسان",
      features: [
        "تکمیل خودکار کد با AI",
        "پیشنهاد رفع باگ و بهینه‌سازی",
        "پشتیبانی از زبان‌های مختلف",
        "مناسب فریلنسرها و تیم‌ها",
      ],
      plans: [
        {
          name: "پلن ۷ روزه",
          duration: "آفر ویژه",
          price: getPrice("cursor_weekly"),
          features: ["مناسب تست و پروژه کوتاه"],
        },
        { name: "پلن یک‌ماهه", duration: "۱ ماهه", price: getPrice("cursor_monthly"), popular: true },
      ],
    },
  ];

  return (
    <section id="services" className="py-20 relative">
      {/* Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            پرفروش‌ترین محصولات ما
          </h2>
        </div>

        {/* Services Grid - 4 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
