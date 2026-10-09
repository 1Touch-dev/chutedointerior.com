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
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt={name || 'Parceiro'} className="mx-auto h-auto max-h-28 w-full object-contain" />
  );
  if (!linkUrl) return image;
  return (
    <a href={linkUrl} target="_blank" rel="sponsored noopener noreferrer" className="block">
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
    <aside aria-label={`Parceiros ${position}`} className={className}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3">
        {banners.map((banner, index) => (
          <div key={`${banner.imageUrl}-${index}`} className="border border-black/10 bg-white p-2">
            <BannerImage imageUrl={banner.imageUrl} linkUrl={banner.linkUrl} name={banner.partnerName} />
          </div>
        ))}
      </div>
    </aside>
  );
}
