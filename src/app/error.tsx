'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="conteudo" className="container info-page">
      <h1>Não foi possível carregar esta página.</h1>
      <p>Tente novamente quando a conexão estiver disponível.</p>
      <button className="button primary" onClick={reset}>
        Tentar novamente
      </button>
    </main>
  );
}
