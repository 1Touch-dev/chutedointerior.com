import EditorialBannerCarousel, {
  type EditorialSlide,
} from '@/components/cms/EditorialBannerCarousel';
import { getEditorialBanners, type IEditorialBanner } from '@/lib/banners';
import {
  isLikelyImageUrl,
  isPlaceholderImageSrc,
  parseCmsBannerHtml,
  sameSitePath,
} from '@/lib/banner-html';

function toSlide(banner: IEditorialBanner, index: number): EditorialSlide | null {
  const fallbackTitle = banner.title || 'Destaque';
  const id = banner._id || `${fallbackTitle}-${index}`;

  if (banner.type === 'html' && banner.htmlContent?.trim()) {
    const parsed = parseCmsBannerHtml(banner.htmlContent);
    if (parsed?.title || parsed?.image || parsed?.excerpt) {
      return {
        id,
        kind: 'hero',
        title: parsed.title || fallbackTitle,
        image: parsed.image,
        href: parsed.href,
        external: Boolean(parsed.href && !sameSitePath(parsed.href)),
        excerpt: parsed.excerpt,
        category: parsed.category,
        meta: parsed.meta,
      };
    }
    return { id, kind: 'html', title: fallbackTitle, html: banner.htmlContent };
  }

  const rawImage = banner.imageUrl || (isLikelyImageUrl(banner.url) ? banner.url : undefined);
  const image = rawImage && !isPlaceholderImageSrc(rawImage) ? rawImage : undefined;
  const rawHref = banner.ctaUrl || (!isLikelyImageUrl(banner.url) ? banner.url : undefined);
  const local = rawHref ? sameSitePath(rawHref) : null;

  if (!image && !fallbackTitle) return null;

  return {
    id,
    kind: 'hero',
    title: fallbackTitle,
    image,
    href: local || rawHref || undefined,
    external: Boolean(rawHref && !local),
  };
}

/** Homepage destaque carousel — CMS public banners with auto-rotate + controls. */
export default async function EditorialBanner() {
  const banners = await getEditorialBanners();
  const slides = banners
    .map((banner, index) => toSlide(banner, index))
    .filter((slide): slide is EditorialSlide => Boolean(slide));

  if (!slides.length) return null;

  return (
    <section aria-label="Destaque">
      <div className="mx-auto min-w-0 max-w-7xl px-4 py-4 sm:py-6">
        <EditorialBannerCarousel slides={slides} />
      </div>
    </section>
  );
}
