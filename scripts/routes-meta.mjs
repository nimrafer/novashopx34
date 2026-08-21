/**
 * Single source of truth for every indexable marketing route.
 * Used by prerender-routes.mjs (unique head + JSON-LD + crawler content)
 * and generate-sitemap.mjs (deterministic sitemap).
 * Titles/descriptions follow the keyword research (fa, RTL).
 */
export const SITE = "https://nova-shop.co";

export const routes = [
  {
    path: "/",
    title: "نوا شاپ | خرید اکانت هوش مصنوعی — ChatGPT، Gemini، Claude با تحویل فوری",
    description:
      "خرید اکانت و اشتراک هوش مصنوعی با قیمت به‌روز: ChatGPT Plus، Gemini Pro، Claude، Grok و تلگرام پرمیوم. فعال‌سازی روی ایمیل خودتان، تحویل فوری و پشتیبانی فارسی.",
    type: "home",
    crumbs: [["نوا شاپ", "/"]],
  },
  {
    path: "/en",
    title: "Nova AI Shop | Buy ChatGPT Plus, Gemini Pro & Claude Subscriptions",
    description:
      "Persian-language store for AI subscriptions: ChatGPT Plus, Gemini Pro, Claude, Grok, Telegram Premium. Fast delivery, activation on your own email.",
    type: "page",
    lang: "en",
    crumbs: [["Nova AI Shop", "/en"]],
  },
  {
    path: "/services/chatgpt",
    title: "خرید اکانت ChatGPT | پلن‌های Plus، Go و Team با تحویل فوری | نوا شاپ",
    description:
      "خرید اکانت چت جی پی تی (ChatGPT Plus، Go و Team) با فعال‌سازی روی ایمیل شخصی، دسترسی به Sora و جدیدترین مدل‌های OpenAI. قیمت به‌روز و پشتیبانی فارسی.",
    type: "service",
    product: { name: "اشتراک ChatGPT Plus", brand: "OpenAI", image: "/logos/chatgpt.svg" },
    h1: "خرید اکانت ChatGPT — پلن‌های Plus، Go و Team",
    intro:
      "اکانت ChatGPT با فعال‌سازی روی جیمیل خودتان: پلن Plus برای استفاده حرفه‌ای روزانه، پلن اقتصادی Go و پلن Team برای کسب‌وکارها. تحویل فوری، دسترسی به Sora و پشتیبانی فارسی.",
    links: [
      ["راهنمای انتخاب پلن ChatGPT", "/blog/kharid-chatgpt-plus"],
      ["ساخت ویدیو با Sora", "/blog/sakht-video-ba-chatgpt-sora"],
      ["مقایسه ChatGPT و Gemini و Claude", "/blog/chatgpt-vs-gemini-vs-claude"],
      ["دسته چت‌بات‌های هوش مصنوعی", "/categories/text-ai"],
    ],
    extraHtml: `
      <h2>سوالات پرتکرار خرید ChatGPT</h2>
      <dl>
        <dt>تفاوت اکانت اشتراکی و اختصاصی ChatGPT چیست؟</dt><dd>در اختصاصی، اشتراک روی ایمیل شخصی شما فعال می‌شود؛ در اشتراکی چند کاربر با ظرفیت مشخص از یک اکانت استفاده می‌کنند و قیمت اقتصادی‌تر است. ورود اشتراکی با سیستم کد امن انجام می‌شود.</dd>
        <dt>ChatGPT Plus چه امکاناتی دارد؟</dt><dd>جدیدترین مدل‌های OpenAI با سقف بالا، ساخت ویدیو با Sora، تصویرسازی، مکالمه صوتی پیشرفته، Projects و GPTهای سفارشی.</dd>
        <dt>تحویل چقدر طول می‌کشد؟</dt><dd>پرداخت خودکار تأیید می‌شود و تحویل پلن‌های اشتراکی معمولاً فوری است.</dd>
        <dt>پرداخت چگونه است؟</dt><dd>کارت‌به‌کارت با تأیید خودکار؛ اعتبار حساب نیز خودکار از مبلغ کسر می‌شود.</dd>
      </dl>`,
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/categories/text-ai"], ["ChatGPT", "/services/chatgpt"]],
  },
  {
    path: "/services/gemini",
    title: "خرید اکانت Gemini Pro (Google AI Pro) | آفر ۱۲ و ۱۸ ماهه | نوا شاپ",
    description:
      "خرید اکانت جمینای پرو (Google AI Pro) با فعال‌سازی روی جیمیل شما: Veo 3.1، Nano Banana Pro و 2TB فضای گوگل. آفرهای ۱۲ و ۱۸ ماهه با گارانتی ۶۰ روزه.",
    type: "service",
    product: { name: "اشتراک Gemini Pro (Google AI Pro)", brand: "Google", image: "/logos/gemini-2025.svg" },
    h1: "خرید اکانت Gemini Pro — آفرهای ویژه ۱۲ و ۱۸ ماهه",
    intro:
      "اشتراک Gemini Pro (نام جدید: Google AI Pro) روی جیمیل خودتان فعال می‌شود: دسترسی به Veo 3.1 برای ساخت ویدیو، Nano Banana Pro برای ادیت عکس و ۲ ترابایت فضای ابری. آفرهای ۱۲ و ۱۸ ماهه با گارانتی تعویض ۶۰ روزه.",
    links: [
      ["شرایط گارانتی آفرهای Gemini", "/gemini-offer-terms"],
      ["راهنمای خرید Gemini Pro", "/blog/kharid-gemini-pro"],
      ["ساخت ویدیو با Veo 3", "/blog/sakht-video-ba-gemini-veo"],
      ["ادیت عکس با Nano Banana", "/blog/nano-banana-sakht-adit-aks"],
    ],
    extraHtml: `
      <h2>سوالات پرتکرار خرید Gemini Pro</h2>
      <dl>
        <dt>اشتراک روی جیمیل خودم فعال می‌شود؟</dt><dd>بله؛ Gemini Pro روی جیمیل شخصی شما فعال می‌شود و Veo 3.1، فضای ۲ ترابایتی و Gemini در Gmail/Docs روی همان اکانت در دسترس است.</dd>
        <dt>آفرهای ۱۲ و ۱۸ ماهه گارانتی دارند؟</dt><dd>بله؛ ۶۰ روز گارانتی تعویض رایگان طبق صفحه شرایط گارانتی.</dd>
        <dt>تفاوت پلن Owner و Member چیست؟</dt><dd>در Owner مالکیت Family Group با شماست و لینک فعال‌سازی مستقیم می‌گیرید؛ در Member با دعوت‌نامه اضافه می‌شوید. امکانات Gemini Pro در هر دو کامل است.</dd>
        <dt>پرداخت چگونه است؟</dt><dd>کارت‌به‌کارت با تأیید خودکار؛ اعتبار حساب نیز خودکار از مبلغ کسر می‌شود.</dd>
      </dl>`,
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/categories/text-ai"], ["Gemini", "/services/gemini"]],
  },
  {
    path: "/services/claude",
    title: "خرید اکانت Claude Pro | اشتراک Anthropic با فعال‌سازی سریع | نوا شاپ",
    description:
      "خرید اکانت کلود (Claude Pro) محصول Anthropic: بهترین مدل برای کدنویسی و متن‌های بلند به همراه Claude Code. تحویل سریع، فعال‌سازی مطمئن و پشتیبانی فارسی.",
    type: "service",
    product: { name: "اشتراک Claude Pro", brand: "Anthropic", image: "/logos/claude.svg" },
    h1: "خرید اکانت Claude Pro",
    intro:
      "اشتراک Claude Pro برای کدنویسی حرفه‌ای، تحلیل اسناد بلند و دسترسی به Claude Code. فعال‌سازی روی ایمیل خودتان با تحویل سریع.",
    links: [
      ["راهنمای خرید Claude Pro", "/blog/kharid-claude-pro"],
      ["Claude Code چیست؟", "/blog/claude-code-chist-amoozesh-farsi"],
      ["مقایسه ChatGPT و Gemini و Claude", "/blog/chatgpt-vs-gemini-vs-claude"],
    ],
    extraHtml: `
      <h2>سوالات پرتکرار خرید Claude</h2>
      <dl>
        <dt>Claude برای چه کارهایی بهتر است؟</dt><dd>کدنویسی با Claude Code، تحلیل متن‌های بلند با پنجره ۲۰۰ هزار توکنی و نوشتن دقیق — انتخاب اول برنامه‌نویس‌ها.</dd>
        <dt>تفاوت پلن Pro و Max چیست؟</dt><dd>Pro برای استفاده حرفه‌ای روزانه؛ Max با سقف استفاده چند برابری برای کار سنگین با Claude Code.</dd>
        <dt>تحویل چقدر طول می‌کشد؟</dt><dd>پرداخت خودکار تأیید می‌شود و تحویل در کوتاه‌ترین زمان انجام می‌شود.</dd>
        <dt>پرداخت چگونه است؟</dt><dd>کارت‌به‌کارت با تأیید خودکار؛ اعتبار حساب نیز خودکار از مبلغ کسر می‌شود.</dd>
      </dl>`,
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/categories/text-ai"], ["Claude", "/services/claude"]],
  },
  {
    path: "/services/grok",
    title: "خرید اکانت Grok (xAI) | اشتراک SuperGrok و X Premium | نوا شاپ",
    description:
      "خرید اکانت گراک (Grok) هوش مصنوعی xAI ایلان ماسک: پلن SuperGrok و X Premium با تحویل سریع و آموزش فعال‌سازی. قیمت به‌روز در نوا شاپ.",
    type: "service",
    product: { name: "اشتراک SuperGrok", brand: "xAI", image: "/logos/grok.svg" },
    h1: "خرید اکانت Grok — هوش مصنوعی xAI",
    intro: "اشتراک SuperGrok و X Premium برای دسترسی کامل به Grok، مدل هوش مصنوعی xAI، با تحویل سریع.",
    links: [
      ["Grok چیست و چه می‌کند؟", "/blog/grok-x-ai"],
      ["دسته چت‌بات‌های هوش مصنوعی", "/categories/text-ai"],
    ],
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/categories/text-ai"], ["Grok", "/services/grok"]],
  },
  {
    path: "/services/perplexity",
    title: "خرید اکانت Perplexity Pro | جستجوی هوشمند با ذکر منبع | نوا شاپ",
    description:
      "خرید اکانت پرپلکسیتی پرو: موتور جستجوی هوش مصنوعی با ذکر منبع، مناسب تحقیق و تولید محتوا. تحویل فوری با پشتیبانی فارسی.",
    type: "service",
    product: { name: "اشتراک Perplexity Pro", brand: "Perplexity", image: "/logos/perplexity.svg" },
    h1: "خرید اکانت Perplexity Pro",
    intro: "جستجوی هوشمند با پاسخ مستند و ذکر منبع؛ ابزار طلایی تحقیق و سئو. تحویل سریع اشتراک Pro.",
    links: [
      ["راهنمای خرید Perplexity Pro", "/blog/kharid-perplexity-pro"],
      ["چرا Perplexity برای سئو طلایی است؟", "/blog/perplexity-vs-google"],
    ],
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/categories/text-ai"], ["Perplexity", "/services/perplexity"]],
  },
  {
    path: "/services/spotify",
    title: "خرید اکانت Spotify Premium | موسیقی بدون تبلیغ | نوا شاپ",
    description:
      "خرید اشتراک اسپاتیفای پرمیوم روی اکانت خودتان: موسیقی بدون تبلیغ، پخش آفلاین و کیفیت بالا. تحویل سریع و قیمت مناسب.",
    type: "service",
    product: { name: "اشتراک Spotify Premium", brand: "Spotify", image: "/logos/spotify.svg" },
    h1: "خرید اکانت Spotify Premium",
    intro: "اشتراک پرمیوم اسپاتیفای روی اکانت شخصی شما: بدون تبلیغ، دانلود آفلاین و کیفیت بالا.",
    links: [["راهنمای خرید اسپاتیفای", "/blog/kharid-spotify-premium"]],
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/categories/media-ai"], ["Spotify", "/services/spotify"]],
  },
  {
    path: "/services/cursor",
    title: "خرید اکانت Cursor Pro | ادیتور کدنویسی هوش مصنوعی | نوا شاپ",
    description:
      "خرید اکانت کرسر پرو (Cursor Pro): ادیتور کدنویسی مبتنی بر هوش مصنوعی برای برنامه‌نویس‌ها. تحویل سریع با آموزش فعال‌سازی.",
    type: "service",
    product: { name: "اشتراک Cursor Pro", brand: "Cursor", image: "/logos/cursor.svg" },
    h1: "خرید اکانت Cursor Pro",
    intro: "ادیتور هوشمند Cursor با قابلیت Agent و تکمیل کد؛ اشتراک Pro با تحویل سریع.",
    links: [
      ["راهنمای خرید Cursor Pro", "/blog/kharid-cursor-pro"],
      ["Cursor یا GitHub Copilot؟", "/blog/cursor-vs-copilot"],
      ["دسته ابزارهای کدنویسی AI", "/categories/dev-ai"],
    ],
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/categories/dev-ai"], ["Cursor", "/services/cursor"]],
  },
  {
    path: "/services/telegram-premium",
    title: "خرید تلگرام پرمیوم | قیمت به‌روز پلن ۳، ۶ و ۱۲ ماهه | نوا شاپ",
    description:
      "خرید اشتراک تلگرام پرمیوم بدون نیاز به ورود به اکانت شما: پلن‌های ۳ ماهه، ۶ ماهه و یک‌ساله با قیمت به‌روز و تحویل سریع از نوا شاپ.",
    type: "service",
    product: { name: "اشتراک Telegram Premium", brand: "Telegram", image: "/logos/telegram.svg" },
    h1: "خرید تلگرام پرمیوم — پلن‌های ۳، ۶ و ۱۲ ماهه",
    intro:
      "تلگرام پرمیوم با هدیه (Gift) مستقیم روی اکانت شما فعال می‌شود؛ بدون نیاز به رمز یا ورود. پلن یک‌ساله بیشترین صرفه را دارد.",
    links: [["راهنمای تلگرام پرمیوم", "/blog/kharid-telegram-premium"]],
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/services/telegram-premium"], ["Telegram Premium", "/services/telegram-premium"]],
  },
  {
    path: "/services/cards",
    title: "خرید ویزاکارت و مسترکارت مجازی | پرداخت ارزی | نوا شاپ",
    description:
      "خرید ویزاکارت مجازی برای پرداخت‌های ارزی و خرید اشتراک سرویس‌های خارجی. صدور سریع و پشتیبانی فارسی.",
    type: "service",
    product: { name: "ویزاکارت مجازی", brand: "Nova AI Shop", image: "/nova-logo.webp" },
    h1: "خرید ویزاکارت مجازی",
    intro: "کارت‌های مجازی بین‌المللی برای پرداخت اشتراک سرویس‌های خارجی، با صدور سریع.",
    links: [["راهنمای خرید اکانت AI در ایران", "/blog/kharid-ai-account-guide"]],
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/services/cards"], ["ویزاکارت", "/services/cards"]],
  },
  {
    path: "/services/virtual-number",
    title: "خرید شماره مجازی | ساخت اکانت سرویس‌های خارجی | نوا شاپ",
    description:
      "خرید شماره مجازی برای ثبت‌نام و وریفای سرویس‌های خارجی. تحویل سریع با پشتیبانی فارسی از نوا شاپ.",
    type: "service",
    product: { name: "شماره مجازی", brand: "Nova AI Shop", image: "/nova-logo.webp" },
    h1: "خرید شماره مجازی",
    intro: "شماره مجازی برای وریفای اکانت سرویس‌های بین‌المللی، با تحویل سریع.",
    links: [["راهنمای خرید اکانت AI در ایران", "/blog/kharid-ai-account-guide"]],
    crumbs: [["نوا شاپ", "/"], ["سرویس‌ها", "/services/virtual-number"], ["شماره مجازی", "/services/virtual-number"]],
  },
  {
    path: "/categories/text-ai",
    title: "خرید اکانت چت‌بات و هوش مصنوعی متنی | ChatGPT، Claude، Gemini | نوا شاپ",
    description:
      "همه اکانت‌های چت‌بات و تولید متن هوش مصنوعی در یک‌جا: ChatGPT Plus، Claude Pro، Gemini Pro، Grok و Perplexity با قیمت به‌روز و تحویل فوری.",
    type: "category",
    h1: "اکانت چت‌بات‌ها و هوش مصنوعی متنی",
    intro: "مقایسه و خرید اشتراک بهترین چت‌بات‌های هوش مصنوعی: ChatGPT، Claude، Gemini، Grok و Perplexity.",
    links: [
      ["ChatGPT", "/services/chatgpt"],
      ["Gemini", "/services/gemini"],
      ["Claude", "/services/claude"],
      ["Grok", "/services/grok"],
      ["Perplexity", "/services/perplexity"],
      ["مقایسه ChatGPT، Gemini و Perplexity", "/blog/moghayese-chatgpt-gemini-perplexity"],
    ],
    crumbs: [["نوا شاپ", "/"], ["دسته‌بندی‌ها", "/categories/text-ai"], ["هوش مصنوعی متنی", "/categories/text-ai"]],
  },
  {
    path: "/categories/media-ai",
    title: "خرید اکانت هوش مصنوعی تصویر و ویدیو | Sora، Veo، Midjourney | نوا شاپ",
    description:
      "اکانت ابزارهای تولید تصویر، ویدیو و صدای هوش مصنوعی: Sora، Veo 3، Nano Banana و اسپاتیفای. خرید با تحویل فوری از نوا شاپ.",
    type: "category",
    h1: "اکانت هوش مصنوعی تصویر، ویدیو و صدا",
    intro: "ابزارهای ساخت عکس و ویدیو با هوش مصنوعی: Sora از OpenAI، Veo 3 از گوگل و Nano Banana.",
    links: [
      ["ساخت ویدیو با Sora", "/blog/sakht-video-ba-chatgpt-sora"],
      ["ساخت ویدیو با Veo 3", "/blog/sakht-video-ba-gemini-veo"],
      ["ادیت عکس با Nano Banana", "/blog/nano-banana-sakht-adit-aks"],
      ["Spotify Premium", "/services/spotify"],
    ],
    crumbs: [["نوا شاپ", "/"], ["دسته‌بندی‌ها", "/categories/media-ai"], ["تصویر و ویدیو", "/categories/media-ai"]],
  },
  {
    path: "/categories/dev-ai",
    title: "خرید اکانت ابزارهای کدنویسی هوش مصنوعی | Cursor، Copilot | نوا شاپ",
    description:
      "اکانت ابزارهای برنامه‌نویسی با هوش مصنوعی: Cursor Pro، Claude Code و GitHub Copilot. مقایسه، قیمت به‌روز و تحویل فوری.",
    type: "category",
    h1: "اکانت ابزارهای کدنویسی هوش مصنوعی",
    intro: "بهترین ابزارهای AI برای برنامه‌نویس‌ها: Cursor، Claude Code و Copilot — با راهنمای انتخاب.",
    links: [
      ["Cursor Pro", "/services/cursor"],
      ["Claude Pro (Claude Code)", "/services/claude"],
      ["Cursor یا Copilot؟", "/blog/cursor-vs-copilot"],
      ["بهترین AI برای کدنویسی", "/blog/chatgpt-vs-gemini-vs-claude"],
    ],
    crumbs: [["نوا شاپ", "/"], ["دسته‌بندی‌ها", "/categories/dev-ai"], ["ابزار کدنویسی", "/categories/dev-ai"]],
  },
  {
    path: "/blog",
    title: "بلاگ نوا شاپ | راهنمای خرید و آموزش ابزارهای هوش مصنوعی",
    description:
      "راهنمای خرید اکانت‌های هوش مصنوعی، مقایسه ChatGPT و Gemini و Claude، آموزش Sora و Veo و نکات استفاده حرفه‌ای — بلاگ رسمی نوا شاپ.",
    type: "bloglist",
    h1: "بلاگ نوا شاپ",
    intro: "راهنماها، مقایسه‌ها و آموزش‌های به‌روز دنیای هوش مصنوعی.",
    crumbs: [["نوا شاپ", "/"], ["بلاگ", "/blog"]],
  },
  {
    path: "/about",
    title: "درباره نوا شاپ | مرجع تخصصی اشتراک‌های هوش مصنوعی",
    description:
      "نوا شاپ مرجع فارسی خرید اشتراک‌های هوش مصنوعی: تحویل فوری، فعال‌سازی روی ایمیل شخصی، گارانتی و پشتیبانی واقعی.",
    type: "page",
    crumbs: [["نوا شاپ", "/"], ["درباره ما", "/about"]],
  },
  {
    path: "/contact",
    title: "تماس با نوا شاپ | پشتیبانی خرید اکانت هوش مصنوعی",
    description: "راه‌های ارتباط با پشتیبانی نوا شاپ برای خرید، پیگیری سفارش و مشاوره انتخاب اشتراک هوش مصنوعی.",
    type: "page",
    crumbs: [["نوا شاپ", "/"], ["تماس", "/contact"]],
  },
  {
    path: "/support",
    title: "پشتیبانی نوا شاپ | پیگیری سفارش و راهنمای فعال‌سازی",
    description: "پشتیبانی فارسی نوا شاپ: پیگیری سفارش، راهنمای فعال‌سازی اشتراک‌ها و پاسخ به سوالات پیش از خرید.",
    type: "page",
    crumbs: [["نوا شاپ", "/"], ["پشتیبانی", "/support"]],
  },
  {
    path: "/terms",
    title: "قوانین و مقررات نوا شاپ | شرایط استفاده از خدمات",
    description:
      "قوانین خرید، شرایط تحویل و فعال‌سازی، گارانتی و مسئولیت‌های کاربر در فروشگاه نوا شاپ.",
    type: "static",
    crumbs: [["نوا شاپ", "/"], ["قوانین و مقررات", "/terms"]],
  },
  {
    path: "/gemini-offer-terms",
    title: "شرایط گارانتی و استفاده از آفرهای Gemini Pro | نوا شاپ",
    description:
      "گارانتی ۶۰ روز تعویض رایگان، شرایط استفاده و نکات حفظ اکانت برای آفرهای ۱۲ و ۱۸ ماهه Gemini Pro.",
    type: "static",
    crumbs: [["نوا شاپ", "/"], ["شرایط گارانتی Gemini", "/gemini-offer-terms"]],
  },
];
