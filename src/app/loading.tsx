export default function Loading() {
  return (
    <main id="conteudo" className="container info-page" aria-busy="true">
      <p role="status">Carregando orientações…</p>
      <div className="skeleton-block" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </main>
  );
}
