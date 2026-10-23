import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export function InfoPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main id="conteudo" className="container info-page">
      <Link className="back-link" href="/">
        <ArrowLeft size={16} aria-hidden="true" /> Voltar ao início
      </Link>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p className="info-intro">{intro}</p>
      <div className="prose">{children}</div>
    </main>
  );
}
