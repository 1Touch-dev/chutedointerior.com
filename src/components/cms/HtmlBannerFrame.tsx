'use client';

import { useEffect, useState } from 'react';
import {
  BANNER_FIT_STYLE,
  BANNER_FRAME_CLASS,
  bannerLogoFallbackSrc,
  prepareBannerHtml,
} from '@/lib/banner-html';

/** Clipped CMS HTML frame — no scripts, no inner scrollbars. Last-resort path. */
const shell = (html: string, logoSrc: string) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
${BANNER_FIT_STYLE}
</head>
<body>${prepareBannerHtml(html, logoSrc)}</body>
</html>`;

export default function HtmlBannerFrame({
  html,
  title,
  className,
}: {
  html: string;
  title: string;
  className?: string;
}) {
  const [logoSrc, setLogoSrc] = useState(() => bannerLogoFallbackSrc());

  useEffect(() => {
    setLogoSrc(bannerLogoFallbackSrc(window.location.origin));
  }, []);

  return (
    <div className={className}>
      <div
        className={`relative ${BANNER_FRAME_CLASS}`}
        style={{ aspectRatio: '5 / 4', minHeight: 220 }}
      >
        <iframe
          title={title}
          srcDoc={shell(html, logoSrc)}
          className="absolute inset-0 h-full w-full border-0"
          // No allow-scripts / allow-same-origin — CMS HTML stays inert.
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}
