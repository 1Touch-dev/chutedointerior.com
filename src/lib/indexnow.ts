import { siteUrl } from '@/lib/site-url';

/** Static IndexNow key (also served at /{key}.txt). Override with INDEXNOW_KEY. */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || 'cdi7f3a91b4d2e8065a1c4b89d27f6aa';

const sent = new Set<string>();

/**
 * Notify IndexNow of fresh URLs. No-op outside production.
 * Call after sitemap/news-sitemap builds or when CMS content is revalidated.
 */
export const notifyIndexNow = async (urls: string[]): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') return;

  const fresh = [...new Set(urls.filter((url) => url.startsWith(`${siteUrl}/`)))]
    .filter((url) => !sent.has(url))
    .slice(0, 100);
  if (!fresh.length) return;

  fresh.forEach((url) => sent.add(url));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(siteUrl).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
        urlList: fresh,
      }),
      signal: controller.signal,
    });
  } catch {
    fresh.forEach((url) => sent.delete(url));
  } finally {
    clearTimeout(timer);
  }
};
