'use client';

import { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import { getSlugEvents, postSentiment, type SentimentEvent } from '@/lib/sentiment';

const REACTIONS = [
  { value: 'love', label: 'Amei' },
  { value: 'haha', label: 'Haha' },
  { value: 'wow', label: 'Uau' },
  { value: 'sad', label: 'Triste' },
] as const;

const readerId = () => {
  const key = 'chute-reader-id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(key, created);
  return created;
};

export default function ArticleSentiment({ slug, articleId }: { slug: string; articleId: string }) {
  const [events, setEvents] = useState<SentimentEvent[]>([]);
  const [comment, setComment] = useState('');
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState('');

  const counts = useMemo(() => {
    const tally = { positive: 0, neutral: 0, negative: 0, likes: 0 };
    events.forEach((event) => {
      const label = event.analysis?.overallLabel;
      if (label === 'positive' || label === 'neutral' || label === 'negative') tally[label] += 1;
      if (event.sourceType === 'like') tally.likes += 1;
    });
    return tally;
  }, [events]);

  const comments = useMemo(
    () =>
      events
        .filter((event) => event.sourceType === 'comment' && event.text)
        .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
    [events]
  );

  const reload = async () => {
    const rows = await getSlugEvents(slug);
    if (rows) setEvents(rows);
  };

  useEffect(() => {
    void reload();
  }, [slug]);

  const send = async (payload: Record<string, unknown>) => {
    setPending(true);
    setNote('');
    const ok = await postSentiment({
      website: siteConfig.cms.websiteKey,
      language: 'pt-BR',
      ...payload,
      metadata: { slug, path: `/artigo/${slug}`, articleId, ...(payload.metadata as Record<string, unknown>) },
    });
    setPending(false);
    if (!ok) {
      setNote('Nao foi possivel registrar agora.');
      return;
    }
    await reload();
  };

  return (
    <section className="mt-10 border border-black/10 bg-surface p-4" aria-label="Reacao dos leitores">
      <h2 className="font-display text-xl uppercase tracking-wide text-secondary">Reacao dos leitores</h2>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
        Positivo {counts.positive} · Neutro {counts.neutral} · Negativo {counts.negative}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          className="border border-black/15 bg-white px-3 py-1 text-xs font-semibold uppercase text-secondary hover:border-primary disabled:opacity-70"
          onClick={() => {
            const reader = readerId();
            void send({ sourceType: 'like', sourceId: `${slug}:like:${reader}`, metadata: { reaction: 'like' } });
          }}
        >
          Curtir {counts.likes > 0 ? counts.likes : ''}
        </button>
        {REACTIONS.map((reaction) => (
          <button
            key={reaction.value}
            type="button"
            disabled={pending}
            className="border border-black/15 bg-white px-3 py-1 text-xs font-semibold uppercase text-secondary hover:border-primary disabled:opacity-70"
            onClick={() => {
              const reader = readerId();
              void send({
                sourceType: 'reaction',
                sourceId: `${slug}:reaction:${reaction.value}:${reader}`,
                metadata: { reaction: reaction.value },
              });
            }}
          >
            {reaction.label}
          </button>
        ))}
      </div>
      <form
        className="mt-3 space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          const text = comment.trim();
          if (!text) return;
          const reader = readerId();
          setComment('');
          void send({ sourceType: 'comment', sourceId: `${slug}:comment:${reader}:${Date.now()}`, text });
        }}
      >
        <label htmlFor="chute-comment" className="sr-only">
          Comentario
        </label>
        <textarea
          id="chute-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          placeholder="Escreva seu comentario"
          className="w-full border border-black/15 bg-white px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary"
        />
        <button
          type="submit"
          disabled={pending || !comment.trim()}
          className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-secondary disabled:opacity-70"
        >
          {pending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {note ? (
        <p role="alert" className="mt-2 text-sm text-rose-700">
          {note}
        </p>
      ) : null}
      {comments.length ? (
        <ul className="mt-4 space-y-2 border-t border-black/10 pt-3">
          {comments.slice(0, 6).map((item, index) => (
            <li key={`${item.sourceId ?? 'comment'}-${index}`} className="text-sm text-foreground">
              {item.text}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
