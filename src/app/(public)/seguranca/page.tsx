import type { Metadata } from 'next';
import { InfoPage } from '@/components/public/info-page';
export const metadata: Metadata = { title: 'Segurança' };
export default function Page() {
  return (
    <InfoPage
      eyebrow="ORIENTAÇÕES"
      title="Segurança em cada gesto."
      intro="A conferência final é sempre realizada por você, no aplicativo do seu banco."
    >
      <h2>Confira o destinatário</h2>
      <p>
        Compare nome e CNPJ apresentados pelo banco com os dados autorizados do Fundo Musical. O
        portal não autentica a titularidade bancária. Em caso de diferença, não confirme a
        transferência.
      </p>
      <h2>Entenda os estados da conta</h2>
      <ul>
        <li>
          <strong>Não configurada:</strong> não há canal de contribuição disponível.
        </li>
        <li>
          <strong>Aguardando validação:</strong> existe uma proposta ainda não liberada.
        </li>
        <li>
          <strong>Validada administrativamente:</strong> houve aprovação interna; ainda é
          obrigatório conferir o titular no banco.
        </li>
        <li>
          <strong>Indisponível ou expirada:</strong> não utilize códigos antigos. Aguarde a
          atualização.
        </li>
      </ul>
      <h2>Finalidade exclusiva</h2>
      <p>
        O Fundo Musical apoia a compra e reforma de instrumentos para necessitados. Sua
        classificação e conciliação financeira devem permanecer separadas das ofertas regulares.
        Este portal não oferece redirecionamento para outro fluxo financeiro.
      </p>
      <h2>Não compartilhe seus dados</h2>
      <p>
        Não solicitamos senha do banco, código de autenticação, CPF, comprovante ou identificação do
        contribuinte. Não existe atendimento bancário por este site.
      </p>
      <h2>Se suspeitar de uma alteração</h2>
      <p>
        Interrompa a operação e procure a administração pelos canais institucionais que você já
        conhece. O contato oficial deste projeto ainda aguarda aprovação; não publicamos telefone ou
        endereço inventado.
      </p>
      <div className="notice">
        <strong>Projeto em homologação</strong>
        <p>
          Não há conta ou CNPJ homologados neste ambiente. A identidade visual é provisória e não
          representa aprovação institucional.
        </p>
      </div>
    </InfoPage>
  );
}
