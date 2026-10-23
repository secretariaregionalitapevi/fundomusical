# Requisito mandatório de abertura do banco

O usuário confirmou Android e iPhone e exige escolha do banco com encaminhamento real para a transferência. A versão com QR bancário/Copia e Cola **não satisfaz esse requisito**. Não houve teste de abertura de aplicativo bancário; os testes anteriores validam somente página, leitura do QR e cópia.

O QR recebido é um BR Code com dados de pagamento, não uma URL HTTPS nem um comando universal de abertura de aplicativo. Câmeras e leitores podem tratá-lo de maneiras diferentes. Não substituir o payload por um esquema inventado ou afirmar que um teste de browser com viewport móvel comprova o comportamento no celular.

Fluxo a implementar com integração autorizada:

1. URL HTTPS aprovada do portal, acessada pelo Wi-Fi ou por QR de acesso.
2. Escolha do banco entre instituições efetivamente atendidas pelo serviço de iniciação.
3. Criação de sessão pelo backend, com destinatário do Fundo Musical fixado no servidor.
4. Encaminhamento pela URL oficial da sessão para autenticação e confirmação bancária.
5. Tratamento explícito de aplicativo indisponível, cancelamento, falha e retorno; não inferir pagamento de um retorno ao site.

A instituição escolhida e o sistema operacional determinam a abertura do app ou outra jornada suportada. Uma página web não deve prometer detecção universal dos apps bancários instalados. O requisito de abrir especificamente o app deve ser homologado por instituição em Android e iPhone físicos.

Dependência externa pendente: link/serviço de iniciação Pix/Open Finance autorizado para a conta do Fundo Musical, bancos suportados e acesso de integração. Pergunta encaminhada ao usuário. Não contratar serviço, criar conta, efetuar pagamento ou usar credenciais reais sem autorização. Não criar banco fictício ou botão que pareça abrir um app sem ter um destino oficial validado.

Separação financeira: a integração deve preservar a conta/destino do Fundo Musical. Um link de ofertas regulares não serve. Eventuais dados necessários ao provedor, como consentimento e identificação, precisam de definição e revisão; não os introduzir silenciosamente no portal público.

Fontes técnicas consultadas: [Banco Central — pagamentos Pix via Open Finance](https://www.bcb.gov.br/meubc/faqs/s/open-finance), [Chrome — limites de Android Intents](https://developer.chrome.com/docs/android/intents), [Apple — Universal Links](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links). Essas referências não garantem abertura em todos os bancos ou dispositivos.
