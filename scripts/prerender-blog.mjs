/**
 * Post-build blog prerenderer.
 *
 * For every blog post it writes dist/blog/<slug>/index.html: the SPA shell
 * with the post's real <title>, meta description, canonical, Open Graph tags,
 * Article + FAQPage JSON-LD and the rendered article HTML inside #root.
 * Crawlers (and AI assistants that don't run JS) get full content instantly;
 * when the SPA bundle loads, React replaces #root and the page behaves like
 * the normal client-side route.
 *
 * Runs as part of `npm run build`.
 */
import { build } from "esbuild";
import { marked } from "marked";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const SITE = "https://nova-shop.co";

// blogPosts.ts is TypeScript — bundle it to a temp ESM file, then import it.
const tmpFile = path.join(distDir, ".blogdata.mjs");
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

const jsonLdFor = (post, url) => {
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      image: `${SITE}${post.image}`,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Person", name: post.author },
      publisher: {
        "@type": "Organization",
        name: "Nova AI Shop",
        logo: { "@type": "ImageObject", url: `${SITE}/about-logo.webp` },
      },
      datePublished: post.dateISO || post.date,
      dateModified: post.dateISO || post.date,
    },
  ];
  if (post.faqs && post.faqs.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }
  return blocks;
};

let count = 0;
for (const post of Object.values(blogPosts)) {
  const url = `${SITE}/blog/${post.id}`;
  const title = post.metaTitle || `${post.title} | بلاگ نوا`;
  const description = post.metaDescription || post.excerpt;
  const articleHtml = marked.parse(post.content, { gfm: true, breaks: true });

  const headExtras = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}${post.image}" />`,
    `<meta property="article:published_time" content="${post.dateISO || ""}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLdFor(post, url))}</script>`,
  ].join("\n  ");

  const bodyContent = `
    <article dir="rtl" lang="fa" style="max-width:760px;margin:0 auto;padding:24px 16px;font-family:inherit">
      <nav><a href="/blog">بلاگ نوا شاپ</a></nav>
      <h1>${escapeHtml(post.title)}</h1>
      <p><em>${escapeHtml(post.author)} · ${escapeHtml(post.date)} · ${escapeHtml(post.readTime)} مطالعه</em></p>
      <img src="${post.image}" alt="${escapeHtml(`تصویر شاخص مقاله ${post.title} — بلاگ نوا شاپ`)}" width="96" height="96" loading="lazy" />
      ${articleHtml}
    </article>`;

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta name="description"[\s\S]*?>/,
      `<meta name="description" content="${escapeHtml(description)}">`
    )
    .replace("</head>", `  ${headExtras}\n</head>`);

  const rootOpen = html.indexOf('<div id="root"');
  const rootClose = html.indexOf("</div>", rootOpen);
  if (rootOpen === -1 || rootClose === -1) {
    throw new Error("Could not locate #root in dist/index.html");
  }
  const tagEnd = html.indexOf(">", rootOpen) + 1;
  html = html.slice(0, tagEnd) + bodyContent + html.slice(rootClose);

  const outDir = path.join(distDir, "blog", post.id);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), html, "utf8");
  count += 1;
}

console.log(`prerendered ${count} blog posts into dist/blog/*/index.html`);
