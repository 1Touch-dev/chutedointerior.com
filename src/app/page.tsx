import type { Metadata } from 'next';
import HomeLayout from '@/components/home/HomeLayout';
import { pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

/** Keep homepage desk + articles near-live. */
export const revalidate = 30;

export const metadata: Metadata = pageMetadata({
  title: siteConfig.siteName,
  description: siteConfig.description,
  path: '/',
});

export default function HomePage() {
  return <HomeLayout />;
}
