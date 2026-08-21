/**
 * Deterministic sitemap generator.
 *
 * Sources: scripts/routes-meta.mjs (marketing routes, incl. static pages) +
 * src/data/blogPosts.ts (articles, lastmod from dateISO). Writes BOTH
 * public/sitemap.xml (source, survives next build) and dist/sitemap.xml
 * (live now). New blog posts and routes therefore enter the sitemap
 * automatically — no more manual editing.
 *
 * Runs as part of `npm run build` (last step).
 */
import { build } from "esbuild";
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { routes, SITE } from "./routes-meta.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");

const tmpFile = path.join(distDir, ".blogdata3.mjs");
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

const urls = [];
for (const route of routes) {
  urls.push({ loc: `${SITE}${route.path === "/" ? "/" : route.path}` });
}
for (const post of Object.values(blogPosts)) {
  urls.push({
    loc: `${SITE}/blog/${post.id}`,
    lastmod: post.dateISO ? post.dateISO.slice(0, 10) : undefined,
  });
}

// Deterministic: keep routes-meta order, then blog posts sorted by slug.
const routeCount = routes.length;
const blogUrls = urls.slice(routeCount).sort((a, b) => a.loc.localeCompare(b.loc));
const finalUrls = [...urls.slice(0, routeCount), ...blogUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${finalUrls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`
  )
  .join("\n")}
</urlset>
`;

await writeFile(path.join(rootDir, "public", "sitemap.xml"), xml, "utf8");
await writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
console.log(`sitemap.xml written with ${finalUrls.length} URLs`);
