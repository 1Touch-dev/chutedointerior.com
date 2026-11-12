/* eslint-disable @next/next/no-img-element */
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from '@/lib/brand';
import { cn } from '@/lib/utils';

type BrandFallbackProps = {
  className?: string;
  /** Soften the mark for large hero slots. */
  muted?: boolean;
};

/**
 * Fills the media slot with brand yellow and a fully-visible centered logo.
 * Uses a plain img (not next/image fill) so parent size never collapses to 0.
 */
export default function BrandFallback({
  className,
  muted = false,
}: BrandFallbackProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center overflow-hidden bg-primary',
        className
      )}
      aria-hidden
    >
      <img
        src={BRAND_LOGO_SRC}
        alt={BRAND_LOGO_ALT}
        className={cn(
          'h-[72%] w-[72%] max-h-28 max-w-28 object-contain',
          muted && 'opacity-75'
        )}
      />
    </div>
  );
}
