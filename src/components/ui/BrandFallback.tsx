/* eslint-disable @next/next/no-img-element */
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from '@/lib/brand';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

type BrandFallbackProps = {
  className?: string;
  /** Soften the mark for large hero slots. */
  muted?: boolean;
  /** Show site name under the logo (banner image fallback). */
  labeled?: boolean;
};

/**
 * Fills the media slot with brand yellow and a fully-visible centered logo.
 * Uses a plain img (not next/image fill) so parent size never collapses to 0.
 */
export default function BrandFallback({
  className,
  muted = false,
  labeled = false,
}: BrandFallbackProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-primary px-6 text-center',
        className
      )}
      aria-hidden={!labeled}
      role={labeled ? 'img' : undefined}
      aria-label={labeled ? siteConfig.siteName : undefined}
    >
      <img
        src={BRAND_LOGO_SRC}
        alt={labeled ? '' : BRAND_LOGO_ALT}
        className={cn(
          'h-[52%] w-[52%] max-h-28 max-w-28 object-contain',
          labeled && 'h-auto w-[38%] max-h-24 max-w-24 rounded-md',
          muted && 'opacity-75'
        )}
      />
      {labeled ? (
        <span className="max-w-[16rem] text-sm font-bold tracking-wide text-secondary sm:text-base">
          {siteConfig.siteName}
        </span>
      ) : null}
    </div>
  );
}
