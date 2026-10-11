import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const site = "https://chutedointerior.com";
const now = new Date().toISOString();

const abs = (p) => (p === "/" ? `${site}/` : `${site}${p}`);

const hubs = [
  "/",
  "/ultimas",
  "/news",
  "/categories",
  "/futebol",
  "/ao-vivo",
  "/alertas",
  "/about",
  "/contact",
  "/estados",
];

const read = (rel) => {
  try {
    return fs.readFileSync(path.join(root, rel), "utf8");
  } catch {
    return "";
  }
};

const slugs = (text) => [...text.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);

const categories = [...new Set(slugs(read("src/lib/site-config.ts")))].slice(0, 30);
const states = [...new Set(slugs(read("src/data/brazilian-states.ts")))];
const competitions = [...new Set(slugs(read("src/lib/competitions.ts")))];
const articles = [...new Set(slugs(read("src/data/dummy.ts")))]
  .filter((s) => !states.includes(s) && !competitions.includes(s))
  .slice(0, 100);

const urls = [];
const push = (loc, freq = "daily", pri = "0.7") => {
  urls.push(
    `<url>\n<loc>${loc}</loc>\n<lastmod>${now}</lastmod>\n<changefreq>${freq}</changefreq>\n<priority>${pri}</priority>\n</url>`,
  );
};

hubs.forEach((h) => push(abs(h), h === "/" ? "hourly" : "daily", h === "/" ? "1" : "0.7"));
categories.forEach((s) => push(abs(`/categoria/${s}`)));
states.forEach((s) => push(abs(`/estados/${s}`), "weekly", "0.5"));
competitions.forEach((s) => push(abs(`/liga/${s}`), "hourly", "0.8"));
articles.forEach((s) => push(abs(`/artigo/${s}`), "weekly", "0.9"));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml);
console.log(`wrote ${urls.length} urls (${xml.length} bytes)`);
