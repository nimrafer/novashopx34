import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";

const PillarChatbotsPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="چت‌بات‌ها و تولید متن | خرید اشتراک ChatGPT، Gemini، Grok و Perplexity"
        description="راهنمای خرید اشتراک چت‌بات‌های هوش مصنوعی برای تولید متن، تحقیق و ایده‌پردازی: ChatGPT، Gemini، Grok، Perplexity و Claude."
        canonicalUrl="/categories/chatbots-text"
        keywords="خرید اکانت چت جی پی تی, خرید Gemini Pro, خرید Grok, خرید Perplexity Pro, خرید Claude Pro"
      />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black mb-4">چت‌بات‌ها و تولید متن با هوش مصنوعی</h1>
          <p className="text-muted-foreground leading-8 mb-8">
            اگر هدف شما تولید محتوا، تحقیق، خلاصه‌سازی و پاسخ‌گویی سریع است، این دسته بهترین نقطه شروع است.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/chatgpt">
              خرید اشتراک چت جی پی تی (ChatGPT)
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/gemini">
              خرید اشتراک جمینای (Gemini Pro / Ultra)
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/perplexity">
              خرید اشتراک پرپلکسیتی پرو (Perplexity Pro)
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/grok">
              خرید دسترسی گراک (Grok)
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/claude">
              خرید اشتراک کلود پرو (Claude Pro)
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-3">کدام چت‌بات برای شما مناسب‌تر است؟</h2>
          <ul className="space-y-2 text-muted-foreground mb-8">
            <li>• ChatGPT: مناسب تولید محتوا، کدنویسی و مکالمه حرفه‌ای</li>
            <li>• Gemini: مناسب کاربرانی که با اکوسیستم گوگل کار می‌کنند</li>
            <li>• Perplexity: مناسب تحقیق سریع با ذکر منبع</li>
            <li>• Grok: مناسب تحلیل ترندهای لحظه‌ای در پلتفرم X</li>
            <li>• Claude: مناسب تحلیل متون طولانی و نگارش دقیق</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3">لینک‌های آموزشی مرتبط</h2>
          <ul className="space-y-2 text-accent">
            <li>
              <Link className="underline" to="/blog/moghayese-chatgpt-gemini-perplexity">
                مقایسه ChatGPT، Gemini و Perplexity
              </Link>
            </li>
            <li>
              <Link className="underline" to="/blog/barname-nevisi-chatgpt-ya-abzar-digar">
                برای برنامه‌نویسی ChatGPT بهتر است یا ابزارهای دیگر؟
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default PillarChatbotsPage;

