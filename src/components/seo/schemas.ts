// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nova AI Shop",
  "url": "https://nova-ai-shop.lovable.app",
  "logo": "https://nova-ai-shop.lovable.app/logos/chatgpt.png",
  "description": "فروشگاه اکانت‌های پریمیوم هوش مصنوعی با تحویل فوری و پشتیبانی دائمی",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Persian", "English"],
    "url": "https://t.me/Nova_AI_Support"
  },
  "sameAs": [
    "https://t.me/nova_ai_shop"
  ]
};

// WebSite Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nova AI Shop",
  "url": "https://nova-ai-shop.lovable.app",
  "description": "خرید اکانت‌های پریمیوم هوش مصنوعی با تحویل فوری",
  "inLanguage": "fa-IR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nova-ai-shop.lovable.app/?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Product Schema Generator
export const createProductSchema = ({
  name,
  description,
  price,
  currency = "IRR",
  image,
  url,
  brand = "Nova AI Shop",
  availability = "InStock",
  ratingValue,
  reviewCount,
}: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image?: string;
  url: string;
  brand?: string;
  availability?: string;
  ratingValue?: number;
  reviewCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "image": image,
  "url": `https://nova-ai-shop.lovable.app${url}`,
  "brand": {
    "@type": "Brand",
    "name": brand
  },
  "offers": {
    "@type": "Offer",
    "price": price,
    "priceCurrency": currency,
    "availability": `https://schema.org/${availability}`,
    "seller": {
      "@type": "Organization",
      "name": "Nova AI Shop"
    }
  },
  ...(ratingValue && reviewCount ? {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount
    }
  } : {})
});

// FAQ Schema Generator
export const createFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// BreadcrumbList Schema Generator
export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://nova-ai-shop.lovable.app${item.url}`
  }))
});

// LocalBusiness Schema (for trust)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Nova AI Shop",
  "description": "فروشگاه آنلاین اکانت‌های پریمیوم هوش مصنوعی",
  "url": "https://nova-ai-shop.lovable.app",
  "telephone": "+98",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IR"
  },
  "priceRange": "$$",
  "openingHours": "Mo-Su 00:00-24:00",
  "paymentAccepted": ["Cash", "Credit Card", "Cryptocurrency"],
  "currenciesAccepted": "IRR"
};
