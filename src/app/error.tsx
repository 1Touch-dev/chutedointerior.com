'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Erro</p>
      <h1 className="mt-3 font-display text-3xl uppercase text-secondary">Algo deu errado</h1>
      <p className="mt-3 text-sm text-muted">
        {error.message || 'Não foi possível carregar esta página agora.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-secondary"
      >
        Tentar de novo
      </button>
    </div>
  );
}
