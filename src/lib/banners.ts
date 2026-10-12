import { isLikelyImageUrl } from '@/lib/banner-html';
import { siteConfig } from '@/lib/site-config';

/** CMS public banner payload (avoid colliding with the React component name). */
export interface IEditorialBanner {
  _id?: string;
  type?: string;
  title?: string;
  url?: string;
  imageUrl?: string;
  htmlContent?: string;
  ctaUrl?: string;
  isActive?: boolean;
  status?: string;
}

interface BannerResponse {
  banner?: IEditorialBanner | null;
  banners?: IEditorialBanner[];
}

const base = (siteConfig.cms.baseUrl || '').replace(/\/$/, '');

const isUsable = (banner: IEditorialBanner) => {
  if (banner.isActive === false || banner.status === 'inactive') return false;
  if (banner.type === 'html') return Boolean(banner.htmlContent?.trim());
  return Boolean(banner.imageUrl?.trim() || isLikelyImageUrl(banner.url));
};

export type PartnerPosition = 'header' | 'content' | 'footer' | 'popup' | 'sidebar';

export interface PartnerBanner {
  _id?: string;
  imageUrl: string;
  linkUrl?: string;
  position?: PartnerPosition;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  partnerName?: string;
}

const isCurrent = (startDate?: string, endDate?: string) => {
  const now = Date.now();
  if (startDate) {
    const start = new Date(startDate).getTime();
    if (!Number.isNaN(start) && now < start) return false;
  }
  if (endDate) {
    const end = new Date(endDate).getTime();
    if (!Number.isNaN(end) && now > end) return false;
  }
  return true;
};

export const getPartnerBanners = async (position: PartnerPosition): Promise<PartnerBanner[]> => {
  if (!base) return [];
  try {
    const params = new URLSearchParams({
      website: siteConfig.cms.websiteKey,
      position,
    });
    const res = await fetch(`${base}/partnerships/banners?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { banners?: PartnerBanner[] };
    return (json.banners ?? []).filter(
      (banner) => banner.imageUrl && banner.isActive !== false && isCurrent(banner.startDate, banner.endDate)
    );
  } catch {
    return [];
  }
};

export const getEditorialBanners = async (): Promise<IEditorialBanner[]> => {
  if (!base) return [];
  try {
    const url = `${base}/banners/public/${encodeURIComponent(siteConfig.cms.websiteKey)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 30 } });
    if (!res.ok) return [];
    const json = (await res.json()) as BannerResponse;
    const list = Array.isArray(json.banners) && json.banners.length > 0 ? json.banners : [json.banner];
    return list.filter(
      (banner): banner is IEditorialBanner => Boolean(banner) && isUsable(banner as IEditorialBanner)
    );
  } catch {
    return [];
  }
};
