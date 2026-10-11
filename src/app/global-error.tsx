'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: '#ffffff', color: '#333333', fontFamily: 'Georgia, serif' }}>
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 12 }}>Falha temporária</p>
          <h1 style={{ fontSize: 40, lineHeight: 1.1 }}>Não foi possível carregar agora</h1>
          <p>Tente recarregar a página. Se o problema persistir, volte para a capa.</p>
          <button type="button" onClick={reset} style={{ marginTop: 24, padding: '8px 16px' }}>
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  );
}
