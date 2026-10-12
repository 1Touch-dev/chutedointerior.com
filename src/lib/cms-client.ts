import {
  alerts as rawAlerts,
  liveStories as rawLiveStories,
  type Article,
  type Category,
  type BreakingHeadline,
  type AlertItem,
  type LiveStory,
} from '@/data/dummy';
import { siteConfig } from '@/lib/site-config';
import { BRAZILIAN_STATES, getStateByUf, type BrazilianState } from '@/data/brazilian-states';
import { cmsSectionByEndpoint, cmsSectionBySlug, cmsSections } from '@/lib/sections';

export type { Article, Category, BreakingHeadline, AlertItem, LiveStory, BrazilianState };

const CMS_BASE = (siteConfig.cms.baseUrl || '').replace(/\/$/, '');
const WEBSITE_KEY = siteConfig.cms.websiteKey;

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isPublic(doc: Record<string, unknown>): boolean {
  // Deny-by-default — only published rows on the public site.
  if (String(doc.publishState || '') !== 'published') return false;
  const scheduled = doc.scheduledTime;
  if (scheduled) {
    const t = new Date(String(scheduled)).getTime();
    if (!Number.isNaN(t) && t > Date.now()) return false;
  }
  return true;
}

/** Stable to the minute so Next fetch cache + revalidate actually hit. */
function scheduledBeforeBucket(): string {
  const bucket = new Date();
  bucket.setUTCSeconds(0, 0);
  return bucket.toISOString();
}

function assignmentNames(raw: Record<string, unknown>): string[] {
  const names: string[] = [];
  const assigned = raw.endpointAssignments;
  if (Array.isArray(assigned)) {
    assigned.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const name = String((item as { name?: string }).name || '').trim();
      if (name) names.push(name);
    });
  } else if (assigned && typeof assigned === 'object') {
    const name = String((assigned as { name?: string }).name || '').trim();
    if (name) names.push(name);
  }
  const section = typeof raw.websiteSection === 'string' ? raw.websiteSection.trim() : '';
  if (section) names.push(section);
  return names;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInlineMarkdown(value: string): string {
  const withLinks = escapeHtml(value).replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g,
    (_match, label: string, href: string) => `<a href="${href}">${label}</a>`
  );

  return withLinks
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])_([^_\n]+?)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])\*([^*\n]+?)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
}

function renderBody(value: string): string {
  const source = value.replace(/\r\n/g, '\n').trim();
  if (!source) return '';
  if (/<\/?(p|div|h[1-6]|ul|ol|li|br|blockquote|figure|section)\b/i.test(source)) return source;

  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: 'ol' | 'ul' | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) {
      listType = null;
      listItems = [];
      return;
    }
    const items = listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('');
    html.push(`<${listType}>${items}</${listType}>`);
    listType = null;
    listItems = [];
  };

  source.split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const depth = heading[1].length;
      const tag = depth <= 2 ? 'h2' : depth === 3 ? 'h3' : 'h4';
      const question = heading[2].match(/^(.+\?)\s+(.+)$/);
      if (question) {
        html.push(`<${tag}>${renderInlineMarkdown(question[1])}</${tag}>`);
        paragraph.push(question[2]);
        return;
      }
      html.push(`<${tag}>${renderInlineMarkdown(heading[2])}</${tag}>`);
      return;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listType === 'ul') flushList();
      listType = 'ol';
      listItems.push(ordered[1]);
      return;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (listType === 'ol') flushList();
      listType = 'ul';
      listItems.push(bullet[1]);
      return;
    }

    if (listType) flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();
  return html.join('\n');
}

