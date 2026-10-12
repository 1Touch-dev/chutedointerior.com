interface FaqItem {
  question: string;
  answer: string;
}

/** CMS FAQ block + FAQPage JSON-LD. */
export default function ArticleFaq({
  items,
  inverted = false,
}: {
  items: FaqItem[];
  inverted?: boolean;
}) {
  if (!items?.length) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section
      className={
        inverted
          ? 'my-10 rounded-xl border border-white/15 bg-white/5 p-5 sm:p-6'
          : 'my-10 rounded-xl border border-black/10 bg-surface p-5 sm:p-6'
      }
      aria-label="Perguntas frequentes"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2
        className={
          inverted
            ? 'font-display text-xl uppercase tracking-wide text-white'
            : 'font-display text-xl uppercase tracking-wide text-secondary'
        }
      >
        Perguntas frequentes
      </h2>
      <div className="mt-4 divide-y divide-black/10">
        {items.map((item) => (
          <details
            key={item.question}
            className={
              inverted
                ? 'group border-white/10 py-3 first:pt-0 last:pb-0'
                : 'group py-3 first:pt-0 last:pb-0'
            }
          >
            <summary
              className={
                inverted
                  ? 'cursor-pointer list-none text-sm font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden'
                  : 'cursor-pointer list-none text-sm font-semibold text-secondary marker:content-none [&::-webkit-details-marker]:hidden'
              }
            >
              <span className="flex items-start justify-between gap-3">
                <span>{item.question}</span>
                <span
                  className={
                    inverted
                      ? 'shrink-0 text-white/50 transition group-open:rotate-45'
                      : 'shrink-0 text-muted transition group-open:rotate-45'
                  }
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <p
              className={
                inverted
                  ? 'mt-2 text-sm leading-relaxed text-white/75'
                  : 'mt-2 text-sm leading-relaxed text-muted'
              }
            >
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
