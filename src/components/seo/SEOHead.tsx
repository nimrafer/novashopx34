import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  jsonLd?: object | object[];
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  product?: {
    price?: string;
    currency?: string;
    availability?: string;
  };
}

const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/2BLhx4pGbbVjvWowaDBmvYeT3Ec2/social-images/social-1758825622907-Linea OG Image.png",
  ogType = "website",
  jsonLd,
  noindex = false,
  article,
  product,
}: SEOHeadProps) => {
  const siteUrl = "https://novateam.shop";
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  
  // Ensure title is under 60 chars and description under 160 chars
  const optimizedTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="fa" dir="rtl" />
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={optimizedTitle} />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:site_name" content="نوا شاپ - Nova AI Shop" />
      
      {/* Product specific OG tags */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content={product.currency || "IRR"} />
          <meta property="product:availability" content={product.availability || "in stock"} />
        </>
      )}
      
      {/* Article specific OG tags */}
      {article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags?.map((tag, i) => <meta key={i} property="article:tag" content={tag} />)}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={optimizedTitle} />
      <meta name="twitter:site" content="@NovaAIShop" />
      <meta name="twitter:creator" content="@NovaAIShop" />
      
      {/* Additional SEO */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <meta name="bingbot" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content="Persian" />
      <meta name="revisit-after" content="3 days" />
      <meta name="author" content="Nova AI Shop" />
      <meta name="publisher" content="Nova AI Shop" />
      <meta name="copyright" content="Nova AI Shop" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IR" />
      <meta name="geo.placename" content="Iran" />
      <meta name="geo.position" content="35.6892;51.3890" />
      <meta name="ICBM" content="35.6892, 51.3890" />
      <meta name="content-language" content="fa" />
      
      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="نوا شاپ" />
      <meta name="application-name" content="نوا شاپ" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Security & Performance */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Alternate languages (for future) */}
      <link rel="alternate" hrefLang="fa" href={fullCanonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullCanonicalUrl} />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
