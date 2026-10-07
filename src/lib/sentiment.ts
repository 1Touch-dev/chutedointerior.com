import { siteConfig } from '@/lib/site-config';

export interface SentimentEvent {
  sourceType?: string;
  sourceId?: string;
  text?: string;
  status?: string;
  createdAt?: string;
  metadata?: { slug?: string; reaction?: string; rating?: number };
  analysis?: { overallLabel?: string };
}

interface SentimentListResponse {
  events?: SentimentEvent[];
  totalPages?: number;
}

const base = (siteConfig.cms.baseUrl || '').replace(/\/$/, '');

const buildUrl = (path: string, query?: Record<string, string | number>) => {
  const url = new URL(`${base}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export const getSlugEvents = async (slug: string): Promise<SentimentEvent[] | null> => {
  if (!base) return null;
  const matched: SentimentEvent[] = [];
  for (let page = 1; page <= 5; page += 1) {
    try {
      const res = await fetch(
        buildUrl('/sentiment/events', {
          website: siteConfig.cms.websiteKey,
          status: 'completed',
          limit: 100,
          page,
        }),
        { headers: { Accept: 'application/json' }, cache: 'no-store' }
      );
      if (!res.ok) return page === 1 ? null : matched;
      const json = (await res.json()) as SentimentListResponse;
      if (!Array.isArray(json.events)) return page === 1 ? null : matched;
      matched.push(...json.events.filter((event) => event.metadata?.slug === slug || (event.sourceId ?? '').startsWith(`${slug}:`)));
      if (page >= (json.totalPages ?? 1)) break;
    } catch {
      return page === 1 ? null : matched;
    }
  }
  return matched;
};

export const postSentiment = async (payload: Record<string, unknown>) => {
  if (!base) return false;
  try {
    const res = await fetch(`${base}/sentiment/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
};
