import EditorialBannerCarousel, {
  type EditorialSlide,
} from '@/components/cms/EditorialBannerCarousel';
import { getEditorialBanners, type IEditorialBanner } from '@/lib/banners';
import { isLikelyImageUrl, sameSitePath } from '@/lib/banner-html';

function toSlide(banner: IEditorialBanner, index: number): EditorialSlide | null {
  const title = banner.title || 'Destaque';
  const id = banner._id || `${title}-${index}`;

  if (banner.type === 'html' && banner.htmlContent?.trim()) {
    return { id, kind: 'html', title, html: banner.htmlContent };
  }

  const image = banner.imageUrl || (isLikelyImageUrl(banner.url) ? banner.url : undefined);
  if (!image) return null;

  const rawHref = banner.ctaUrl || (!isLikelyImageUrl(banner.url) ? banner.url : undefined);
  const local = rawHref ? sameSitePath(rawHref) : null;

  return {
    id,
    kind: 'image',
    title,
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
