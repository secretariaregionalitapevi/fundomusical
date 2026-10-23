# Fundo Musical — Regional Itapevi

**Requisito mandatório ainda não atendido:** selecionar o banco e abrir o ambiente bancário no Android e no iPhone. A versão atual apresenta QR/Copia e Cola; isso não implementa iniciação de pagamento. A integração autorizada para o encaminhamento bancário ainda não foi fornecida. Veja [o requisito de abertura do banco](docs/bank-handoff.md).

Uma única página para o participante abrir pelo Wi-Fi, visualizar o QR do Fundo Musical, copiar o Pix e concluir no aplicativo do banco. Sem cadastro, menu ou landing page.

## Abrir nesta máquina

```powershell
.\iniciar.ps1
```

Acesse http://127.0.0.1:3000. A tela usa o logo CCB, azul e branco da referência enviada e **o mesmo conteúdo do QR Bradesco fornecido pelo usuário**. Não foi criada uma nova chave ou cobrança. O valor é livre.

## Dados do Pix

`config/fundo-musical.json` contém o código extraído da imagem enviada, nome exibido no documento, banco e hash para detectar alteração. A chave foi conferida contra o QR, assim como o CRC. Não há CNPJ inventado: o documento não contém CNPJ e esse campo permanece `null`.

O portal não consulta o banco para verificar titularidade, segregação contábil ou recebimento. O participante deve conferir o favorecido no aplicativo bancário. A destinação Fundo Musical foi informada pelo usuário. A apresentação do QR não é homologação financeira ou chancela do portal.

`OFFERING_MODE=fund_static_pix` apresenta esse QR cadastrado. `OFFERING_MODE=disabled` o retira do ar. `DEMO_ENABLED=true` em desenvolvimento substitui por texto não pagável para testes. Nada é enviado ao banco por este software.

## Abrir ao conectar ao Wi-Fi

Configure a URL HTTPS da página no portal de visitantes do roteador/controlador. A página está pronta; a abertura automática depende desse equipamento, que ainda não foi identificado.

Use a página como destino **após liberar a conexão**, para permitir acesso ao aplicativo bancário. Acesso à internet nunca depende de contribuição. Um celular pode fechar a janela de conexão automaticamente; a rede também deve divulgar a URL/QR de acesso. Não há atalho universal confiável para abrir qualquer aplicativo bancário: o botão copia o código e mostra três passos para continuar no banco.

Instruções e modelo de página pós-login: [wifi/README.md](wifi/README.md).

## Outra máquina / produção

Node 24 LTS e pnpm indicado em package.json:

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
pnpm build
pnpm start
```

PowerShell: `Copy-Item .env.example .env.local`. Para servidor, configurar HTTPS e domínio aprovado. Nenhum deploy externo ou alteração do roteador foi realizado. Docker e Vercel continuam disponíveis, mas a aplicação não exige Supabase para essa página.

## Verificar

Para publicar na Vercel: [passo a passo e variáveis de ambiente](docs/vercel.md).

```sh
pnpm check
pnpm exec playwright install chromium webkit
pnpm test:e2e
```

Nesta máquina: `./scripts/project.ps1 -Task check` e `-Task test:e2e`. `./scripts/package-source.ps1` gera o ZIP sem dependências ou `.env.local`. Capturas em `artifacts/previews` podem ser regeneradas por `node scripts/capture-preview.mjs`.

O módulo administrativo e documentos da primeira versão permanecem como base técnica, fora da navegação desta tela. A correção de escopo está em [docs/pix-page.md](docs/pix-page.md).
