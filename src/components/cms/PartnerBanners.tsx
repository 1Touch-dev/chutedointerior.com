/* eslint-disable @next/next/no-img-element */
import { getPartnerBanners, type PartnerPosition } from '@/lib/banners';
import PartnerPopup from '@/components/cms/PartnerPopup';

function BannerImage({
  imageUrl,
  linkUrl,
  name,
}: {
  imageUrl: string;
  linkUrl?: string;
  name?: string;
}) {
  const image = (
    // Partner creatives are arbitrary remote sizes — fixed slot prevents CLS.
    <img
      src={imageUrl}
      alt={name || 'Parceiro'}
      width={728}
      height={90}
      className="mx-auto h-full max-h-24 w-full object-contain sm:max-h-28"
      loading="lazy"
      decoding="async"
    />
  );
  if (!linkUrl) return image;
  return (
    <a href={linkUrl} target="_blank" rel="sponsored noopener noreferrer" className="block h-full">
      {image}
    </a>
  );
}

export default async function PartnerBanners({
  position,
  className = '',
}: {
  position: PartnerPosition;
  className?: string;
}) {
  const banners = await getPartnerBanners(position);
  if (!banners.length) return null;

  if (position === 'popup') {
    return <PartnerPopup banners={banners} />;
  }

  return (
    <aside aria-label={`Parceiros ${position}`} className={`min-w-0 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:gap-3 sm:py-3">
        {banners.map((banner, index) => (
          <div
            key={banner._id || `${banner.imageUrl}-${index}`}
            className="flex min-h-[96px] items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-white p-2 sm:min-h-[112px]"
          >
            <BannerImage imageUrl={banner.imageUrl} linkUrl={banner.linkUrl} name={banner.partnerName} />
          </div>
        ))}
      </div>
    </aside>
  );
}
