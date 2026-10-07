'use client';

import { useState } from 'react';
import { isValidEmail, subscribeNewsletter } from '@/lib/newsletter';

export default function FooterNewsletterForm() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-4 flex w-full max-w-sm flex-col gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const value = email.trim();
        if (!isValidEmail(value)) {
          setError(true);
          setNote('Digite um e-mail valido.');
          return;
        }
        setPending(true);
        setNote('');
        setError(false);
        const result = await subscribeNewsletter(value);
        setPending(false);
        if (!result.ok) {
          setError(true);
          setNote(result.message);
          return;
        }
        setError(false);
        setEmail('');
        setNote(result.status === 'already-subscribed' ? 'Este e-mail ja esta inscrito.' : 'Inscricao confirmada.');
      }}
      noValidate
    >
      <label htmlFor="footer-newsletter-email" className="sr-only">
        E-mail
      </label>
      <div className="flex min-h-11 flex-col gap-2 sm:flex-row">
        <input
          id="footer-newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Seu e-mail"
          className="min-h-11 flex-1 border border-black/20 bg-white px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary"
          autoComplete="email"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 bg-primary px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-secondary disabled:opacity-70"
        >
          {pending ? 'Enviando...' : 'Assinar'}
        </button>
      </div>
      {note ? (
        <p role={error ? 'alert' : 'status'} className={`text-xs ${error ? 'text-rose-700' : 'text-emerald-700'}`}>
          {note}
        </p>
      ) : null}
    </form>
  );
}
