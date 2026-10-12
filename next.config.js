/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // CMS article hosts (GE/Globo, etc.) often time out the optimizer on huge assets.
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
      },
      {
        protocol: 'https',
        hostname: '**.glbimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.glbimg.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
        ],
      },
      {
        source: '/news-sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=120, s-maxage=120, stale-while-revalidate=600',
          },
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/noticias/:slug',
        destination: '/artigo/:slug',
        permanent: true,
      },
      {
        source: '/noticia/:slug',
        destination: '/artigo/:slug',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.chutedointerior.com' }],
        destination: 'https://chutedointerior.com/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon',
      },
    ];
  },
};

module.exports = nextConfig;
