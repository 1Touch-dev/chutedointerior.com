import type { Metadata } from 'next';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Contato',
  description: `Entre em contato com ${siteConfig.siteName}`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Início', path: '/' },
              { name: 'Contato', path: '/contact' },
            ])
          ),
        }}
      />
      <h1 className="font-display text-4xl text-secondary">Contato</h1>
      <p className="mt-2 text-muted">
        Envie sua mensagem, sugestão de pauta ou denúncia para nossa redação.
      </p>
      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground">
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-secondary"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
