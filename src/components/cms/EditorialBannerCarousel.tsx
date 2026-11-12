'use client';

import { useEffect, useState } from 'react';
import HtmlBannerFrame from '@/components/cms/HtmlBannerFrame';
import { BANNER_FRAME_CLASS } from '@/lib/banner-html';
import { cn } from '@/lib/utils';

const ROTATE_MS = 7000;

export type EditorialSlide = {
  id: string;
  kind: 'html' | 'image';
  title: string;
  html?: string;
  image?: string;
  href?: string;
  external?: boolean;
};

function SlideBody({ slide }: { slide: EditorialSlide }) {
  if (slide.kind === 'html' && slide.html) {
    return (
      <HtmlBannerFrame
        html={slide.html}
        title={slide.title}
        className="overflow-hidden rounded-xl"
      />
    );
  }

  if (!slide.image) return null;

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={slide.image}
      alt={slide.title}
      className={`${BANNER_FRAME_CLASS} object-cover`}
      style={{ aspectRatio: '2.2 / 1', minHeight: 160 }}
    />
  );

  if (!slide.href) {
    return <div className="overflow-hidden rounded-xl">{image}</div>;
  }

  return (
    <a
      href={slide.href}
      className="block overflow-hidden rounded-xl"
      {...(slide.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {image}
    </a>
  );
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
      <div
        key={slide.id}
        aria-live="polite"
        aria-atomic="true"
        className="min-w-0"
      >
        <SlideBody slide={slide} />
      </div>

      {multi ? (
        <>
          <button
            type="button"
            aria-label="Banner anterior"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-elevated backdrop-blur-sm transition hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:left-3 sm:h-10 sm:w-10"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            aria-label="Próximo banner"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-elevated backdrop-blur-sm transition hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-3 sm:h-10 sm:w-10"
          >
            <Chevron dir="right" />
          </button>

          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-4">
            <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold tabular-nums tracking-wide text-white">
              {index + 1} / {total}
            </span>
            <div className="pointer-events-auto hidden max-w-[min(100%,14rem)] items-center gap-1 overflow-x-auto sm:flex">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Ir para banner ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'h-1.5 shrink-0 rounded-full transition-all',
                    i === index ? 'w-5 bg-accent' : 'w-1.5 bg-white/55 hover:bg-white/80'
                  )}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="h-4 w-4"
    >
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
