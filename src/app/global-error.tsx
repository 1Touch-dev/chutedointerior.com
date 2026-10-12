'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center bg-white px-4 py-16 text-center text-neutral-900">
        <h1 className="text-3xl font-bold uppercase">Erro do sistema</h1>
        <p className="mt-3 text-sm text-neutral-600">
          {error.message || 'Falha inesperada. Tente novamente.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 bg-neutral-900 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white"
        >
          Recarregar
        </button>
      </body>
    </html>
  );
}
