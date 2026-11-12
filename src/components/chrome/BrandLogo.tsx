import Image from 'next/image';
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from '@/lib/brand';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  imgClassName?: string;
  size?: number;
  priority?: boolean;
};

/** Site mark for header / footer chrome. */
export default function BrandLogo({
  className,
  imgClassName,
  size = 40,
  priority = false,
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-sm bg-primary',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={BRAND_LOGO_SRC}
        alt={BRAND_LOGO_ALT}
        width={size}
        height={size}
        className={cn('h-full w-full object-cover', imgClassName)}
        priority={priority}
      />
    </span>
  );
}