function mapCmsArticle(raw: Record<string, unknown>, index = 0): Article {
  const cats = Array.isArray(raw.category)
    ? (raw.category as string[])
    : raw.category
      ? [String(raw.category)]
      : [];
  const assigned = assignmentNames(raw);
  const categoryName = assigned[0] || cats[0] || 'Notícias';
  const known = cmsSectionByEndpoint(categoryName);
  const categorySlug = known?.slug || slugify(categoryName) || 'noticias';
  const authors = Array.isArray(raw.authorNames) ? (raw.authorNames as string[]) : [];
  const images = Array.isArray(raw.imageUrls) ? (raw.imageUrls as string[]) : [];
  const videos = Array.isArray(raw.videoUrls) ? (raw.videoUrls as string[]) : [];
  const seo = raw.seo && typeof raw.seo === 'object' ? (raw.seo as Record<string, unknown>) : {};
  const published =
    (raw.scheduledTime as string) || (raw.createdAt as string) || new Date().toISOString();
  const updatedAt =
    (typeof raw.updatedAt === 'string' && raw.updatedAt) ||
    (typeof raw.seoEnrichedAt === 'string' && raw.seoEnrichedAt) ||
    published;
  const videoUrl = videos.find((url) => typeof url === 'string' && url.trim()) || undefined;
  const faq = (Array.isArray(raw.faq) ? raw.faq : [])
    .flatMap((row) => {
      if (!row || typeof row !== 'object') return [];
      const item = row as { question?: unknown; answer?: unknown };
      const question = String(item.question || '').trim();
      const answer = String(item.answer || '').trim();
      if (!question || !answer) return [];
      return [{ question, answer }];
    });

  return {
    id: String(raw._id || raw.id || raw.slug || index),
    slug: String(raw.slug || ''),
    title: String(raw.title || ''),
    excerpt: String(raw.summary || raw.description || seo.meta_description || ''),
    content: renderBody(String(raw.content || raw.description || '')),
    category: known?.label || categoryName,
    categorySlug,
    author: authors[0] || 'Redação',
    publishedAt: published,
    updatedAt,
    imageUrl: images[0],
    isVideo: Boolean(videoUrl),
    videoUrl,
    readCount: typeof raw.views === 'number' ? raw.views : undefined,
    featured: index === 0,
    faq: faq.length > 0 ? faq : undefined,
  };
}

