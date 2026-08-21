/**
 * Post-build route prerenderer (marketing pages).
 *
 * Root cause of the site's indexing problem: every SPA route served the same
 * <head> (identical title, no canonical, og:url pointing at the homepage), so
 * Google treated services/categories as duplicates of the homepage and skipped
 * them. This script writes dist/<route>/index.html for every route in
 * scripts/routes-meta.mjs with:
 *   - unique <title>, meta description, canonical, og:* tags
 *   - BreadcrumbList JSON-LD everywhere, Organization+WebSite on the homepage,
 *     Product JSON-LD (no price claims) on service pages
 *   - a small crawler-visible content block inside #root with real internal
 *     links (React replaces it on hydration, same pattern as prerender-blog)
 *   - /blog listing page with links to every article (crawl discovery)
 *
 * Static routes (type "static": /terms, /gemini-offer-terms) are served by
 * nginx from separate files — they are skipped here and only used for the
 * sitemap.
 *
 * Runs as part of `npm run build`, AFTER prerender-blog.mjs.
 */
import { build } from "esbuild";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { routes, SITE } from "./routes-meta.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");

const tmpFile = path.join(distDir, ".blogdata2.mjs");
await build({
  entryPoints: [path.join(rootDir, "src/data/blogPosts.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmpFile,
  logLevel: "silent",
});
const { blogPosts } = await import(pathToFileURL(tmpFile).href);
await rm(tmpFile, { force: true });

const template = await readFile(path.join(distDir, "index.html"), "utf8");

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const breadcrumbLd = (crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map(([name, href], index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    ...(index < crumbs.length - 1 ? { item: `${SITE}${href}` } : {}),
  })),
});

const orgLd = () => [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nova AI Shop",
    alternateName: "نوا شاپ",
    url: SITE,
    logo: `${SITE}/nova-logo.webp`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE}/support`,
      availableLanguage: ["fa", "en"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nova AI Shop",
    url: SITE,
    inLanguage: "fa",
  },
];

// Live catalog prices (sale-aware) so Product LD carries real offers —
// a Product without offers/review/aggregateRating is an invalid rich result.
// Prices are stored in toman; schema.org wants ISO 4217, so we emit IRR (×10).
const CATALOG_SLUG_BY_PATH = {
  "/services/chatgpt": "chatgpt",
  "/services/gemini": "gemini",
  "/services/claude": "adm_item_ff9df3",
  "/services/grok": "adm_grok",
  "/services/cards": "adm_item_97f156",
};

const catalogOffers = {};
try {
  // surface=site so a mini-app-only product never gets Product/offer markup here.
  const res = await fetch("https://nova-shop.co/api/v1/catalog?surface=site");
  const catalog = await res.json();
  for (const product of catalog.products || []) {
    const prices = (product.plans || [])
      .map((plan) => plan?.sale?.sale_price ?? plan?.price)
      .filter((price) => Number.isFinite(price) && price > 0);
    if (!prices.length) continue;
    catalogOffers[product.slug] = {
      "@type": "AggregateOffer",
      priceCurrency: "IRR",
      lowPrice: String(Math.min(...prices) * 10),
      highPrice: String(Math.max(...prices) * 10),
      offerCount: String(prices.length),
      availability: "https://schema.org/InStock",
      url: undefined, // set per route below
      seller: { "@type": "Organization", name: "Nova AI Shop" },
    };
  }
} catch (error) {
  console.warn(`catalog fetch failed — Product LD without offers will be skipped (${error.message})`);
}

const productLd = (route) => {
  const slug = CATALOG_SLUG_BY_PATH[route.path];
  const offers = slug ? catalogOffers[slug] : null;
  // No real price data → no Product snippet (never invent offers; an
  // offer-less Product is flagged invalid by Search Console).
  if (!offers) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: route.product.name,
    brand: { "@type": "Brand", name: route.product.brand },
    image: `${SITE}${route.product.image}`,
    description: route.description,
    url: `${SITE}${route.path}`,
    offers: { ...offers, url: `${SITE}${route.path}` },
  };
};

function applyHead(html, route, url) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[\s\S]*?>/,
      `<meta name="description" content="${description}">`
    )
    // The shared shell pointed og:url/og:title at the homepage on every route —
    // replace instead of appending duplicates.
    .replace(/<meta property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(
      /<meta property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${description}" />`
    );

  const ld = [];
  if (route.type === "home") ld.push(...orgLd());
  if (route.product) {
    const product = productLd(route);
    if (product) ld.push(product);
  }
  ld.push(breadcrumbLd(route.crumbs));

  const extras = [
    `<link rel="canonical" href="${url}" />`,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  ].join("\n  ");
  return html.replace("</head>", `  ${extras}\n</head>`);
}

function crawlerBlock(route) {
  if (!route.h1) return "";
  const links = (route.links || [])
    .map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
    .join("");
  return `
    <section dir="rtl" lang="fa" style="max-width:860px;margin:0 auto;padding:24px 16px">
      <h1>${escapeHtml(route.h1)}</h1>
      <p>${escapeHtml(route.intro || route.description)}</p>
      ${links ? `<ul>${links}</ul>` : ""}
    </section>`;
}

function blogListBlock() {
  const items = Object.values(blogPosts)
    .map(
      (post) =>
        `<li><a href="/blog/${post.id}">${escapeHtml(post.title)}</a> — ${escapeHtml(post.excerpt)}</li>`
    )
    .join("\n");
  return `
    <section dir="rtl" lang="fa" style="max-width:860px;margin:0 auto;padding:24px 16px">
      <h1>بلاگ نوا شاپ</h1>
      <p>راهنماها، مقایسه‌ها و آموزش‌های دنیای هوش مصنوعی.</p>
      <ul>${items}</ul>
    </section>`;
}

function injectRoot(html, content) {
  if (!content) return html;
  const rootOpen = html.indexOf('<div id="root"');
  const rootClose = html.indexOf("</div>", rootOpen);
  if (rootOpen === -1 || rootClose === -1) throw new Error("no #root in template");
  const tagEnd = html.indexOf(">", rootOpen) + 1;
  return html.slice(0, tagEnd) + content + html.slice(rootClose);
}

let count = 0;
for (const route of routes) {
  if (route.type === "static") continue; // served from novashop-pages by nginx
  const url = `${SITE}${route.path === "/" ? "/" : route.path}`;
  let html = applyHead(template, route, url);
  if (route.lang === "en") {
    html = html.replace('<html lang="fa" dir="rtl">', '<html lang="en" dir="ltr">');
  }
  html = injectRoot(html, route.type === "bloglist" ? blogListBlock() : crawlerBlock(route));

  if (route.path === "/") {
    await writeFile(path.join(distDir, "index.html"), html, "utf8");
  } else {
    const outDir = path.join(distDir, route.path.replace(/^\//, ""));
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), html, "utf8");
  }
  count += 1;
}
console.log(`prerendered ${count} marketing routes`);
