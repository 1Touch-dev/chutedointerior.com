/* eslint-disable @next/next/no-img-element */
import HtmlBannerFrame from '@/components/cms/HtmlBannerFrame';
import { getEditorialBanners } from '@/lib/banners';
import { BANNER_FRAME_CLASS, isLikelyImageUrl, sameSitePath } from '@/lib/banner-html';

/** Single homepage destaque — first usable banner only. */
export default async function EditorialBanner() {
  const banners = await getEditorialBanners();
  const banner = banners[0];
  if (!banner) return null;

  const image = banner.imageUrl || (isLikelyImageUrl(banner.url) ? banner.url : undefined);
  const href = banner.ctaUrl || (!isLikelyImageUrl(banner.url) ? banner.url : undefined);
  const local = href ? sameSitePath(href) : null;

  return (
    <section aria-label="Destaque" className="border-b border-black/10 bg-surface">
      <div className="mx-auto min-w-0 max-w-7xl px-4 py-4 sm:py-6">
        {banner.type === 'html' && banner.htmlContent?.trim() ? (
          <HtmlBannerFrame
            html={banner.htmlContent}
            title={banner.title || 'Destaque'}
            className="overflow-hidden rounded-xl"
          />
        ) : image ? (
          href ? (
            <a
              href={local || href}
              className="block overflow-hidden rounded-xl"
              {...(local ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <img
                src={image}
                alt={banner.title || 'Destaque'}
                className={`${BANNER_FRAME_CLASS} object-cover`}
              />
            </a>
          ) : (
            <img
              src={image}
              alt={banner.title || 'Destaque'}
              className={`${BANNER_FRAME_CLASS} rounded-xl object-cover`}
            />
          )
        ) : null}
      </div>
    </section>
  );
}
