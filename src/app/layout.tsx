import '../../generated/design-tokens.css';
import './globals.css';
import type { Metadata } from 'next';
import { Barlow_Condensed, Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import ChromeHost from '@/components/chrome/ChromeHost';
import AffiliatePlacement from '@/components/affiliate/AffiliatePlacement';
import Footer from '@/components/chrome/Footer';
import PartnerBanners from '@/components/cms/PartnerBanners';
import { getAlerts, getBreakingHeadlines } from '@/lib/cms-client';
import { hasCapability } from '@/lib/capabilities';
import { organizationJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { absoluteUrl } from '@/lib/site-url';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.siteName}`,
    default: siteConfig.siteName,
  },
  description: siteConfig.description,
  metadataBase: siteConfig.seo.canonicalHost
    ? new URL(siteConfig.seo.canonicalHost)
    : undefined,
  applicationName: siteConfig.siteName,
  icons: {
    icon: [
      { url: '/logo-mark.jpg', type: 'image/jpeg', sizes: 'any' },
      { url: '/icon.jpg', type: 'image/jpeg', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.jpg', type: 'image/jpeg' }],
    shortcut: ['/logo-mark.jpg'],
  },
  alternates: {
    types: {
      'application/rss+xml': absoluteUrl('/rss.xml'),
    },
  },
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    locale: siteConfig.locale.dialect.replace('-', '_'),
    type: 'website',
    siteName: siteConfig.siteName,
    images: [{ url: siteConfig.seo.defaultOgImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: [siteConfig.seo.defaultOgImage],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headlines = hasCapability('breaking-ticker')
    ? await getBreakingHeadlines()
    : [];
  const alerts = hasCapability('alerts-rail') ? await getAlerts(4) : [];
  const density = siteConfig.density ?? 'balanced';
  const densityClass =
    density === 'high'
      ? 'density-high'
      : density === 'low'
        ? 'density-low'
        : 'density-balanced';
  const motion = siteConfig.motion ?? 'moderate';
  const motionClass = `motion-${motion}`;

  return (
    <html
      lang="pt-BR"
      className={`${barlowCondensed.variable} ${plusJakarta.variable}`}
    >
      <body
        data-layout={siteConfig.layouts.homepage}
        data-density={density}
        data-motion={motion}
        data-header-family={siteConfig.chrome?.header?.family || 'legacy'}
        data-footer-family={siteConfig.chrome?.footer?.family || 'legacy'}
        className={`flex min-h-screen flex-col overflow-x-hidden ${densityClass} ${motionClass}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring"
        >
          Pular para o conteúdo
        </a>
        <ChromeHost headlines={headlines} alerts={alerts} />
        <PartnerBanners position="header" />
        <AffiliatePlacement skipHome />
        <main id="conteudo-principal" className="flex-1 min-w-0">
          {children}
        </main>
        <PartnerBanners position="footer" />
        <Footer />
        <PartnerBanners position="popup" />
        <GoogleAnalytics gaId="G-75GY5TF4BC" />
      </body>
    </html>
  );
}
