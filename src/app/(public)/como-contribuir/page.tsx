import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage } from '@/components/public/info-page';
export const metadata: Metadata = { title: 'Como contribuir' };
export default function Page() {
  return (
    <InfoPage
      eyebrow="PASSO A PASSO"
      title="Contribuir com cuidado."
      intro="A participação é voluntária, sem cadastro e sem exposição. O canal de contribuição ainda aguarda aprovação institucional."
    >
      <ol className="steps">
        <li>
          <h2>Acesse o portal pelo endereço aprovado</h2>
          <p>
            Use a URL divulgada pela administração, pelo QR de acesso ou pelo cartão NFC. A abertura
            não exige permissões especiais.
          </p>
        </li>
        <li>
          <h2>Verifique a disponibilidade</h2>
          <p>
            O Pix só poderá ser exibido após liberação formal do canal específico do Fundo Musical.
            Conta cadastrada, aprovação administrativa e titularidade confirmada pelo banco são
            verificações diferentes.
          </p>
        </li>
        <li>
          <h2>Copie o código, quando estiver liberado</h2>
          <p>
            Use a opção Pix Copia e Cola no aplicativo do seu banco. O QR de pagamento será uma
            alternativa para quem estiver usando outro dispositivo. Não há valor sugerido pelo
            portal.
          </p>
        </li>
        <li>
          <h2>Confira nome e CNPJ no banco</h2>
          <p>
            Os dados precisam coincidir com o favorecido autorizado exibido no portal. Em caso de
            divergência, cancele no banco e procure a administração local.
          </p>
        </li>
        <li>
          <h2>Conclua somente no aplicativo bancário</h2>
          <p>
            O site não recebe dinheiro e não sabe se você contribuiu. Não envie comprovantes ou
            dados pessoais ao portal.
          </p>
        </li>
      </ol>
      <div className="notice">
        <strong>Sem internet, aguarde a reconexão.</strong>
        <p>
          As orientações podem ficar disponíveis após o primeiro acesso, mas os dados atuais para
          contribuição precisam de conexão e nova validação.
        </p>
      </div>
      <Link className="button primary" href="/#contribuir">
        Consultar disponibilidade
      </Link>
    </InfoPage>
  );
}
