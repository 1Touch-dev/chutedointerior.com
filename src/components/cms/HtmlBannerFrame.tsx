'use client';

import { BANNER_FIT_STYLE, BANNER_FRAME_CLASS, prepareBannerHtml } from '@/lib/banner-html';

/** Clipped CMS HTML frame — no scripts, no inner scrollbars. */
const shell = (html: string) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
${BANNER_FIT_STYLE}
</head>
<body>${prepareBannerHtml(html)}</body>
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
  return (
    <div className={className}>
      <div className={`relative ${BANNER_FRAME_CLASS}`}>
        <iframe
          title={title}
          srcDoc={shell(html)}
          className="absolute inset-0 h-full w-full border-0"
          // No allow-scripts / allow-same-origin — CMS HTML stays inert.
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}
