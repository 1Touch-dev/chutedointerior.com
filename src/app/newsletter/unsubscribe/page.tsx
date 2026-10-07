import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import { unsubscribeNewsletter, type UnsubscribeResult } from '@/lib/newsletter';

export const metadata: Metadata = {
  title: 'Cancelar newsletter',
  robots: { index: false, follow: false },
};

interface IUnsubscribePageProps {
  searchParams: Promise<{ email?: string; website?: string }>;
}

const messages: Record<UnsubscribeResult, string> = {
  unsubscribed: 'Voce nao recebera mais esta newsletter.',
  already: 'Este e-mail ja estava cancelado.',
  missing: 'O link de cancelamento esta incompleto.',
  'not-found': 'Nao encontramos esta inscricao.',
  failed: 'Nao foi possivel cancelar agora. Tente de novo em alguns minutos.',
};

const UnsubscribePage = async ({ searchParams }: IUnsubscribePageProps) => {
  const query = await searchParams;
  const email = query.email?.trim() ?? '';
  const website = query.website?.trim() || siteConfig.cms.websiteKey;
  const status = await unsubscribeNewsletter(email, website);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Boletim</p>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-secondary">Cancelar newsletter</h1>
      <p className="mt-3 text-base leading-7 text-muted">{messages[status]}</p>
    </main>
  );
};

export default UnsubscribePage;
