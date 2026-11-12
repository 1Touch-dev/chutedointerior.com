import Link from 'next/link';
import BrandFallback from '@/components/ui/BrandFallback';
import CmsImage from '@/components/ui/CmsImage';
import type { Article } from '@/lib/cms-client';
import { formatRelativeDatePtBr, cn } from '@/lib/utils';

export type ArticleCardVariant = 'lead' | 'horizontal' | 'compact' | 'rail';

interface ArticleCardProps {
  article: Article;
  variant?: ArticleCardVariant;
  rank?: number;
  className?: string;
}

function PlaceholderImage({
  className,
  muted,
}: {
  className?: string;
  muted?: boolean;
}) {
  return <BrandFallback className={className} muted={muted} />;
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/** Pitch-desk cards — tight radius, category rules, restrained hover. */
export default function ArticleCard({
  article,
  variant = 'compact',
  rank,
  className,
}: ArticleCardProps) {
  const href = `/artigo/${article.slug}`;

  if (variant === 'lead') {
    return (
      <article
        className={cn(
          'group relative overflow-hidden rounded-sm border border-primary/15 bg-secondary',
          className
        )}
      >
        <Link href={href} className={cn('block', focusRing)}>
          <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
            {article.imageUrl ? (
              <CmsImage
                src={article.imageUrl}
                alt=""
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 70vw"
                priority
              />
            ) : (
              <PlaceholderImage className="absolute inset-0" muted />
            )}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-secondary to-transparent',
                article.imageUrl
                  ? 'via-secondary/55'
                  : 'via-secondary/70 from-secondary/95'
              )}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  {article.category}
                </span>
                {article.isVideo ? (
                  <span className="inline-block border border-white/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Vídeo
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 max-w-3xl font-display text-xl font-bold uppercase leading-[1.05] tracking-wide text-white sm:text-2xl md:text-4xl lg:text-5xl">
                {article.title}
              </h2>
              <p className="mt-2 max-w-2xl line-clamp-2 text-xs text-white/75 sm:text-sm md:text-base">
                {article.excerpt}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-wider text-white/50">
                {article.author} · {formatRelativeDatePtBr(article.publishedAt)}
              </p>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        className={cn(
          'group flex gap-3 border-b border-primary/10 py-3.5 last:border-0',
          className
        )}
      >
        <Link
          href={href}
          className={cn(
            'relative block h-16 w-20 shrink-0 overflow-hidden rounded-sm bg-primary sm:h-20 sm:w-28 md:h-24 md:w-36',
            focusRing
          )}
        >
          {article.imageUrl ? (
            <CmsImage
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
              sizes="144px"
            />
          ) : (
            <PlaceholderImage className="absolute inset-0" />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={href} className={cn('block', focusRing)}>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              {article.category}
            </span>
            <h3 className="mt-1 font-heading text-[13px] font-semibold uppercase leading-snug tracking-wide text-foreground transition-colors group-hover:text-primary sm:text-sm md:text-base">
              {article.title}
            </h3>
            <p className="mt-1 line-clamp-2 hidden text-xs text-muted sm:block">{article.excerpt}</p>
            <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted">
              {formatRelativeDatePtBr(article.publishedAt)}
              {article.isVideo && ' · Vídeo'}
            </p>
          </Link>
        </div>
      </article>
    );
  }

  if (variant === 'rail') {
    return (
      <article
        className={cn(
          'group flex items-start gap-3 border-b border-primary/10 py-2.5 last:border-0',
          className
        )}
      >
        {rank !== undefined && (
          <span className="mt-0.5 w-6 shrink-0 font-display text-2xl font-extrabold tabular-nums leading-none text-accent">
            {String(rank).padStart(2, '0')}
          </span>
        )}
        <Link href={href} className={cn('min-w-0 flex-1', focusRing)}>
          <h3 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted">
            {article.category} · {formatRelativeDatePtBr(article.publishedAt)}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article className={cn('group', className)}>
      <Link href={href} className={cn('block', focusRing)}>
        <div className="relative mb-2.5 aspect-[4/3] overflow-hidden rounded-sm border border-primary/10 bg-primary">
          {article.imageUrl ? (
            <CmsImage
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <PlaceholderImage className="absolute inset-0" />
          )}
          {article.isVideo ? (
            <span className="absolute bottom-2 left-2 rounded-sm bg-secondary/85 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Vídeo
            </span>
          ) : null}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          {article.category}
        </span>
        <h3 className="mt-1 font-heading text-sm font-semibold uppercase leading-snug tracking-wide text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted">
          {formatRelativeDatePtBr(article.publishedAt)}
        </p>
      </Link>
    </article>
  );
}
