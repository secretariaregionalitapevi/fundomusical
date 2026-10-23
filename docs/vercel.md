# Publicação na Vercel

Este deploy publica a página atual com o QR Bradesco fornecido pelo usuário e o botão Copia e Cola. A escolha de banco e a abertura do aplicativo continuam pendentes da integração descrita em [bank-handoff.md](bank-handoff.md). O Wi-Fi precisa ser configurado separadamente depois que a URL estiver disponível.

Repositório: [secretariaregionalitapevi/fundomusical](https://github.com/secretariaregionalitapevi/fundomusical), branch de produção `main`. Projeto vinculado: [secretaria-regional/fundomusical](https://vercel.com/secretaria-regional/fundomusical). Os pushes para `main` acionam o deploy de produção pela integração GitHub da Vercel.

Domínio de produção atribuído pela Vercel: [fundomusical.vercel.app](https://fundomusical.vercel.app).

## Configuração do projeto

- Framework: Next.js.
- Node.js: 24.x, conforme `package.json`.
- Instalação: `pnpm install --frozen-lockfile`.
- Build: `pnpm run build:vercel`, definido em `vercel.json`.
- Output Directory: padrão do Next.js; não definir `out`, `public` ou `.next/standalone`.
- Não precisa de Supabase ou credenciais bancárias para apresentar o QR existente.

Configure estas variáveis no projeto Vercel, em **Settings → Environment Variables**, para Production e Preview:

| Nome                   | Valor                                     |
| ---------------------- | ----------------------------------------- |
| `DATA_BACKEND`         | `local`                                   |
| `OFFERING_MODE`        | `fund_static_pix`                         |
| `DEMO_ENABLED`         | `false`                                   |
| `ADMIN_ENABLED`        | `false`                                   |
| `NEXT_PUBLIC_SITE_URL` | URL HTTPS definitiva atribuída ao projeto |

Para retirar o QR do ar, altere `OFFERING_MODE` para `disabled` e faça um novo deploy. Nunca envie `.env.local` ou tokens para o repositório. `.vercelignore` exclui arquivos locais do upload da CLI; `config/fundo-musical.json` é público por finalidade e precisa ser incluído na função `/api/offering`.

## Publicar pela CLI

Com Node 24 e a CLI oficial instalada:

```powershell
vercel login
vercel link --scope secretaria-regional
vercel deploy --prod --scope secretaria-regional --env DATA_BACKEND=local --env OFFERING_MODE=fund_static_pix --env DEMO_ENABLED=false --env ADMIN_ENABLED=false
```

O destino informado pelo usuário é o espaço `secretaria-regional`. Autentique com uma conta que tenha acesso a esse espaço e confira o vínculo antes de enviar o projeto. No primeiro vínculo, crie um projeto chamado `fundo-musical-itapevi` (ou outro nome disponível), mantenha a pasta `./` e o framework Next.js. A autenticação ocorre no site oficial da Vercel; não compartilhe tokens no chat.

Os argumentos `--env` valem para aquele deploy. Cadastre também as variáveis no painel para que os próximos deploys, inclusive os disparados por Git, mantenham o QR ativo. Depois de cadastrar `NEXT_PUBLIC_SITE_URL`, publique novamente.

Não use `--public`: essa opção expõe o código-fonte do deploy. Para compartilhar a página com os visitantes, use o domínio de produção informado pela Vercel e confira se ele abre sem login em uma janela anônima.

## Conferência após publicar

1. Abrir a URL HTTPS em janela anônima, Android e iPhone.
2. Verificar `/api/health` e `/api/offering`: resposta sem erro, QR disponível e sem cache.
3. Conferir o QR e o código copiado contra o original, além do favorecido no banco. Publicar não verifica titularidade ou destinação contábil.
4. Confirmar que `/admin` responde 404 nesta configuração.
5. Configurar o destino pós-login do Wi-Fi com a URL publicada; liberar internet antes do acesso ao banco.

Publicação técnica não representa homologação institucional ou bancária. Não registrar testes em dispositivos reais, assinaturas ou pagamentos que não tenham sido realizados.

Referências oficiais: [deploy pela CLI](https://vercel.com/docs/cli/deploy) e [configuração do projeto](https://vercel.com/docs/project-configuration/vercel-json).
