import type { Metadata } from 'next';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Sobre',
  description: `Conheça ${siteConfig.siteName} — ${siteConfig.tagline}`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Início', path: '/' },
              { name: 'Sobre', path: '/about' },
            ])
          ),
        }}
      />
      <h1 className="font-display text-4xl text-secondary">Sobre {siteConfig.siteName}</h1>
      <p className="mt-2 text-lg text-muted">{siteConfig.tagline}</p>
      <div className="mt-8 space-y-4 font-article text-base leading-relaxed text-foreground">
        <p>{siteConfig.description}</p>
        <p>
          Portal brasileiro focado no futebol do interior e das divisões de acesso — Série B e C,
          histórias regionais, base e amador — com mesa de Brasileirão, Copa do Brasil,
          Libertadores e Seleção.
        </p>
        <p>
          Publicamos apenas artigos com status published no CMS, com FAQ e metadados editoriais
          quando disponíveis.
        </p>
      </div>
    </div>
  );
}
