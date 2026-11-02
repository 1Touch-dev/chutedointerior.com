'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

// Each creative represents one affiliate banner variant. The component can rotate
// through many creatives while keeping a stable ad slot sized to the largest banner.
export type AffiliateCreative = {
  src?: string;
  imageSrc?: string;
  clickUrl: string;
  width: number;
  height: number;
  title?: string;
};

export const AFFILIATE_BANNERS = {
  vertical: [
    {
      src: 'https://refbanners.com/I?tag=d_6294854m_1599c_&site=6294854&ad=3843',
      clickUrl: 'https://reffpa.com/L?tag=d_6294854m_1599c_&site=6294854&ad=1599',
      width: 120,
      height: 450,
      title: '1xBET',
    },
    {
      imageSrc: 'https://account.superpartners.com/Media/Download?mediaItemId=104196',
      clickUrl: 'https://betway.es/bwp/sports-welcome/es-es/?s=bfp49574&a=spadid233267&mid=104196',
      width: 250,
      height: 444,
      title: 'Betway',
    },
  ],
  card: [
    {
      src: 'https://refbanners.com/I?tag=d_6294854m_1599c_&site=6294854&ad=3590',
      clickUrl: 'https://reffpa.com/L?tag=d_6294854m_1599c_&site=6294854&ad=1599',
      width: 300,
      height: 250,
      title: '1xBET',
    },
    {
      imageSrc: 'https://account.superpartners.com/Media/Download?mediaItemId=104216',
      clickUrl: 'https://betway.com?s=bfp49574&a=spadid233267',
      width: 300,
      height: 250,
      title: 'Betway',
    },
    {
      src: 'https://refbanners.com/I?tag=d_6294854m_1599c_&site=6294854&ad=3566',
      clickUrl: 'https://reffpa.com/L?tag=d_6294854m_1599c_&site=6294854&ad=1599',
      width: 300,
      height: 250,
      title: '1xBET',
    },
    {
      imageSrc: 'https://account.superpartners.com/Media/Download?mediaItemId=104195',
      clickUrl: 'https://betway.com?s=bfp49574&a=spadid233267',
      width: 300,
      height: 250,
      title: 'Betway',
    },
  ],
  landscape: [
    {
      src: 'https://refbanners.com/I?tag=d_6294854m_1599c_&site=6294854&ad=10809',
      clickUrl: 'https://reffpa.com/L?tag=d_6294854m_1599c_&site=6294854&ad=1599',
      width: 750,
      height: 200,
      title: '1xBET',
    },
    {
      imageSrc: 'https://account.superpartners.com/Media/Download?mediaItemId=104217',
      clickUrl: 'https://betway.com?s=bfp49574&a=spadid233267',
      width: 928,
      height: 244,
      title: 'Betway',
    },
    {
      src: 'https://refbanners.com/I?tag=d_6294854m_1599c_&site=6294854&ad=3848',
      clickUrl: 'https://reffpa.com/L?tag=d_6294854m_1599c_&site=6294854&ad=1599',
      width: 600,
      height: 160,
      title: '1xBET',
    },
    {
      imageSrc: 'https://account.superpartners.com/Media/Download?mediaItemId=104217',
      clickUrl: 'https://betway.com?s=bfp49574&a=spadid233267',
      width: 928,
      height: 244,
      title: 'Betway',
    },
  ],
  strip: [
    {
      src: 'https://refbanners.com/I?tag=d_6294854m_1599c_&site=6294854&ad=3077',
      clickUrl: 'https://reffpa.com/L?tag=d_6294854m_1599c_&site=6294854&ad=1599',
      width: 728,
      height: 90,
      title: '1xBET',
    },
    {
      imageSrc: 'https://account.superpartners.com/Media/Download?mediaItemId=104192',
      clickUrl: 'https://betway.com?s=bfp49574&a=spadid233267',
      width: 728,
      height: 90,
      title: 'Betway',
    },
    {
      src: 'https://refbanners.com/I?tag=d_6294854m_1599c_&site=6294854&ad=3917',
      clickUrl: 'https://reffpa.com/L?tag=d_6294854m_1599c_&site=6294854&ad=1599',
      width: 728,
      height: 90,
      title: '1xBET',
    },
    {
      imageSrc: 'https://account.superpartners.com/Media/Download?mediaItemId=104183',
      clickUrl: 'https://betway.com?s=bfp49574&a=spadid233267',
      width: 728,
      height: 65,
      title: 'Betway',
    },
  ],
} as const satisfies Record<string, readonly AffiliateCreative[]>;

export type AffiliateBannerPreset = keyof typeof AFFILIATE_BANNERS;

type AffiliateBannerProps = {
  banners?: readonly AffiliateCreative[];
  preset?: AffiliateBannerPreset;
  src?: string;
  clickUrl?: string;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  showLabel?: boolean;
  intervalMs?: number;
  autoRotate?: boolean;
  pauseOnVisibilityChange?: boolean;
};

