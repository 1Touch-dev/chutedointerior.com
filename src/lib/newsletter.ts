import { siteConfig } from '@/lib/site-config';

export type NewsletterResult =
  | { ok: true; status: 'subscribed' | 'already-subscribed' }
  | { ok: false; message: string };
export type UnsubscribeResult = 'unsubscribed' | 'already' | 'missing' | 'not-found' | 'failed';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const apiBase = (
  process.env.NEXT_PUBLIC_NEWSLETTER_API_BASE ||
  process.env.NEXT_PUBLIC_CMS_URL ||
  siteConfig.cms.baseUrl
).replace(/\/$/, '');

const endpoint = `${apiBase}/subscriptions/subscribe`;

const bodyMessage = (body: unknown): string => {
  if (typeof body === 'string') return body;
  if (!body || typeof body !== 'object') return '';
  if ('message' in body && body.message) return String(body.message);
  if ('errors' in body && Array.isArray(body.errors)) {
    const first = body.errors[0];
    if (first && typeof first === 'object' && 'msg' in first && first.msg) return String(first.msg);
  }
  return '';
};

const alreadySubscribed = (status: number, body: unknown) =>
  status === 409 || /already\s*subscribed|already\s*exists|ja\s*inscrit|já\s*inscrit|duplicat/i.test(bodyMessage(body));

export const isValidEmail = (email: string) => EMAIL_RE.test(email.trim());

export const subscribeNewsletter = async (email: string): Promise<NewsletterResult> => {
  const trimmed = email.trim().toLowerCase();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: trimmed, website: siteConfig.cms.websiteKey }),
      signal: controller.signal,
    });

    let body: unknown = null;
    try {
      const text = (await res.text()).trim();
      body = text ? (JSON.parse(text) as unknown) : null;
    } catch {
      body = null;
    }

    if (res.ok) return { ok: true, status: 'subscribed' };
    if (alreadySubscribed(res.status, body)) return { ok: true, status: 'already-subscribed' };
    return { ok: false, message: bodyMessage(body) || 'Nao foi possivel assinar agora.' };
  } catch {
    return { ok: false, message: 'Nao foi possivel assinar agora.' };
  } finally {
    clearTimeout(timer);
  }
};

export const unsubscribeNewsletter = async (
  email: string,
  website = siteConfig.cms.websiteKey
): Promise<UnsubscribeResult> => {
  const trimmedEmail = email.trim();
  const trimmedWebsite = website.trim();
  if (!trimmedEmail || !trimmedWebsite) return 'missing';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const url = new URL(`${apiBase}/subscriptions/unsubscribe`);
    url.searchParams.set('email', trimmedEmail);
    url.searchParams.set('website', trimmedWebsite);
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    });
    let body: unknown = null;
    try {
      const text = (await res.text()).trim();
      body = text ? (JSON.parse(text) as unknown) : null;
    } catch {
      body = null;
    }
    const message = bodyMessage(body);
    if (res.ok) return 'unsubscribed';
    if (res.status === 404) return 'not-found';
    if (res.status === 400 && /already\s*unsubscribed/i.test(message)) return 'already';
    if (res.status === 400 && /required/i.test(message)) return 'missing';
    return 'failed';
  } catch {
    return 'failed';
  } finally {
    clearTimeout(timer);
  }
};
