// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "نوا شاپ - Nova AI Shop",
  "alternateName": ["نوا ای آی شاپ", "Nova Shop", "نوا"],
  "url": "https://nova-shop.co",
  "logo": "https://nova-shop.co/nova-logo.jpeg",
  "description": "فروشگاه تخصصی اکانت‌های پریمیوم هوش مصنوعی در ایران - خرید اشتراک چت جی پی تی (ChatGPT)، جمینای (Gemini)، گراک (Grok)، پرپلکسیتی (Perplexity) و کرسور (Cursor) با تحویل فوری و پشتیبانی دائمی",
  "foundingDate": "2022",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IR",
    "addressLocality": "ایران"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Persian", "English"],
    "url": "https://t.me/Nova_Ai_Support",
    "areaServed": "IR"
  },
  "sameAs": [
    "https://t.me/Nova_Ai_Shop",
    "https://t.me/Nova_Ai_Support"
  ]
};

// WebSite Schema with enhanced search
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "نوا شاپ - Nova AI Shop",
  "alternateName": "فروشگاه نوا",
  "url": "https://nova-shop.co",
  "description": "خرید اکانت‌های پریمیوم هوش مصنوعی چت جی پی تی (ChatGPT)، جمینای (Gemini)، گراک (Grok)، پرپلکسیتی (Perplexity)، کرسور (Cursor) با تحویل فوری و پشتیبانی دائمی",
  "inLanguage": "fa-IR",
  "publisher": {
    "@type": "Organization",
    "name": "Nova AI Shop"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://nova-shop.co/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Product Schema Generator with enhanced fields
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
  sku,
  category,
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
  sku?: string;
  category?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "image": image,
  "url": `https://nova-shop.co${url}`,
  "sku": sku,
  "category": category || "اشتراک هوش مصنوعی",
  "brand": {
    "@type": "Brand",
    "name": brand
  },
  "offers": {
    "@type": "Offer",
    "price": price,
    "priceCurrency": currency,
    "availability": `https://schema.org/${availability}`,
    "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    "seller": {
      "@type": "Organization",
      "name": "Nova AI Shop"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 0,
          "maxValue": 1,
          "unitCode": "HUR"
        }
      }
    }
  },
  ...(ratingValue && reviewCount ? {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "bestRating": "5",
      "worstRating": "1",
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
    "item": `https://nova-shop.co${item.url}`
  }))
});

// LocalBusiness Schema (for trust)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "نوا شاپ - Nova AI Shop",
  "description": "فروشگاه آنلاین اکانت‌های پریمیوم هوش مصنوعی - خرید چت جی پی تی (ChatGPT)، جمینای (Gemini)، گراک (Grok)، پرپلکسیتی (Perplexity)، کرسور (Cursor)",
  "url": "https://nova-shop.co",
  "telephone": "+98 999 970 8896",
  "image": "https://nova-shop.co/nova-logo.jpeg",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IR",
    "addressLocality": "تهران",
    "streetAddress": "خیابان انقلاب، خیابان ۱۹ آذر - پلاک ۳۱",
    "postalCode": "11367"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "35.6892",
    "longitude": "51.3890"
  },
  "priceRange": "$$",
  "openingHours": "Mo-Su 00:00-24:00",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "paymentAccepted": ["Cash", "Credit Card", "Cryptocurrency", "کارت بانکی"],
  "currenciesAccepted": "IRR",
  "areaServed": {
    "@type": "Country",
    "name": "Iran"
  }
};

// Service Schema for AI services
export const createServiceSchema = ({
  name,
  description,
  provider,
  url,
  image,
  price,
  category,
}: {
  name: string;
  description: string;
  provider?: string;
  url: string;
  image?: string;
  price?: number;
  category?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": category || "اشتراک هوش مصنوعی",
  "name": name,
  "description": description,
  "url": `https://nova-shop.co${url}`,
  "image": image,
  "provider": {
    "@type": "Organization",
    "name": provider || "Nova AI Shop"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Iran"
  },
  ...(price ? {
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "IRR",
      "availability": "https://schema.org/InStock"
    }
  } : {})
});

// Article Schema for blog posts
export const createArticleSchema = ({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  image?: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": image,
  "url": `https://nova-shop.co${url}`,
  "datePublished": datePublished,
  "dateModified": dateModified || datePublished,
  "author": {
    "@type": "Person",
    "name": author || "تیم نوا"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nova AI Shop",
    "logo": {
      "@type": "ImageObject",
      "url": "https://nova-shop.co/nova-logo.jpeg"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://nova-shop.co${url}`
  }
});

// ItemList Schema for product listings
export const createItemListSchema = (items: { name: string; url: string; position: number }[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": items.map((item) => ({
    "@type": "ListItem",
    "position": item.position,
    "name": item.name,
    "url": `https://nova-shop.co${item.url}`
  }))
});

// HowTo Schema for guides
export const createHowToSchema = ({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": name,
  "description": description,
  "totalTime": totalTime || "PT5M",
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text
  }))
});
