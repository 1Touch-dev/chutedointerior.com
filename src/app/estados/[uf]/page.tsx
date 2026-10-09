import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EMPTY_NOTES } from '@/components/cms/SectionArticles';
import { getBrazilianState } from '@/lib/cms-client';
import { hasCapability } from '@/lib/capabilities';
import { siteConfig } from '@/lib/site-config';

interface PageProps {
  params: Promise<{ uf: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { uf } = await params;
  const state = await getBrazilianState(uf);
  if (!state) return { title: 'Estado' };
  return {
    title: state.name,
    description: `Cobertura de ${state.name} em ${siteConfig.siteName}`,
  };
}

export default async function EstadoUfPage({ params }: PageProps) {
  if (!hasCapability('states-directory')) notFound();
  const { uf } = await params;
  const state = await getBrazilianState(uf);
  if (!state) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="text-xs text-muted">
        <Link href="/estados" className="hover:text-primary">
          Estados
        </Link>
        <span className="mx-2">/</span>
        <span>{state.uf}</span>
      </nav>
      <h1 className="mt-3 font-display text-3xl text-secondary md:text-4xl">{state.name}</h1>
      <p className="mt-2 text-sm text-muted">Região {state.region}</p>
      <p className="mt-8 rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
        {EMPTY_NOTES}
      </p>
    </div>
  );
}
