import { BRAND_LOGO_SRC } from '@/lib/brand';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/site-url';

const escapedHost = siteConfig.cms.websiteKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const absoluteSiteHref = new RegExp(
  `^https?:\\/\\/(?:www\\.)?${escapedHost}(?=$|[/?#])`,
  'i'
);

/** CMS often ships via.placeholder “Breaking News” art — treat as missing. */
const PLACEHOLDER_IMG_SRC =
  /(?:via\.placeholder\.com|placehold\.co|placehold\.it|dummyimage\.com|(?:^|\/\/)placeholder\.com)|\bBreaking[\s+_%]*News\b/i;

export function bannerLogoFallbackSrc(origin?: string): string {
  if (origin?.trim()) {
    return `${origin.replace(/\/$/, '')}${BRAND_LOGO_SRC}`;
  }
  return absoluteUrl(BRAND_LOGO_SRC);
}

/** Taller on mobile so title/excerpt fit; wider desk hero on sm+. */
export const BANNER_FRAME_CLASS =
  'aspect-[5/4] min-h-[220px] w-full overflow-hidden sm:aspect-[2/1] sm:min-h-[240px] md:aspect-[2.4/1] md:min-h-[280px]';

export function sameSitePath(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed.replace(/^\/noticias\//i, '/artigo/');
  }
  if (trimmed.startsWith('//')) {
    return sameSitePath(`https:${trimmed}`);
  }
  const match = trimmed.match(absoluteSiteHref);
  if (!match) return null;
  const rest = trimmed.slice(match[0].length);
  if (!rest) return '/';
  const path = rest.startsWith('/') ? rest : `/${rest}`;
  return path.replace(/^\/noticias\//i, '/artigo/');
}

export function isLikelyImageUrl(value?: string | null): boolean {
  if (!value?.trim()) return false;
  const url = value.trim();
  if (url.startsWith('data:image/')) return true;
  return /\.(avif|webp|png|jpe?g|gif|svg)(\?|#|$)/i.test(url);
}

export function isPlaceholderImageSrc(src?: string | null): boolean {
  if (!src?.trim()) return true;
  return PLACEHOLDER_IMG_SRC.test(src.trim().replace(/&amp;/g, '&'));
}

/** Strip executable bits from CMS banner HTML before iframe srcDoc. */
export function sanitizeBannerHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(["'])[\s\S]*?\1/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1=$2#$2');
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function stripTags(value?: string): string | undefined {
  if (!value) return undefined;
  const text = decodeEntities(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  return text || undefined;
}

function matchClassContent(html: string, className: string): string | undefined {
  const re = new RegExp(
    `<[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/`,
    'i'
  );
  return stripTags(html.match(re)?.[1]);
}

export type ParsedCmsBanner = {
  href?: string;
  image?: string;
  title?: string;
  excerpt?: string;
  category?: string;
  meta?: string;
};

/** Pull fields from Brazil CMS editorial HTML so we can render a native responsive slide. */
export function parseCmsBannerHtml(html: string): ParsedCmsBanner | null {
  const cleaned = sanitizeBannerHtml(html);
  const hrefRaw = cleaned.match(/<a\b[^>]*\bhref\s*=\s*(["'])([\s\S]*?)\1/i)?.[2];
  const imageRaw = cleaned.match(/<img\b[^>]*\bsrc\s*=\s*(["'])([\s\S]*?)\1/i)?.[2];
  const title =
    matchClassContent(cleaned, 'banner-title') ||
    stripTags(cleaned.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)?.[1]);
  const excerpt = matchClassContent(cleaned, 'banner-excerpt');
  const category = matchClassContent(cleaned, 'banner-category');
  const meta = matchClassContent(cleaned, 'banner-meta');

  if (!title && !imageRaw && !excerpt) return null;

  const hrefDecoded = hrefRaw ? decodeEntities(hrefRaw) : undefined;
  const local = hrefDecoded ? sameSitePath(hrefDecoded) : null;
  const imageDecoded = imageRaw ? decodeEntities(imageRaw) : undefined;

  return {
    href: local || hrefDecoded,
    image: imageDecoded && !isPlaceholderImageSrc(imageDecoded) ? imageDecoded : undefined,
    title,
    excerpt,
    category,
    meta,
  };
}

/** Fit one slide into the hero frame — last-resort iframe path only. */
export const BANNER_FIT_STYLE = `<style>
*{box-sizing:border-box}
html,body{margin:0;width:100%;height:100%;max-width:100%;overflow:hidden!important;background:#1a1608}
.banner-slider,.banner-slide,.banner-link,.banner-image-wrapper{
  height:100%!important;width:100%!important;max-width:100%!important;max-height:100%!important;
  aspect-ratio:auto!important;margin:0!important;border:0!important;
  border-radius:0!important;box-shadow:none!important;overflow:hidden!important
}
.banner-image-wrapper{position:relative!important;background:#0b0f1a!important}
.banner-image-wrapper img,.banner-slide img{width:100%!important;height:100%!important;object-fit:cover!important;display:block}
.banner-image-wrapper img.banner-logo-fallback,.banner-slide img.banner-logo-fallback{
  object-fit:contain!important;object-position:center;padding:10% 22%;background:#0b0f1a
}
.banner-brand-fallback{
  position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:12px;padding:24px;background:#c9a227;color:#1a1608;text-align:center
}
.banner-brand-fallback img{width:min(28%,112px);height:auto;max-height:112px;object-fit:contain;border-radius:8px}
.banner-brand-fallback span{font:700 15px/1.25 system-ui,sans-serif;letter-spacing:.02em}
.banner-overlay{
  position:absolute!important;inset:0!important;
  background:linear-gradient(180deg,rgba(10,12,18,.35) 0%,rgba(10,12,18,.55) 45%,rgba(10,12,18,.88) 100%)!important;
  pointer-events:none!important
}
.banner-content,.banner-text{
  position:absolute!important;inset:auto 0 0 0!important;max-width:100%!important;overflow:hidden!important;
  display:flex!important;flex-direction:column!important;justify-content:flex-end!important;
  padding:14% 14% 12%!important;color:#fff!important;text-shadow:0 8px 24px rgba(0,0,0,.55)!important
}
.banner-category{
  font-size:10px!important;line-height:1.2!important;margin:0 0 8px!important;max-width:100%!important
}
.banner-title{
  font-size:clamp(16px,4.2vw,34px)!important;line-height:1.2!important;margin:0 0 8px!important;
  max-height:2.5em!important;overflow:hidden!important;display:-webkit-box!important;
  -webkit-line-clamp:2!important;-webkit-box-orient:vertical!important
}
.banner-excerpt{
  font-size:clamp(12px,2.4vw,18px)!important;line-height:1.35!important;margin:0 0 6px!important;
  max-height:2.8em!important;overflow:hidden!important;display:-webkit-box!important;
  -webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;opacity:.92
}
.banner-meta{font-size:11px!important;opacity:.85;margin:0!important}
.banner-slide ~ .banner-slide{display:none!important}
img,video{max-width:100%;display:block}
@media (max-width:640px){
  .banner-content,.banner-text{padding:16% 12% 14%!important}
  .banner-title{font-size:clamp(15px,5.2vw,22px)!important;-webkit-line-clamp:3!important;max-height:3.6em!important}
  .banner-excerpt{display:none!important}
  .banner-meta{display:none!important}
}
</style>`;

function brandFallbackBlock(logoSrc: string, siteName: string): string {
  const safeName = siteName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<div class="banner-brand-fallback" role="img" aria-label="${safeName}"><img src="${logoSrc}" alt="${safeName}" /><span>${safeName}</span></div>`;
}

function withLogoFallback(html: string, logoSrc: string): string {
  const siteName = siteConfig.siteName;
  return html.replace(/<img\b([^>]*?)>/gi, (full, attrs: string) => {
    const srcMatch = attrs.match(/\bsrc\s*=\s*(["'])([\s\S]*?)\1/i);
    if (!srcMatch) return full;
    const src = srcMatch[2].replace(/&amp;/g, '&').trim();
    if (!PLACEHOLDER_IMG_SRC.test(src)) return full;
    return brandFallbackBlock(logoSrc, siteName);
  });
}

/** Rewrite placeholders → brand card, same-site article links → `/artigo/...`. */
export function prepareBannerHtml(html: string, logoSrc = bannerLogoFallbackSrc()): string {
  const cleaned = withLogoFallback(sanitizeBannerHtml(html), logoSrc);
  return cleaned.replace(/<a\b([^>]*?)>/gi, (full, attrs: string) => {
    const hrefMatch = attrs.match(/\bhref\s*=\s*(["'])([\s\S]*?)\1/i);
    if (!hrefMatch) return full;
    const path = sameSitePath(hrefMatch[2].replace(/&amp;/g, '&'));
    if (!path) return full;
    const quote = hrefMatch[1];
    let next = attrs.replace(hrefMatch[0], `href=${quote}${path}${quote}`);
    if (/\btarget\s*=/i.test(next)) {
      next = next.replace(/\btarget\s*=\s*(["'])[\s\S]*?\1/i, 'target="_top"');
    } else {
      next += ' target="_top"';
    }
    return `<a${next}>`;
  });
}
