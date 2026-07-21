import { useMemo } from "react";
import { Package } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ServicePageLayout from "@/components/shop/ServicePageLayout";
import SEOHead from "@/components/seo/SEOHead";
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createProductSchema,
} from "@/components/seo/schemas";
import {
  StoreBlock,
  StoreProduct,
  findStoreProduct,
  formatToman,
  storeMinPrice,
  storeProductRoute,
  useStoreCatalog,
} from "@/hooks/useStoreCatalog";

interface StoreServicePageProps {
  slug?: string;
}

const enabledBlocks = (product: StoreProduct, type: string): StoreBlock[] =>
  (product.content_blocks || []).filter(
    (block) => block && block.enabled !== false && block.type === type
  );

const parseFaqItems = (blocks: StoreBlock[]) =>
  blocks.flatMap((block) =>
    (block.items || [])
      .map((item) => {
        const parts = String(item).split(/\s*(?:::|\|)\s*/);
        const question = parts.shift() || "";
        return { question, answer: parts.join(" — ") };
      })
      .filter((faq) => faq.question && faq.answer)
  );

const toneClass: Record<string, string> = {
  brand: "border-primary/30 bg-primary/5",
  info: "border-sky-500/30 bg-sky-500/5",
  success: "border-emerald-500/30 bg-emerald-500/5",
  warning: "border-amber-500/30 bg-amber-500/10",
  neutral: "border-border/50 bg-muted/20",
};

const ContentBlocks = ({ product }: { product: StoreProduct }) => {
  const blocks = (product.content_blocks || []).filter(
    (block) =>
      block &&
      block.enabled !== false &&
      ["intro", "text", "notice", "features"].includes(block.type) &&
      (block.title || block.body || (block.items || []).length)
  );
  if (!blocks.length) return null;
  return (
    <section className="py-6">
      <div className="container mx-auto px-4 space-y-6 max-w-4xl">
        {blocks.map((block, index) => (
          <div
            key={block.id || index}
            className={`glass rounded-3xl p-6 border ${toneClass[block.tone || "neutral"] || toneClass.neutral}`}
          >
            {block.title && <h2 className="text-xl font-bold mb-3">{block.title}</h2>}
            {block.body && (
              <p className="leading-8 text-muted-foreground whitespace-pre-line text-justify">
                {block.body}
              </p>
            )}
            {(block.items || []).length > 0 && (
              <ul className="mt-4 space-y-2">
                {(block.items || []).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const StoreServicePage = ({ slug: slugProp }: StoreServicePageProps) => {
  const params = useParams();
  const routeSlug = slugProp || params.serviceSlug || "";
  const { catalog, loading } = useStoreCatalog();

  const product = useMemo(
    () => (catalog ? findStoreProduct(catalog.products, routeSlug) : undefined),
    [catalog, routeSlug]
  );

  const adapted = useMemo(() => {
    if (!product) return null;
    const groups = [...(product.plan_groups || [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
    const plans = [...(product.plans || [])]
      .filter((plan) => !plan.draft && plan.status === "active")
      .sort((a, b) => {
        const groupIndex = (id: string | null) => {
          const index = groups.findIndex((g) => g.id === id);
          return index === -1 ? groups.length : index;
        };
        return (
          groupIndex(a.plan_group_id) - groupIndex(b.plan_group_id) ||
          a.sort_order - b.sort_order
        );
      })
      .map((plan) => ({
        id: String(plan.id),
        name: plan.name,
        duration: plan.short_description || "",
        price: plan.price,
        features: plan.features || [],
        popular: plan.popular,
        description: plan.description || undefined,
        image: plan.image_url && !plan.image_url.startsWith("/app/") ? plan.image_url : undefined,
        badge: plan.custom_badges?.[0]?.label,
        badges: (plan.custom_badges || []).map((badge) => ({
          label: badge.label,
          text_color: badge.text_color,
          background_color: badge.background_color,
        })),
        groupId: plan.plan_group_id || "other",
        requiresActivationEmail: /جیمیل|ایمیل شخصی|روی ایمیل/.test(
          `${plan.description} ${(plan.features || []).join(" ")} ${product.description}`
        ),
        activationEmailLabel: "جیمیل/ایمیل فعال‌سازی",
      }));
    const featureBlocks = enabledBlocks(product, "features");
    const features = featureBlocks.length
      ? featureBlocks.flatMap((block) => block.items || []).slice(0, 6)
      : [
          "قیمت و موجودی لحظه‌ای — همگام با پنل نوا شاپ",
          "ثبت سفارش آنلاین و پیگیری از پنل کاربری",
          "تحویل سریع و پشتیبانی فارسی پس از خرید",
        ];
    const faqs = parseFaqItems(enabledBlocks(product, "faq"));
    return { groups, plans, features, faqs };
  }, [product]);

  if (loading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!product || !adapted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-2xl font-bold">این سرویس در حال حاضر ارائه نمی‌شود</h1>
        <p className="text-muted-foreground">
          لیست کامل سرویس‌های فعال را در صفحه اصلی ببینید.
        </p>
        <Link to="/" className="text-primary hover:underline">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const route = storeProductRoute(product);
  const minPrice = storeMinPrice(product);
  const seoTitle = `خرید اکانت ${product.name} | قیمت از ${formatToman(minPrice)} | تحویل فوری - نوا شاپ`;
  const seoDescription = `${
    product.short_description || product.eyebrow || `خرید اشتراک ${product.name}`
  } ✅ قیمت به‌روز، فعال‌سازی سریع، گارانتی و پشتیبانی فارسی. ${
    adapted.plans.length
  } پلن فعال از ${formatToman(minPrice)}.`;

  const jsonLd = [
    createProductSchema({
      name: `اکانت ${product.name}`,
      description: product.short_description || product.description || product.name,
      price: minPrice * 10, // IRR
      url: route,
      category: "اشتراک هوش مصنوعی و سرویس دیجیتال",
      sku: product.slug,
    }),
    createBreadcrumbSchema([
      { name: "نوا شاپ", url: "/" },
      { name: product.name, url: route },
    ]),
    ...(adapted.faqs.length ? [createFAQSchema(adapted.faqs)] : []),
  ];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={`خرید اکانت ${product.name}, خرید اشتراک ${product.name}, قیمت ${product.name}, ${(product.search_aliases || []).join(", ")}`}
        canonicalUrl={route}
        ogType="product"
        jsonLd={jsonLd}
      />
      <ServicePageLayout
        serviceId={`store:${product.slug}`}
        icon={Package}
        logoSrc={product.image_url && !product.image_url.startsWith("/app/") ? product.image_url : undefined}
        title={product.name}
        subtitle={product.eyebrow || `${adapted.plans.length.toLocaleString("fa-IR")} پلن فعال`}
        description={product.description || product.short_description}
        color={product.accent_color || "#7C3AED"}
        features={adapted.features}
        plans={adapted.plans}
        planGroups={adapted.groups}
        faqs={adapted.faqs.length ? adapted.faqs : undefined}
        extraContent={<ContentBlocks product={product} />}
      />
    </>
  );
};

export default StoreServicePage;
