import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";

const EnglishHome = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Nova AI Shop | Buy AI Subscriptions in Iran"
        description="Buy premium AI subscriptions including ChatGPT, Gemini, Grok, Perplexity, Claude and Cursor with fast delivery and Persian support."
        canonicalUrl="/en"
        lang="en"
        keywords="buy ChatGPT subscription, buy Gemini Pro, buy Grok account, buy Perplexity Pro, AI subscription shop"
        noindex={false}
      />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black mb-4">Buy AI Subscriptions from Nova AI Shop</h1>
          <p className="text-muted-foreground leading-8 mb-8">
            Nova AI Shop provides premium AI subscriptions for users in Iran with fast activation, transparent order
            tracking, and 24/7 Telegram support.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/chatgpt">
              ChatGPT Subscription
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/gemini">
              Gemini Pro / Ultra Subscription
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/grok">
              Grok Access on X
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/perplexity">
              Perplexity Pro Subscription
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/claude">
              Claude Pro Subscription
            </Link>
            <Link className="rounded-2xl border border-border p-4 hover:border-primary/40" to="/services/cursor">
              Cursor Pro Subscription
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Looking for Persian pages? Go to the{" "}
            <Link to="/" className="text-accent underline">
              main Persian homepage
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
};

export default EnglishHome;
