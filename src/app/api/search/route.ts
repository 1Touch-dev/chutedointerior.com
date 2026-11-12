import { NextResponse } from 'next/server';
import { search } from '@/lib/cms-client';

export const revalidate = 30;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }
  const results = await search(q, 8);
  return NextResponse.json({
    results: results.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      category: article.category,
      imageUrl: article.imageUrl,
      publishedAt: article.publishedAt,
    })),
  });
}
