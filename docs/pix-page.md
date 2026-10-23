# Correção de escopo — 23/10/2026

O usuário rejeitou a primeira landing page e pediu uma única tela de contribuição para acesso pelo Wi-Fi. Essa orientação substitui as decisões anteriores de layout, paleta provisória verde e navegação pública.

A tela agora tem logo CCB, azul/branco conforme imagem de referência, QR central sempre visível quando online, favorecido, banco, valor livre e botão grande de cópia. As instruções para abrir o banco aparecem após copiar ou tocar em “Como fazer o Pix”. Não há escolha de valor, cadastro, comprovante ou alegação de pagamento concluído.

O usuário enviou a imagem do QR Bradesco. O arquivo original foi decodificado com jsQR e o payload preservado integralmente. A chave corresponde ao texto do documento; checksum SHA256 e CRC16 são conferidos no servidor. O novo QR é apenas outra representação gráfica **dos mesmos bytes**, sem alterar chave, txid ou dados bancários. Sem geração de nova cobrança. CNPJ não constava do documento; permanece ausente.

A apresentação usa o dado fornecido pelo usuário. Não houve consulta bancária, pagamento de teste, conferência de titularidade, conciliação financeira ou homologação contábil. Documentos anteriores que descrevem produção totalmente desativada se referem à primeira versão; a nova configuração local reapresenta o QR enviado. Publicação externa e alterações na rede não foram realizadas.

Logo local: [arquivo no Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Logo_oficial_CCB.png), que atribui a origem ao site da CCB. A aplicação da marca foi solicitada explicitamente pelo usuário. O arquivo não foi redesenhado; usa inversão CSS para branco sobre azul, com proporção preservada. As cores seguem a captura enviada, sem alegar auditoria de valores hexadecimais oficiais.

Referência técnica da leitura do BR Code/CRC: [Banco Central, Manual de Padrões para Iniciação do Pix v2.10.0](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf). O validador cobre o formato estático ASCII sem valor do documento recebido, não todas as modalidades Pix.

Wi-Fi: a página não é um servidor de autenticação de rede. O modelo do equipamento ainda é desconhecido. `wifi/` explica o redirecionamento após liberação de internet e inclui um modelo para MikroTik, sem tocar em roteador, firewall ou credenciais. Não há promessa de que o sistema operacional abrirá a tela em toda reconexão.
