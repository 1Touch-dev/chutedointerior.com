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

const isUsable = (banner: EditorialBanner) => {
  if (banner.type === 'html') return Boolean(banner.htmlContent?.trim());
  return Boolean((banner.imageUrl ?? banner.url)?.trim());
};

export type PartnerPosition = 'header' | 'content' | 'footer' | 'popup';

export interface PartnerBanner {
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
      next: { revalidate: 120 },
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

export const getEditorialBanners = async (): Promise<EditorialBanner[]> => {
  if (!base) return [];
  try {
    const url = `${base}/banners/public/${encodeURIComponent(siteConfig.cms.websiteKey)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 120 } });
    if (!res.ok) return [];
    const json = (await res.json()) as BannerResponse;
    const list = Array.isArray(json.banners) && json.banners.length > 0 ? json.banners : [json.banner];
    return list.filter((banner): banner is EditorialBanner => Boolean(banner) && isUsable(banner as EditorialBanner));
  } catch {
    return [];
  }
};