// Normalize the incoming creatives before rendering so the component never crashes
// because of a single bad affiliate record.
function normalizeCreatives(creatives?: readonly AffiliateCreative[]): AffiliateCreative[] {
  if (!creatives?.length) return [];

  return creatives.filter((creative) => {
    const width = Number(creative.width);
    const height = Number(creative.height);
    const source = creative.imageSrc || creative.src;
    // Unconfigured provider tags must never rotate into live placements.
    const hasValidSource = Boolean(source && !/\[(?:tag|site)\]|%5b(?:tag|site)%5d/i.test(source));
    const hasValidUrl = typeof creative.clickUrl === 'string' && creative.clickUrl.trim().length > 0;
    const hasValidDimensions = Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
    return hasValidSource && hasValidUrl && hasValidDimensions;
  });
}

// This banner accepts either a preset collection, a custom array, or a single custom
// image/iframe. It rotates through the creatives in a responsive container so each
// ad keeps its original size but the layout remains stable during switching.
export default function AffiliateBanner({
  banners,
  preset,
  src,
  clickUrl,
  width,
  height,
  title = 'Publicidade de afiliado',
  className = '',
  showLabel = true,
  intervalMs = 7500,
  autoRotate = true,
  pauseOnVisibilityChange = true,
}: AffiliateBannerProps) {
  // Resolve the final creative list from props. We intentionally normalize here so
  // every downstream effect works with a clean, valid array.
  const resolvedCreatives = useMemo<AffiliateCreative[]>(() => {
    if (banners?.length) return normalizeCreatives(banners);
    if (preset) return normalizeCreatives(AFFILIATE_BANNERS[preset]);
    if (src && width && height) {
      if (!clickUrl || !clickUrl.trim()) return [];
      return normalizeCreatives([{ src, width, height, title, clickUrl }]);
    }
    return [];
  }, [banners, preset, src, width, height, title, clickUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const frameViewportRef = useRef<HTMLDivElement | null>(null);

  const shouldStopRotation = !autoRotate || resolvedCreatives.length < 2 || (pauseOnVisibilityChange && isDocumentHidden);

  useEffect(() => {
    if (shouldStopRotation) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % resolvedCreatives.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [shouldStopRotation, intervalMs, resolvedCreatives.length]);

  useEffect(() => {
    const viewport = frameViewportRef.current;
    if (!viewport) return;

    const updateWidth = () => setViewportWidth(viewport.getBoundingClientRect().width || 0);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pauseOnVisibilityChange || typeof document === 'undefined') return;

    const handleVisibility = () => {
      setIsDocumentHidden(document.visibilityState === 'hidden');
    };

    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pauseOnVisibilityChange]);

  if (!resolvedCreatives.length) {
    return null;
  }

  const creative = resolvedCreatives[activeIndex % resolvedCreatives.length];
  const slotWidth = Math.max(...resolvedCreatives.map((banner) => banner.width), 1);
  const slotHeight = Math.max(...resolvedCreatives.map((banner) => banner.height), 1);

  const frameScale =
    viewportWidth > 0
      ? Math.min(1, viewportWidth / creative.width, (viewportWidth * slotHeight) / (slotWidth * creative.height))
      : 1;

  return (
    <aside
      className={`min-w-0 border-0 bg-transparent py-3 ${className}`}
      aria-label="Publicidade"
      style={{ width: '100%', minWidth: 0 }}
    >
      {showLabel ? (
        <p
          style={{
            margin: '0 0 8px',
            color: 'inherit',
            opacity: 0.65,
            fontFamily: 'Arial, sans-serif',
            fontSize: 10,
            letterSpacing: '0.16em',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          Publicidade
        </p>
      ) : null}

      <div
        ref={frameViewportRef}
        aria-live={shouldStopRotation ? 'polite' : 'off'}
        data-active-banner={activeIndex % resolvedCreatives.length + 1}
        style={{
          aspectRatio: `${slotWidth} / ${slotHeight}`,
          width: '100%',
          maxWidth: `${slotWidth}px`,
          margin: '0 auto',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {creative.imageSrc ? (
          <a
            href={creative.clickUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            aria-label={creative.title ?? title}
            style={{ position: 'absolute', inset: 0, display: 'block' }}
          >
            <Image
              src={creative.imageSrc}
              alt={creative.title ?? title}
              width={creative.width}
              height={creative.height}
              unoptimized
              loading="lazy"
              style={{
                display: 'block',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                maxWidth: `${creative.width}px`,
                maxHeight: `${creative.height}px`,
                objectFit: 'contain',
              }}
            />
          </a>
        ) : (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <iframe
              key={creative.src}
              src={creative.src}
              title={creative.title ?? title}
              width={creative.width}
              height={creative.height}
              scrolling="no"
              frameBorder={0}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{
                display: 'block',
                width: `${creative.width}px`,
                height: `${creative.height}px`,
                maxWidth: 'none',
                border: 0,
                transform: `translate(-50%, -50%) scale(${frameScale})`,
                transformOrigin: 'center',
                left: '50%',
                top: '50%',
                position: 'absolute',
              }}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
