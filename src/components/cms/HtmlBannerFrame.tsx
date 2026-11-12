'use client';

import { useEffect, useState } from 'react';
import {
  BANNER_FIT_STYLE,
  BANNER_FRAME_CLASS,
  bannerLogoFallbackSrc,
  prepareBannerHtml,
} from '@/lib/banner-html';

/** Clipped CMS HTML frame — no scripts, no inner scrollbars. */
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
      {/* Inline size fallback: BANNER_FRAME_CLASS lives in src/lib; keep frame visible if utilities lag. */}
      <div
        className={`relative ${BANNER_FRAME_CLASS}`}
        style={{ aspectRatio: '2.2 / 1', minHeight: 160 }}
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
