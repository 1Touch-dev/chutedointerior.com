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
    theme_color: '#E8B008',
    lang: 'pt-BR',
    icons: [
      { src: '/logo-mark.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'any' },
      { src: '/icon.jpg', sizes: '32x32', type: 'image/jpeg' },
    ],
  };
}
