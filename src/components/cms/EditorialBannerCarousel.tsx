'use client';

import { useEffect, useState } from 'react';
import HtmlBannerFrame from '@/components/cms/HtmlBannerFrame';
import BrandFallback from '@/components/ui/BrandFallback';
import { BANNER_FRAME_CLASS } from '@/lib/banner-html';
import { cn } from '@/lib/utils';

const ROTATE_MS = 7000;

export type EditorialSlide = {
  id: string;
  kind: 'hero' | 'html' | 'image';
  title: string;
  html?: string;
  image?: string;
  href?: string;
  external?: boolean;
  excerpt?: string;
  category?: string;
  meta?: string;
};

function HeroMedia({
  slide,
  priority,
}: {
  slide: EditorialSlide;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(slide.image) && !failed;

  const media = (
    <div className={cn('relative', BANNER_FRAME_CLASS)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      ) : (
        <BrandFallback className="absolute inset-0" labeled />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-[1] flex flex-col justify-end gap-1.5 p-4 sm:gap-2 sm:p-6 md:p-8">
        {slide.category ? (
          <span className="w-fit max-w-full truncate rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-sm sm:text-[11px]">
            {slide.category}
          </span>
        ) : null}
        <h2 className="line-clamp-3 max-w-3xl text-balance text-lg font-extrabold leading-snug text-white drop-shadow-sm sm:line-clamp-2 sm:text-2xl md:text-3xl md:leading-tight">
          {slide.title}
        </h2>
        {slide.excerpt ? (
          <p className="hidden max-w-2xl text-sm leading-snug text-white/90 sm:line-clamp-2 sm:block md:text-base">
            {slide.excerpt}
          </p>
        ) : null}
        {slide.meta ? (
          <p className="hidden text-xs text-white/75 sm:block">{slide.meta}</p>
        ) : null}
      </div>
    </div>
  );

  if (!slide.href) {
    return <div className="overflow-hidden rounded-xl">{media}</div>;
  }

  return (
    <a
      href={slide.href}
      className="block overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={slide.title}
      {...(slide.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {media}
    </a>
  );
}

function SlideBody({ slide, priority }: { slide: EditorialSlide; priority?: boolean }) {
  if (slide.kind === 'html' && slide.html) {
    return (
      <HtmlBannerFrame
        html={slide.html}
        title={slide.title}
        className="overflow-hidden rounded-xl"
      />
    );
  }

  if (slide.kind === 'hero' || slide.kind === 'image') {
    return <HeroMedia slide={slide} priority={priority} />;
  }

  return null;
}

export default function EditorialBannerCarousel({ slides }: { slides: EditorialSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;
  const multi = total > 1;
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (!multi || paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [multi, paused, total]);

  if (!slide) return null;

  const go = (next: number) => {
    setIndex((next + total) % total);
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques em banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div key={slide.id} aria-live="polite" aria-atomic="true" className="min-w-0">
        <SlideBody slide={slide} priority={index === 0} />
      </div>

      {multi ? (
        <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
          <button
            type="button"
            aria-label="Banner anterior"
            onClick={() => go(index - 1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-surface text-foreground shadow-card transition hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-11 sm:w-11"
          >
            <Chevron dir="left" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold tabular-nums tracking-wide text-white">
              {index + 1} / {total}
            </span>
            <div className="flex max-w-full items-center justify-center gap-1.5 overflow-x-auto px-1 py-0.5">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Ir para banner ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'h-1.5 shrink-0 rounded-full transition-all',
                    i === index ? 'w-5 bg-primary' : 'w-1.5 bg-secondary/25 hover:bg-secondary/40'
                  )}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Próximo banner"
            onClick={() => go(index + 1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-surface text-foreground shadow-card transition hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-11 sm:w-11"
          >
            <Chevron dir="right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
      <path
        d={dir === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
