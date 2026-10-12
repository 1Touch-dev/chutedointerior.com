import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.siteName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0B3D2E',
    lang: 'pt-BR',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/icon', sizes: '192x192', type: 'image/png' },
    ],
  };
}
