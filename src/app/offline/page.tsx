import { InfoPage } from '@/components/public/info-page';
export default function OfflinePage() {
  return (
    <InfoPage
      eyebrow="SEM CONEXÃO"
      title="As orientações continuam aqui."
      intro="Sem conexão. Você pode consultar as orientações, mas não é possível verificar os dados atuais para realizar a contribuição neste momento."
    >
      <h2>Aguarde a conexão para contribuir</h2>
      <p>
        Não use códigos antigos ou capturas de tela. Ao reconectar, volte ao início e consulte a
        disponibilidade atual.
      </p>
      <h2>O cuidado permanece</h2>
      <p>
        A contribuição é voluntária. O Fundo Musical destina-se à compra e reforma de instrumentos
        para irmãos e irmãs necessitados. A conferência do destinatário e a transferência acontecem
        no aplicativo do banco.
      </p>
    </InfoPage>
  );
}
