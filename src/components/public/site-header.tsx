import Link from 'next/link';
import { Music2, ArrowUpRight } from 'lucide-react';
export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#conteudo" tabIndex={0}>
        Pular para o conteúdo
      </a>
      <div className="preview-bar">
        Ambiente de apresentação <span aria-hidden="true">·</span> Identidade e canal de
        contribuição aguardam aprovação
      </div>
      <header className="site-header container">
        <Link className="wordmark" href="/" aria-label="Fundo Musical — início">
          <span className="brand-symbol" aria-hidden="true">
            <Music2 size={25} strokeWidth={1.5} />
          </span>
          <span>
            Fundo Musical<small>REGIONAL ITAPEVI</small>
          </span>
        </Link>
        <nav aria-label="Navegação principal">
          <Link href="/como-contribuir">Como contribuir</Link>
          <Link href="/seguranca">
            Segurança <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </nav>
      </header>
    </>
  );
}
