import { getResolvedIntegrations, loadPublicSiteConfig } from '@/lib/public-config';
import { siteConfig } from '@/lib/site-config';

export interface EditorialBanner {
  type?: string;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  htmlContent?: string;
  ctaUrl?: string;
  ctaLabel?: string;
}

interface BannerResponse {
  banner?: EditorialBanner | null;
  banners?: EditorialBanner[];
}

const base = (siteConfig.cms.baseUrl || '').replace(/\/$/, '');

const fullUrl = (pathOrAbsolute?: string) => {
  if (!pathOrAbsolute) return null;
  if (/^https?:\/\//i.test(pathOrAbsolute)) return pathOrAbsolute;
  if (!base) return null;
  return `${base}${pathOrAbsolute.startsWith('/') ? pathOrAbsolute : `/${pathOrAbsolute}`}`;
};

const isUsable = (banner: EditorialBanner) => {
  if (banner.type === 'html') return Boolean(banner.htmlContent?.trim());
  return Boolean((banner.imageUrl ?? banner.url)?.trim());
};

export const getEditorialBanners = async (): Promise<EditorialBanner[]> => {
  if (!base) return [];
  try {
    await loadPublicSiteConfig();
    const fromCatalog = fullUrl(getResolvedIntegrations().BANNERS);
    const url = fromCatalog || `${base}/banners/public/${encodeURIComponent(siteConfig.cms.websiteKey)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 120 } });
    if (!res.ok) return [];
    const json = (await res.json()) as BannerResponse;
    const list = Array.isArray(json.banners) && json.banners.length > 0 ? json.banners : [json.banner];
    return list.filter((banner): banner is EditorialBanner => Boolean(banner) && isUsable(banner as EditorialBanner));
  } catch {
    return [];
  }
};
