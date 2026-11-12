'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandFallback from '@/components/ui/BrandFallback';
import { cn } from '@/lib/utils';

type SearchHit = {
  id: string;
  slug: string;
  title: string;
  category: string;
  imageUrl?: string;
  publishedAt?: string;
};

interface GlobalSearchProps {
  tone?: 'dark' | 'light';
  className?: string;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn('h-[18px] w-[18px]', className)}
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.25" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchThumb({ imageUrl }: { imageUrl?: string }) {
  const src = imageUrl?.trim() || '';
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <BrandFallback className="absolute inset-0" />;
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      className="object-cover"
      sizes="64px"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

/** Live typeahead. Mobile starts as icon; md+ always shows the field. */
export default function GlobalSearch({
  tone = 'dark',
  className,
}: GlobalSearchProps) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const showField = isDesktop || expanded;

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setError(false);
      setOpen(false);
      return;
    }

    setLoading(true);
    setError(false);
    setOpen(true);

    const handle = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error('search failed');
        const data = (await res.json()) as { results: SearchHit[] };
        setResults(data.results || []);
        setActiveIndex(-1);
      } catch {
        setError(true);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => window.clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeDropdown();
        if (!query.trim() && !isDesktop) setExpanded(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
        if (!isDesktop) setExpanded(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [closeDropdown, query, isDesktop]);

  useEffect(() => {
    if (expanded && !isDesktop) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [expanded, isDesktop]);

  const goTo = (slug: string) => {
    closeDropdown();
    setQuery('');
    setExpanded(false);
    router.push(`/artigo/${slug}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault();
        goTo(results[activeIndex].slug);
      } else if (query.trim()) {
        event.preventDefault();
        const q = query.trim();
        closeDropdown();
        setExpanded(false);
        setQuery('');
        router.push(`/busca?q=${encodeURIComponent(q)}`);
      }
    }
  };

  const dark = tone === 'dark';
  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={rootRef} className={cn('relative min-w-0', className)}>
      <label className="sr-only" htmlFor={`${listId}-input`}>
        Buscar artigos
      </label>

      {!showField ? (
        <button
          type="button"
          aria-label="Abrir busca"
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-md border transition',
            dark
              ? 'border-white/25 bg-white text-secondary hover:border-accent'
              : 'border-black/15 bg-white text-secondary'
          )}
          onClick={() => setExpanded(true)}
        >
          <SearchIcon />
        </button>
      ) : (
        <div className={cn('relative', !isDesktop && 'w-[min(calc(100vw-7.5rem),16.5rem)]')}>
          <span className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-secondary/60">
            <SearchIcon />
          </span>
          <input
            id={`${listId}-input`}
            ref={inputRef}
            type="search"
            role="combobox"
            value={query}
            autoComplete="off"
            placeholder="Buscar notícias…"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={showPanel}
            aria-activedescendant={
              activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
            }
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => {
              if (query.trim().length >= 2) setOpen(true);
            }}
            className={cn(
              'h-10 w-full rounded-md border border-black/10 bg-white pl-10 text-sm text-secondary shadow-sm outline-none transition placeholder:text-secondary/40 focus:border-primary focus:ring-2 focus:ring-primary/30 sm:h-11',
              query ? 'pr-10' : 'pr-3',
              '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none'
            )}
          />
          {query ? (
            <button
              type="button"
              aria-label="Limpar busca"
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-secondary/45 transition hover:bg-black/5 hover:text-secondary"
              onClick={() => {
                setQuery('');
                closeDropdown();
                inputRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}

          {showPanel ? (
            <div
              id={listId}
              role="listbox"
              className="absolute left-0 right-0 z-[70] mt-1.5 max-h-[min(70vh,24rem)] overflow-auto rounded-md border border-black/10 bg-white text-foreground shadow-elevated md:left-auto md:right-0 md:w-[min(100vw-1.5rem,24rem)]"
            >
              {loading ? (
                <div className="space-y-2 px-3 py-3" aria-busy="true">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 animate-shimmer rounded-sm bg-black/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-16 animate-shimmer rounded bg-black/10" />
                        <div className="h-3 w-full animate-shimmer rounded bg-black/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <p className="px-3 py-4 text-xs text-rose-600">
                  Não foi possível buscar. Tente de novo.
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-4 text-xs text-muted">
                  Nenhum resultado para &ldquo;{query.trim()}&rdquo;
                </p>
              ) : (
                <ul>
                  {results.map((hit, index) => (
                    <li key={hit.id} role="option" aria-selected={index === activeIndex}>
                      <button
                        type="button"
                        id={`${listId}-opt-${index}`}
                        className={cn(
                          'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                          index === activeIndex ? 'bg-surface' : 'hover:bg-surface/80'
                        )}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => goTo(hit.slug)}
                      >
                        <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm bg-primary">
                          <SearchThumb imageUrl={hit.imageUrl} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wide text-primary">
                            {hit.category}
                          </span>
                          <span className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-secondary">
                            {hit.title}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/busca?q=${encodeURIComponent(query.trim())}`}
                onClick={() => {
                  closeDropdown();
                  setExpanded(false);
                }}
                className="sticky bottom-0 block border-t border-black/10 bg-white px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wide text-primary hover:bg-surface"
              >
                Ver todos os resultados
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