function sortByDate(items: Article[]): Article[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

type ListPayload = {
  data?: unknown[];
  meta?: { total?: number };
};

async function fetchEndpoint(endpoint: string, limit = 20, page = 1): Promise<Article[] | null> {
  if (!CMS_BASE || !WEBSITE_KEY) return null;
  const params = new URLSearchParams({
    targetWebsite: WEBSITE_KEY,
    endpoint,
    limit: String(limit),
    page: String(page),
    sort: 'scheduledTime',
    order: 'desc',
    scheduledBefore: scheduledBeforeBucket(),
  });

  try {
    const res = await fetch(`${CMS_BASE}/ai-articles?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ListPayload;
    const rows = Array.isArray(json.data) ? json.data : [];
    const records = rows.filter(
      (row): row is Record<string, unknown> => !!row && typeof row === 'object'
    );
    const articles = records
      .filter(isPublic)
      .map((row, i) => mapCmsArticle(row, i))
      .filter((article) => article.slug && article.title);

    if (endpoint === 'HomePage') return articles;

    const total = json.meta?.total;
    if (total === 0) return [];

    const matched = articles.filter((article) => {
      const source = records.find((row) => String(row.slug || '') === article.slug);
      return source ? assignmentNames(source).includes(endpoint) : false;
    });
    if (matched.length > 0) return matched;
    if (typeof total === 'number' && total > 0) return articles;
    return [];
  } catch {
    return null;
  }
}

function listed(items: Article[] | null): Article[] {
  return items ?? [];
}

export async function getArticlesByEndpoint(endpoint: string, limit = 20, page = 1): Promise<Article[]> {
  return listed(await fetchEndpoint(endpoint, limit, page));
}

export async function getLatestArticles(limit = 10): Promise<Article[]> {
  return sortByDate(listed(await fetchEndpoint('HomePage', Math.max(limit, 12)))).slice(0, limit);
}

/** Paginate HomePage for sitemap / RSS (published-only via isPublic). */
export async function getAllPublishedArticles(maxPages = 25, pageSize = 50): Promise<Article[]> {
  const bySlug = new Map<string, Article>();
  for (let page = 1; page <= maxPages; page += 1) {
    const batch = listed(await fetchEndpoint('HomePage', pageSize, page));
    if (!batch.length) break;
    for (const article of batch) {
      if (article.slug) bySlug.set(article.slug, article);
    }
    if (batch.length < pageSize) break;
  }
  return sortByDate([...bySlug.values()]);
}

function unwrapArticle(json: unknown): Record<string, unknown> | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Record<string, unknown>;
  if (typeof obj.slug === 'string') return obj;
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    const data = obj.data as Record<string, unknown>;
    if (typeof data.slug === 'string') return data;
  }
  return null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!CMS_BASE || !WEBSITE_KEY) return null;
  try {
    const params = new URLSearchParams({ targetWebsite: WEBSITE_KEY });
    const res = await fetch(
      `${CMS_BASE}/ai-articles/slug/${encodeURIComponent(slug)}?${params.toString()}`,
      { headers: { Accept: 'application/json' }, cache: 'no-store' }
    );
    if (!res.ok) return null;
    const raw = unwrapArticle(await res.json());
    if (!raw || !isPublic(raw) || !raw.slug) return null;
    return mapCmsArticle(raw);
  } catch {
    return null;
  }
}

export async function getByCategory(categorySlug: string, limit = 10): Promise<Article[]> {
  const section = cmsSectionBySlug(categorySlug);
  if (section) {
    return sortByDate(listed(await fetchEndpoint(section.endpoint, limit))).slice(0, limit);
  }
  const home = listed(await fetchEndpoint('HomePage', 40));
  return sortByDate(home.filter((article) => article.categorySlug === categorySlug)).slice(0, limit);
}

export async function getMostRead(limit = 5): Promise<Article[]> {
  const all = listed(await fetchEndpoint('HomePage', 40));
  return [...all].sort((a, b) => (b.readCount ?? 0) - (a.readCount ?? 0)).slice(0, limit);
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const all = listed(await fetchEndpoint('HomePage', limit));
  const featured = all.filter((article) => article.featured);
  if (featured.length >= limit) return sortByDate(featured).slice(0, limit);
  return sortByDate(all).slice(0, limit);
}

export async function search(query: string, limit = 20): Promise<Article[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const live = await fetchEndpoint('HomePage', 80);
  if (!live) return [];
  return sortByDate(
    live.filter(
      (article) =>
        article.title.toLowerCase().includes(normalized) ||
        article.excerpt.toLowerCase().includes(normalized) ||
        article.category.toLowerCase().includes(normalized)
    )
  ).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return cmsSections.map((section) => ({
    id: section.slug,
    name: section.label,
    slug: section.slug,
    description: `Cobertura de ${section.label} em ${siteConfig.siteName}`,
  }));
}

export async function getBreakingHeadlines(): Promise<BreakingHeadline[]> {
  const live = await fetchEndpoint('HomePage', 8);
  if (!live?.length) return [];
  return live.slice(0, 8).map((article, index) => ({
    id: `brk-${article.id}`,
    text: article.title,
    slug: article.slug,
    urgent: index === 0,
  }));
}

export async function getAlerts(limit = 20): Promise<AlertItem[]> {
  return [...rawAlerts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getLiveStories(): Promise<LiveStory[]> {
  return rawLiveStories;
}

export async function getLiveStoryBySlug(slug: string): Promise<LiveStory | null> {
  return rawLiveStories.find((story) => story.slug === slug) ?? null;
}

export async function getBrazilianStates(): Promise<BrazilianState[]> {
  return BRAZILIAN_STATES;
}

export async function getBrazilianState(uf: string): Promise<BrazilianState | null> {
  return getStateByUf(uf) ?? null;
}
