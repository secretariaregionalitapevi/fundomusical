import { InfoPage } from '@/components/public/info-page';
export default function NotFound() {
  return (
    <InfoPage
      eyebrow="PÁGINA NÃO ENCONTRADA"
      title="Este caminho não está disponível."
      intro="Volte ao início para consultar as informações do Fundo Musical."
    >
      <p>Por segurança, utilize os links do próprio portal.</p>
    </InfoPage>
  );
}
