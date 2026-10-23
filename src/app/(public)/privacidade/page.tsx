import type { Metadata } from 'next';
import { InfoPage } from '@/components/public/info-page';
export const metadata: Metadata = { title: 'Privacidade' };
export default function Page() {
  return (
    <InfoPage
      eyebrow="AVISO PROVISÓRIO · 23/10/2026"
      title="Sua participação é discreta."
      intro="A área pública funciona sem cadastro. Este aviso depende de revisão institucional e jurídica antes da publicação."
    >
      <h2>O que o portal não solicita</h2>
      <p>
        Não pedimos nome, CPF, telefone, filiação religiosa ou comprovante. Não associamos
        dispositivo e valor contribuído. Não utilizamos anúncios, pixels, fingerprinting ou cookies
        de marketing.
      </p>
      <h2>Dados técnicos da infraestrutura</h2>
      <p>
        O provedor de hospedagem, a CDN e serviços de segurança podem registrar endereço IP, horário
        e informações técnicas da requisição. Provedores, base legal, prazos efetivos de retenção e
        responsáveis ainda precisam ser definidos e documentados antes da entrada em produção.
      </p>
      <h2>Armazenamento no navegador</h2>
      <p>
        O service worker guarda apenas recursos locais e uma página de orientações offline. Não
        guarda Pix, dados bancários ou histórico individual de contribuições. Você pode remover os
        dados do site nas configurações do navegador.
      </p>
      <h2>Métricas</h2>
      <p>
        Métricas estão desativadas neste piloto. Qualquer adoção futura exige revisão e usará
        somente contagens agregadas, sem identificação persistente do visitante.
      </p>
      <h2>Área administrativa</h2>
      <p>
        Quando habilitada, utiliza autenticação e cookies de sessão restritos a operadores. Seus
        registros de acesso e decisões são tratados separadamente e com controle de acesso.
      </p>
      <h2>Pagamentos</h2>
      <p>
        A transferência ocorre no seu banco, sob as políticas da instituição financeira. O portal
        não processa pagamentos nem recebe comprovantes.
      </p>
      <h2>Responsável e exercício de direitos</h2>
      <p>
        O controlador, o encarregado e o canal institucional de privacidade aguardam designação
        formal. Até a revisão deste aviso e desses dados, a publicação em produção permanece
        bloqueada.
      </p>
    </InfoPage>
  );
}
