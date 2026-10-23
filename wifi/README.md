# Abertura da página pelo Wi-Fi

O usuário ainda não sabe o modelo de roteador/controlador. O código desta página não pode alterar a rede, autorizar dispositivos ou forçar o sistema operacional a abrir uma aba por conta própria.

Após hospedar o site em HTTPS e identificar o equipamento, o administrador da rede deve configurar o endereço como destino do portal de visitantes. Recomenda-se exibir **após a autenticação/liberação de internet**, pois o banco também precisa de acesso à rede. Essa liberação não pode depender de um Pix, comprovante ou confirmação de contribuição.

## MikroTik

O RouterOS oferece HotSpot com página de login, detecção de captive portal e redirecionamento. Há um modelo pós-login em `mikrotik/alogin.html`. Substitua somente `https://SEU-DOMINIO-APROVADO/` pela URL publicada. Antes de substituir arquivos do HotSpot, fazer backup da configuração e homologar com o administrador da rede. Nenhuma configuração de autenticação, trial, usuário/senha ou firewall foi inventada neste projeto.

## UniFi e outros

Identificar a versão do controlador e usar a opção de portal/landing page suportada pelo equipamento. Um portal externo que precise autorizar clientes exige integração adicional com o controlador; esta aplicação **não implementa essa autorização** e não coleta MAC/IP no frontend. Não informar endpoints, credenciais ou parâmetros desconhecidos.

## Conferência na igreja

1. Conectar um Android e um iPhone sem acesso previamente autorizado.
2. Completar o acesso à rede; confirmar internet disponível independentemente de oferta.
3. Verificar se a página do Fundo Musical aparece e se logo/QR carregam sem depender de sites externos.
4. Copiar o código, sair da janela de conexão e abrir o banco. Conferir o favorecido; o teste não precisa concluir transferência.
5. Testar janela fechada automaticamente, reconexão, rede já autorizada e acesso direto pela URL/QR de acesso.

Não interceptar HTTPS de bancos, não instalar certificados no celular e não redirecionar requisições de pagamento. Nem todo celular reabre uma página a cada reconexão; o comportamento depende de autenticação, sessão, controlador e sistema operacional.

Fontes: [MikroTik HotSpot](https://help.mikrotik.com/docs/spaces/ROS/pages/56459266/HotSpot+-+Captive+portal), [UniFi Hotspots](https://help.ui.com/hc/en-us/articles/115000166827-UniFi-Hotspots-and-Captive-Portals). A documentação destes fornecedores sustenta as opções gerais; a implantação nesta rede ainda não foi realizada.
