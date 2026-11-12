import { BRAND_LOGO_SRC } from '@/lib/brand';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/site-url';

const escapedHost = siteConfig.cms.websiteKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const absoluteSiteHref = new RegExp(
  `^https?:\\/\\/(?:www\\.)?${escapedHost}(?=$|[/?#])`,
  'i'
);

/** CMS often ships via.placeholder “Breaking News” art — swap for brand mark. */
const PLACEHOLDER_IMG_SRC =
  /(?:via\.placeholder\.com|placehold\.co|placehold\.it|dummyimage\.com|(?:^|\/\/)placeholder\.com)|\bBreaking[\s+_%]*News\b/i;

export function bannerLogoFallbackSrc(origin?: string): string {
  if (origin?.trim()) {
    return `${origin.replace(/\/$/, '')}${BRAND_LOGO_SRC}`;
  }
  return absoluteUrl(BRAND_LOGO_SRC);
}

export const BANNER_FRAME_CLASS =
  'aspect-[2.2/1] min-h-[160px] w-full overflow-hidden sm:min-h-[200px] md:min-h-[240px]';

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

/** Fit one slide into the hero frame — CMS HTML often stacks many `.banner-slide`s. */
export const BANNER_FIT_STYLE = `<style>
*{box-sizing:border-box}
html,body{margin:0;width:100%;height:100%;max-width:100%;overflow:hidden!important;background:#1a1608}
.banner-slider,.banner-slide,.banner-link,.banner-image-wrapper{
  height:100%!important;width:100%!important;max-width:100%!important;max-height:100%!important;
  aspect-ratio:auto!important;margin:0!important;border:0!important;
  border-radius:0!important;box-shadow:none!important;overflow:hidden!important
}
.banner-image-wrapper img,.banner-slide img{width:100%!important;height:100%!important;object-fit:cover!important;display:block}
.banner-image-wrapper img.banner-logo-fallback,.banner-slide img.banner-logo-fallback{
  object-fit:contain!important;object-position:center;padding:8% 18%;background:#0b0f1a
}
.banner-overlay,.banner-content,.banner-text{max-width:100%;overflow:hidden}
.banner-slide ~ .banner-slide{display:none!important}
img,video{max-width:100%;display:block}
</style>`;

function withLogoFallback(html: string, logoSrc: string): string {
  return html.replace(/<img\b([^>]*?)>/gi, (full, attrs: string) => {
    const srcMatch = attrs.match(/\bsrc\s*=\s*(["'])([\s\S]*?)\1/i);
    if (!srcMatch) return full;
    const src = srcMatch[2].replace(/&amp;/g, '&').trim();
    if (!PLACEHOLDER_IMG_SRC.test(src)) return full;

    const quote = srcMatch[1];
    let next = attrs.replace(srcMatch[0], `src=${quote}${logoSrc}${quote}`);
    if (/\bclass\s*=\s*(["'])([\s\S]*?)\1/i.test(next)) {
      next = next.replace(/\bclass\s*=\s*(["'])([\s\S]*?)\1/i, (_m, q: string, cls: string) => {
        const merged = cls.includes('banner-logo-fallback')
          ? cls
          : `${cls} banner-logo-fallback`.trim();
        return `class=${q}${merged}${q}`;
      });
    } else {
      next += ' class="banner-logo-fallback"';
    }
    return `<img${next}>`;
  });
}

/** Rewrite placeholders → logo, same-site article links → `/artigo/...`. */
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
