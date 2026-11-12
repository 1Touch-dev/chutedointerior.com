import AffiliateFeed from '@/components/affiliate/AffiliateFeed';
import Link from 'next/link';
import ArticleCard from '@/components/cards/ArticleCard';
import type { Article } from '@/lib/cms-client';
import { siteConfig } from '@/lib/site-config';
import { resolveCardVariant } from '@/lib/card-variants';

interface SearchLayoutProps {
  query: string;
  results: Article[];
}

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/busca" method="get" className="mb-8 flex flex-col gap-2 sm:flex-row">
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Digite palavras-chave..."
        className="min-h-11 flex-1 rounded-sm border border-primary/20 bg-white px-4 text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="min-h-11 rounded-sm bg-primary px-6 text-sm font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-secondary hover:text-primary"
      >
        Buscar
      </button>
    </form>
  );
}

function CompactResults({ query, results }: SearchLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6 border-b border-primary/20 pb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          Arquivo
        </p>
        <h1 className="mt-1 font-display text-4xl uppercase tracking-[0.06em] text-secondary">
          Busca
        </h1>
      </header>
      <SearchForm query={query} />
      {query && (
        <p className="mb-4 text-sm text-muted">
          {results.length} resultado{results.length !== 1 ? 's' : ''} para &ldquo;{query}&rdquo;
        </p>
      )}
      {query && results.length === 0 && (
        <p className="rounded-sm border border-primary/15 bg-white px-4 py-8 text-center text-muted">
          Nenhuma notícia encontrada. Tente outros termos.
        </p>
      )}
      <AffiliateFeed className="overflow-hidden rounded-sm border border-primary/15 bg-white">
        {results.map((article) => (
          <div key={article.id} className="px-4">
            <ArticleCard
              article={article}
              variant={resolveCardVariant(siteConfig.components.standardCard.variant)}
            />
          </div>
        ))}
      </AffiliateFeed>
    </div>
  );
}

function EditorialResults({ query, results }: SearchLayoutProps) {
  const [lead, ...rest] = results;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="mb-10 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Pesquisa
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-foreground">Busca</h1>
        <p className="mt-2 font-article italic text-muted">
          Resultados editoriais em {siteConfig.siteName}
        </p>
      </header>
      <SearchForm query={query} />
      {query && (
        <p className="mb-6 text-sm text-muted">
          {results.length} resultado{results.length !== 1 ? 's' : ''} para &ldquo;{query}&rdquo;
        </p>
      )}
      {query && results.length === 0 && (
        <p className="text-muted">Nenhuma notícia encontrada.</p>
      )}
      {lead && (
        <div className="mb-8">
          <ArticleCard article={lead} variant="lead" />
        </div>
      )}
      <AffiliateFeed className="grid gap-6 sm:grid-cols-2" cardSlot offset={1}>
        {rest.map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </AffiliateFeed>
    </div>
  );
}

function ModularFilterResults({ query, results }: SearchLayoutProps) {
  const cats = [...new Set(results.map((r) => r.category))];
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Busca</h1>
          {query && (
            <p className="mt-1 text-sm text-muted">
              {results.length} hit{results.length !== 1 ? 's' : ''} · &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.slice(0, 5).map((c) => (
            <span
              key={c}
              className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase text-secondary"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <SearchForm query={query} />
      {query && results.length === 0 && (
        <p className="text-muted">Sem resultados. Tente outra palavra-chave.</p>
      )}
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <AffiliateFeed className="space-y-2">
          {results.map((article, i) => (
            <ArticleCard key={article.id} article={article} variant="rail" rank={i + 1} />
          ))}
        </AffiliateFeed>
        <aside className="rounded-xl bg-surface p-4">
          <h2 className="font-display text-sm uppercase text-secondary">Seções</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {siteConfig.navCategories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/categoria/${cat.slug}`} className="hover:text-primary">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default function SearchLayout({ query, results }: SearchLayoutProps) {
  switch (siteConfig.layouts.search) {
    case 'editorial-results':
      return <EditorialResults query={query} results={results} />;
    case 'modular-filter-results':
      return <ModularFilterResults query={query} results={results} />;
    case 'compact-results':
    default:
      return <CompactResults query={query} results={results} />;
  }
}
