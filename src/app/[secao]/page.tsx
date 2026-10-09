import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import SectionArticles from '@/components/cms/SectionArticles';
import { cmsSectionBySlug, cmsSections } from '@/lib/sections';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ secao: string }>;
}

export function generateStaticParams() {
  return cmsSections
    .filter((section) => section.href === `/${section.slug}`)
    .map((section) => ({ secao: section.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { secao } = await params;
  const section = cmsSectionBySlug(secao);
  if (!section) return { title: 'Seção' };
  return {
    title: section.label,
    description: `${section.label} em ${siteConfig.siteName}`,
  };
}

export default async function SectionPage({ params }: PageProps) {
  const { secao } = await params;
  const section = cmsSectionBySlug(secao);
  if (!section) notFound();
  if (section.href !== `/${section.slug}`) redirect(section.href);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header>
        <h1 className="font-display text-4xl uppercase tracking-wide text-secondary">{section.label}</h1>
      </header>
      <SectionArticles endpoint={section.endpoint} />
    </div>
  );
}
