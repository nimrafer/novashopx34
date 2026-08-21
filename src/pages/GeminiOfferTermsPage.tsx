import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CircleAlert,
  Clock3,
  Headphones,
  KeyRound,
  Laptop,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import ShopFooter from "@/components/shop/ShopFooter";
import ShopHeader from "@/components/shop/ShopHeader";

const usageRules = [
  {
    icon: Wifi,
    title: "IP باکیفیت و پایدار",
    text: "از سرویس تغییر IP باکیفیت و پایدار استفاده کنید؛ ترجیحاً IP ثابت آمریکا یا انگلستان.",
  },
  {
    icon: MapPin,
    title: "پرهیز از تغییر مداوم IP",
    text: "از VPNهای بی‌کیفیت، تغییر مداوم موقعیت و ورود بدون تغییر IP خودداری کنید.",
  },
  {
    icon: Users,
    title: "استفاده فقط توسط یک نفر",
    text: "اکانت را با دیگران به اشتراک نگذارید و از ورود هم‌زمان چند نفر خودداری کنید.",
  },
  {
    icon: Laptop,
    title: "ورودهای عادی و قابل‌اعتماد",
    text: "از فعالیت غیرعادی یا ورودهای مکرر از دستگاه‌ها و موقعیت‌های مختلف پرهیز کنید.",
  },
  {
    icon: KeyRound,
    title: "یک Gmail جدید",
    text: "برای امنیت بیشتر، پیشنهاد می‌کنیم اشتراک را روی یک حساب Gmail جدید فعال و استفاده کنید.",
  },
];

