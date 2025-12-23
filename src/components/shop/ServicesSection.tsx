import ServiceCard from "./ServiceCard";

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
  const services = [
    {
      id: "chatgpt",
      logo: logos.chatgpt,
      title: "ChatGPT Plus / Pro",
      description: "قدرتمندترین AI برای تولید محتوا و کدنویسی",
      color: "#10B981",
      badge: "پرفروش",
      features: [
        "دسترسی به GPT-4o و GPT-5",
        "ساخت تصویر با DALL-E 3",
        "وب‌گردی و تحلیل فایل",
        "تضمین تعویض + اتصال بدون VPN",
      ],
      plans: [
        { name: "Plus اشتراکی", duration: "۱ ماهه - اقتصادی", price: 199000, features: ["اشتراکی با ۲ نفر"] },
        { name: "Plus ۳۰ روزه", duration: "۱ ماهه - شخصی", price: 449000, popular: true },
        { name: "Plus ۳۷ روزه", duration: "شخصی", price: 549000 },
        { name: "Pro ماهانه", duration: "۲۰۰ دلار - O3 Pro", price: 12500000 },
        { name: "تیمی Plus", duration: "تا ۷ نفر", price: 1200000 },
      ],
    },
    {
      id: "gemini",
      logo: logos.gemini,
      title: "Gemini Pro",
      description: "AI گوگل با ۲ ترابایت فضا و Deep Research",
      color: "#3B82F6",
      features: [
        "یکپارچه با Gmail, Drive, Docs",
        "۲ ترابایت فضای Google One",
        "ساخت ویدیو با Veo 3",
        "Deep Research + NotebookLM",
      ],
      plans: [
        { name: "پلن یک‌ماهه", duration: "۱ ماهه", price: 649000 },
        { name: "پلن سه‌ماهه", duration: "۳ ماهه", price: 1250000, popular: true },
        { name: "پلن شش‌ماهه", duration: "۶ ماهه", price: 1630000 },
        { name: "یکساله Gmail شخصی", duration: "۱ ساله", price: 2790000 },
      ],
    },
    {
      id: "claude",
      logo: logos.claude,
      title: "Claude Pro",
      description: "بهترین AI برای متون طولانی و کدنویسی",
      color: "#D97706",
      badge: "جدید",
      features: [
        "پنجره کانتکست ۲۰۰ هزار توکنی",
        "Claude 3.5 Sonnet + Opus",
        "بهترین برای تحلیل کتاب‌ها",
        "Artifacts برای خروجی بصری",
      ],
      plans: [
        { name: "Pro ماهانه", duration: "۱ ماهه - شخصی", price: 1250000, popular: true },
        { name: "Pro اشتراکی", duration: "۱ ماهه - اقتصادی", price: 450000 },
      ],
    },
    {
      id: "grok",
      logo: logos.grok,
      title: "Super Grok",
      description: "هوش مصنوعی بدون سانسور xAI",
      color: "#FFFFFF",
      badge: "بدون سانسور",
      features: [
        "پاسخ به سوالات حساس بدون فیلتر",
        "دسترسی به Grok-3 و Grok-4",
        "تولید تصویر با Aurora",
        "حالت استدلال پیشرفته",
      ],
      plans: [
        { name: "پلن ماهانه", duration: "۱ ماهه", price: 1850000, popular: true },
      ],
    },
    {
      id: "perplexity",
      logo: logos.perplexity,
      title: "Perplexity Pro",
      description: "موتور جستجوی هوشمند با منابع",
      color: "#06B6D4",
      features: [
        "پاسخ‌های دقیق با ذکر منبع و لینک",
        "دسترسی به GPT-4، Claude 3 و Gemini Pro",
        "۳۰۰+ پرسش Pro در روز",
        "آپلود نامحدود فایل",
      ],
      plans: [
        { name: "پلن یک‌ماهه", duration: "۱ ماهه", price: 649000, popular: true },
        { name: "پلن یکساله", duration: "۱ ساله", price: 1670000 },
      ],
    },
    {
      id: "spotify",
      logo: logos.spotify,
      title: "Spotify Premium",
      description: "موسیقی بدون تبلیغ با کیفیت بالا",
      color: "#1DB954",
      features: [
        "بدون تبلیغات آزاردهنده",
        "دانلود آهنگ برای حالت آفلاین",
        "کیفیت صدای عالی",
        "فعال‌سازی روی اکانت شخصی",
      ],
      plans: [
        { name: "پلن یک‌ماهه", duration: "۱ ماهه", price: 350000, popular: true },
        { name: "پلن ۴ ماهه", duration: "۴ ماهه - اقتصادی", price: 1350000 },
      ],
    },
    {
      id: "cursor",
      logo: logos.cursor,
      title: "Cursor Pro",
      description: "ادیتور کدنویسی هوشمند",
      color: "#8B5CF6",
      badge: "مخصوص برنامه‌نویسان",
      features: [
        "تکمیل خودکار کد با AI",
        "پیشنهاد رفع باگ و بهینه‌سازی",
        "پشتیبانی از زبان‌های مختلف",
        "مناسب فریلنسرها و تیم‌ها",
      ],
      plans: [
        { name: "پلن ۷ روزه", duration: "آفر ویژه", price: 350000, features: ["مناسب تست و پروژه کوتاه"] },
        { name: "پلن یک‌ماهه", duration: "۱ ماهه", price: 3490000, popular: true },
      ],
    },
    {
      id: "telegram",
      logo: logos.telegram,
      title: "تلگرام پرمیوم",
      description: "ارتقای حساب کاربری تلگرام",
      color: "#0088CC",
      features: [
        "بدون تبلیغات در کانال‌ها",
        "آپلود فایل تا ۴ گیگابایت",
        "استیکرها و ایموجی‌های پرمیوم",
        "فعال‌سازی به صورت گیفت (بدون نیاز به لاگین)",
      ],
      plans: [
        { name: "پلن ۳ ماهه", duration: "۳ ماهه", price: 1730000 },
        { name: "پلن ۶ ماهه", duration: "۶ ماهه", price: 2230000, popular: true },
        { name: "پلن یکساله", duration: "۱ ساله - بهترین قیمت", price: 3900000 },
      ],
    },
    {
      id: "cards",
      emoji: "💳",
      title: "ویزا و مستر کارت",
      description: "کارت اعتباری مجازی بین‌المللی",
      color: "#EAB308",
      badge: "جدید",
      features: [
        "صادر شده از بانک‌های اروپایی و سوییس",
        "قابلیت شارژ مجدد نامحدود",
        "مناسب تمام خریدهای بین‌المللی",
        "رفع تحریم به معنای واقعی",
      ],
      plans: [
        { name: "مستر کارت", duration: "بین‌المللی", price: 650000 },
        { name: "ویزا کارت", duration: "بین‌المللی", price: 750000, popular: true },
      ],
    },
    {
      id: "vnum",
      emoji: "📱",
      title: "شماره مجازی",
      description: "شماره خارجی دائمی",
      color: "#A855F7",
      features: [
        "مناسب ثبت‌نام در سرویس‌های بین‌المللی",
        "شماره‌های دائمی و Private",
        "کشورهای UK، US، AU، CA",
        "حساب‌های آماده تلگرام و واتساپ",
      ],
      plans: [
        { name: "شماره کانادا", duration: "دائمی", price: 650000 },
        { name: "شماره آمریکا", duration: "دائمی", price: 750000 },
        { name: "شماره انگلیس", duration: "دائمی", price: 950000, popular: true },
        { name: "شماره استرالیا", duration: "دائمی", price: 1450000 },
      ],
    },
  ];

  return (
    <section id="services" className="py-20 relative">
      {/* Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">سرویس‌های ما</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            تمام سرویس‌های زیر با تضمین کیفیت و پشتیبانی ۲۴ ساعته ارائه می‌شوند
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} id={service.id}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
