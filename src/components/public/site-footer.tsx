import Link from 'next/link';
import { Music2 } from 'lucide-react';
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <span className="footer-brand">
            <Music2 size={20} aria-hidden="true" /> Fundo Musical
          </span>
          <p>
            Regional Itapevi
            <br />
            Cuidado que se transforma em música.
          </p>
        </div>
        <nav aria-label="Navegação do rodapé">
          <Link href="/como-contribuir">Como contribuir</Link>
          <Link href="/seguranca">Segurança</Link>
          <Link href="/privacidade">Privacidade</Link>
        </nav>
        <p className="footer-note">
          Projeto em homologação para a Congregação Cristã no Brasil.
          <br />
          Identificação tipográfica provisória, sujeita à aprovação institucional.
          <br />
          Este portal não recebe nem movimenta recursos.
        </p>
      </div>
      <div className="container footer-bottom">
        Contribuição voluntária. Sem cadastro. Sem exposição de contribuintes.
      </div>
    </footer>
  );
}
