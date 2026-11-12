'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import BrandFallback from '@/components/ui/BrandFallback';
import { cn } from '@/lib/utils';

type CmsImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

/**
 * CMS/third-party article images often come from CDNs that time out Next's
 * optimizer. Serve them directly, with a brand-mark fallback on error.
 */
export default function CmsImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}: CmsImageProps) {
  const [failed, setFailed] = useState(false);
  const trimmed = typeof src === 'string' ? src.trim() : '';

  if (!trimmed || failed) {
    return (
      <BrandFallback
        className={cn(fill ? 'absolute inset-0' : 'h-full min-h-[4.5rem] w-full')}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={trimmed}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={trimmed}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
