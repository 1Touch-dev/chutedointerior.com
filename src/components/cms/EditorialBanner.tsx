import { getEditorialBanners } from '@/lib/banners';

export default async function EditorialBanner() {
  const banners = await getEditorialBanners();
  const banner = banners[0];
  if (!banner) return null;

  const image = banner.imageUrl ?? banner.url;
  const href = banner.ctaUrl ?? banner.url;

  return (
    <section aria-label="Destaque patrocinado" className="border-b border-black/10 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-3">
        {banner.type === 'html' && banner.htmlContent?.trim() ? (
          <div
            className="overflow-hidden border border-black/10 bg-white p-2 text-sm text-foreground"
            dangerouslySetInnerHTML={{ __html: banner.htmlContent }}
          />
        ) : image ? (
          <a href={href || '#'} target={href ? '_blank' : undefined} rel={href ? 'noopener noreferrer' : undefined}>
            <img src={image} alt={banner.title || 'Banner'} className="h-auto max-h-[240px] w-full object-cover" loading="lazy" />
          </a>
        ) : null}
      </div>
    </section>
  );
}