const GeminiOfferTermsPage = () => {
  return (
    <div dir="rtl" className="min-h-screen overflow-hidden bg-background text-foreground">
      <Helmet>
        <title>گارانتی و شرایط استفاده از آفرهای ۱۲ و ۱۸ ماهه Gemini Pro | نوا شاپ</title>
        <meta
          name="description"
          content="شرایط استفاده، نکات حفظ اکانت و جزئیات گارانتی تعویض رایگان ۶۰ روزه آفرهای ۱۲ و ۱۸ ماهه Gemini Pro در نوا شاپ."
        />
        <link rel="canonical" href="https://nova-shop.co/gemini-offer-terms" />
      </Helmet>

      <ShopHeader />

      <main className="relative pt-28 md:pt-36 pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[650px] overflow-hidden">
          <div className="absolute -top-28 right-[8%] h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute top-20 left-[7%] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
        </div>

        <section className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-700 dark:text-blue-300">
              <ShieldCheck className="h-4 w-4" />
              راهنمای ضروری پیش از خرید
            </span>
            <h1 className="mt-6 text-3xl font-black leading-[1.45] tracking-tight sm:text-4xl md:text-6xl">
              گارانتی و شرایط استفاده از
              <span
                className="block"
                style={{
                  color: "transparent",
                  backgroundImage: "linear-gradient(to left, #2563eb, #7c3aed, #c026d3)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                }}
              >
                آفرهای ویژه Gemini Pro
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              لطفاً قبل از خرید این صفحه را با دقت مطالعه کنید. رعایت چند نکته ساده، بهترین راه برای استفاده بدون دغدغه تا آخرین روز اشتراک است.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["۱۲ ماهه", "استفاده بلندمدت"],
                ["۱۸ ماهه", "بیشترین صرفه اقتصادی"],
                ["۶۰ روز", "تعویض رایگان"],
              ].map(([value, label]) => (
                <div key={value} className="rounded-2xl border border-border bg-card/85 p-4 shadow-sm backdrop-blur">
                  <strong className="block text-xl font-black text-primary">{value}</strong>
                  <span className="mt-1 block text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-14 px-4">
          <div className="mx-auto grid max-w-5xl gap-6">
            <article className="rounded-[2rem] border border-border bg-card p-6 shadow-xl shadow-primary/5 md:p-9">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/10 text-violet-600">
                  <Sparkles className="h-6 w-6" />
                </span>
                <h2 className="text-xl font-black md:text-2xl">چرا آفرهای ۱۲ و ۱۸ ماهه؟</h2>
              </div>
              <p className="leading-9 text-muted-foreground">
                این آفرها اقتصادی‌ترین روش برای استفاده بلندمدت از امکانات حرفه‌ای Gemini هستند. هزینه آن‌ها به‌قدری مقرون‌به‌صرفه است که با تقسیم مبلغ بر تعداد ماه‌ها، هزینه هر ماه حتی از بسیاری از پلن‌های یک‌ماهه کمتر خواهد بود؛ بنابراین برای استفاده طولانی‌مدت، یکی از بهترین انتخاب‌ها هستند.
              </p>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-blue-500/20 bg-card shadow-xl shadow-blue-500/5">
              <div className="border-b border-blue-500/15 bg-blue-500/[.06] p-6 md:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/15 bg-white text-2xl shadow-sm" aria-hidden="true">
                    💎
                  </span>
                  <h2 className="text-xl font-black leading-8 md:text-3xl">
                    آیا آفرهای Gemini Pro تا پایان مدت اشتراک قابل استفاده هستند؟
                  </h2>
                </div>
              </div>

              <div className="space-y-5 p-6 text-muted-foreground md:p-9 [&>p]:leading-9">
                <p>
                  طبق تجربه ما از آفرهای قبلی، به‌ویژه Gemini Student، مدت زمان قابل استفاده بودن اکانت‌ها تا حد زیادی به نحوه استفاده کاربر و رعایت نکات توصیه‌شده بستگی دارد.
                </p>
                <p>
                  همان‌طور که از نام این پلن‌ها مشخص است، این اکانت‌ها <strong className="text-foreground">آفری (Offer)</strong> هستند؛ یعنی فرصت‌هایی با قیمت بسیار پایین‌تر از قیمت اصلی که معمولاً برای مدت محدودی ارائه می‌شوند. به همین دلیل، ممکن است پس از پایان موجودی یا اتمام دوره ارائه، دیگر با همین شرایط و قیمت قابل تهیه نباشند.
                </p>
                <p>
                  تجربه ما در آفرهای قبلی نیز همین موضوع را نشان داده است:
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-secondary/40 p-5">
                    <strong className="block text-foreground">Perplexity Pro یک‌ساله</strong>
                    <p className="mt-2 text-sm leading-7">
                      مدتی قبل این آفر را با قیمت حدود ۶۵۰ هزار تومان ارائه کردیم و بسیاری از کاربران تا امروز بدون مشکل از آن استفاده می‌کنند؛ در حالی که تهیه رسمی همین سرویس امروز حدود ۳.۷ میلیون تومان در ماه هزینه دارد.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/40 p-5">
                    <strong className="block text-foreground">آفر GPT Team</strong>
                    <p className="mt-2 text-sm leading-7">
                      اکانت پنج‌نفره آن زمان حدود ۲۵۰ تا ۴۵۰ هزار تومان و در برخی شرایط حتی رایگان بود؛ اما امروز نسخه رسمی آن حدود ۱۵۰ دلار، تقریباً ۲۵٬۹۰۳٬۵۰۰ تومان، هزینه دارد.
                    </p>
                  </div>
                </div>

                <p>
                  آفرهای Gemini Pro دوازده و هجده‌ماهه نیز از همین دسته هستند؛ فرصت‌هایی که ممکن است پس از پایان این دوره، دیگر با این قیمت و شرایط در دسترس نباشند.
                </p>

                <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[.07] p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/15 bg-white text-emerald-600">
                    <BadgeCheck className="h-6 w-6" />
                  </span>
                  <p className="text-sm leading-8 md:text-base">
                    از نظر پایداری، تجربه ما امیدوارکننده بوده است. در آفر Gemini Student، <strong className="text-foreground">بیش از ۸۰٪ اکانت‌ها</strong> با رعایت شرایط استفاده تا یک سال کامل بدون مشکل فعال مانده‌اند. با استفاده صحیح، IP مناسب و پایدار و رعایت نکات امنیتی، این آفرها نیز می‌توانند حتی بیش از ۱۵ ماه بدون مشکل فعال بمانند.
                  </p>
                </div>

                <p>
                  با این حال، ماهیت اکانت‌های آفری همواره با ریسک‌هایی همراه است و مدت زمان فعال ماندن آن‌ها تا حد زیادی به نحوه استفاده کاربر بستگی دارد. به همین دلیل، رعایت شرایط استفاده اهمیت بسیار زیادی دارد.
                </p>
                <p>
                  ما نیز متعهد هستیم تا جایی که در توانمان باشد، در تمام مراحل کنار شما باشیم و با ارائه راهنمایی، پشتیبانی و در صورت امکان، بهترین راهکار را برای رفع مشکلات احتمالی ارائه دهیم.
                </p>

                <div className="flex flex-col gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/[.06] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-7 text-foreground">پیش از خرید یا پس از آن سؤال یا ابهامی دارید؟</p>
                  <a
                    href="https://t.me/Nova_Ai_Support"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-black text-white transition hover:bg-violet-700"
                  >
                    @Nova_Ai_Support
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="container mx-auto mt-16 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-7 max-w-3xl">
              <span className="text-sm font-black text-primary">شرایط استفاده</span>
              <h2 className="mt-2 text-2xl font-black md:text-4xl">پنج نکته برای حفظ اکانت</h2>
              <p className="mt-3 leading-8 text-muted-foreground">
                بخش قابل‌توجهی از مشکلات اکانت‌ها از تغییرات غیرعادی یا استفاده نادرست ایجاد می‌شود. برای به حداقل رساندن احتمال محدودیت، این موارد را رعایت کنید:
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {usageRules.map(({ icon: Icon, title, text }, index) => (
                <article
                  key={title}
                  className={`group rounded-3xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg ${index === usageRules.length - 1 ? "md:col-span-2" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/15 bg-emerald-500/[.08] text-emerald-600">
                      <Icon className="block h-6 w-6 shrink-0" strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-black leading-7">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[.07] p-5 text-sm leading-7 text-muted-foreground">
              <CircleAlert className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
              رعایت این موارد احتمال بروز مشکل را به حداقل می‌رساند و کمک می‌کند با خیال راحت تا پایان مدت اشتراک از اکانت استفاده کنید.
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-16 px-4">
          <div
            className="mx-auto max-w-5xl overflow-hidden rounded-[2.25rem] border border-blue-500/20 shadow-2xl shadow-blue-500/20"
            style={{
              color: "#ffffff",
              backgroundColor: "#4338ca",
              backgroundImage: "linear-gradient(135deg, #1d4ed8 0%, #4338ca 48%, #6d28d9 100%)",
            }}
          >
            <div className="grid items-stretch lg:grid-cols-[.7fr_1.3fr]">
              <div className="grid place-items-center bg-white/10 p-8 text-center backdrop-blur-sm md:p-12">
                <div>
                  <Clock3 className="mx-auto h-9 w-9 text-blue-100" />
                  <strong className="mt-3 block text-7xl font-black md:text-8xl">۶۰</strong>
                  <span className="text-lg font-bold text-blue-100">روز گارانتی تعویض رایگان</span>
                </div>
              </div>
              <div className="p-7 md:p-12">
                <h2 className="text-2xl font-black md:text-3xl">خیالتان در دو ماه اول راحت باشد</h2>
                <p className="mt-5 leading-9" style={{ color: "rgba(255,255,255,.92)" }}>
                  تمامی آفرهای ۱۲ و ۱۸ ماهه شامل ۶۰ روز گارانتی تعویض رایگان هستند. اگر در ۶۰ روز ابتدایی، به هر دلیلی مشکلی برای اکانت ایجاد شود که قابل رفع نباشد، بدون دریافت هزینه اکانت جایگزین در اختیار شما قرار می‌گیرد.
                </p>
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                  <RefreshCcw className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-bold">تعویض رایگان در صورت رفع‌نشدن مشکل طی ۶۰ روز اول</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-8 px-4">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <Headphones className="h-8 w-8 text-primary" />
              <h2 className="mt-4 text-xl font-black">بعد از ۶۰ روز چه می‌شود؟</h2>
              <p className="mt-3 leading-8 text-muted-foreground">
                پایان گارانتی به معنی پایان پشتیبانی نیست. تیم ما همچنان مشکل را بررسی می‌کند و تمام تلاش خود را برای رفع آن انجام می‌دهد؛ فقط گارانتی <strong className="text-foreground">تعویض رایگان</strong> مختص ۶۰ روز ابتدایی خرید است.
              </p>
            </article>
            <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-xl font-black">تعهد ما</h2>
              <p className="mt-3 leading-8 text-muted-foreground">
                هدف ما فقط فروش اکانت نیست؛ می‌خواهیم تجربه‌ای مطمئن و بدون دغدغه داشته باشید. قبل و بعد از خرید می‌توانید روی راهنمایی و پشتیبانی نوا شاپ حساب کنید.
              </p>
            </article>
          </div>
        </section>

        <section className="container mx-auto mt-14 px-4">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-card p-7 text-center shadow-xl shadow-primary/5 md:p-12">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
              <Check className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-2xl font-black md:text-3xl">آماده انتخاب آفر هستید؟</h2>
            <p className="mx-auto mt-3 max-w-3xl leading-8 text-muted-foreground">
              با ثبت سفارش تأیید می‌کنید که شرایط استفاده را مطالعه کرده و رعایت خواهید کرد. رعایت همین موارد، بهترین تضمین برای استفاده بدون مشکل تا پایان اشتراک است.
            </p>
            <Link
              to="/services/gemini"
              className="mt-7 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-l from-blue-600 to-violet-600 px-7 font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-1 hover:shadow-xl"
            >
              مشاهده و خرید آفرهای Gemini
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <ShopFooter />
    </div>
  );
};

export default GeminiOfferTermsPage;
