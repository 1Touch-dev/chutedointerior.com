/* eslint-disable @next/next/no-img-element */
import Image, { type ImageProps } from 'next/image';

type CmsImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

/**
 * CMS/third-party article images often come from CDNs that time out Next's
 * optimizer (huge GE/Globo assets, hotlink delays). Serve them directly.
 */
export default function CmsImage({ src, alt, className, fill, width, height, sizes, priority }: CmsImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
    />
  );
}
