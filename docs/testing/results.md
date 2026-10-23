# Verificação da página Pix refeita — 23/10/2026

Escopo atual: uma tela azul/branca, logo CCB, QR do Bradesco fornecido pelo usuário e botão de cópia. A primeira landing page foi substituída.

| Verificação | Resultado |
| --- | --- |
| Lint | Aprovado sem warnings |
| TypeScript strict | Aprovado |
| Domínio, integração, SQL e segurança | 59 testes aprovados em 12 arquivos |
| Build Next / standalone | Aprovado; configuração Pix copiada para o servidor standalone |
| Revisão automatizada de bundle / privacidade | Aprovada antes e após build |
| E2E | 18/18 aprovados em Chromium e WebKit; resultado detalhado em `playwright-report/index.html` |
| QR efetivamente configurado | Decodificado no browser e comparado ao texto retornado pela API: idêntico |
| Clipboard nativo Chromium | Código copiado idêntico ao payload do QR enviado; instruções exibidas |
| Acessibilidade da tela com o QR configurado | Axe sem violações nas regras WCAG testadas, desktop e mobile |
| Capturas | Desktop 1440px e celular 390px em `artifacts/previews` |

Jornadas E2E: tela única sem login/menu/seções institucionais; logo e QR visíveis; QR e código com conteúdo idêntico; cópia e ajuda; fallback de permissão com seleção manual; perda de conexão e retorno; falha de health; expiração; API no-store e POST paid recusado; admin bloqueado; teclado e 320px; CSP contra HTML injetado; ausência de redirecionamento por parâmetros de roteador; SW sem cache bancário e fallback offline.

Os testes automatizados de interface usam texto de demonstração não pagável. A conferência local adicional verificou o QR efetivamente fornecido, sua leitura e a cópia, sem abrir aplicativo bancário ou iniciar transferência. Não houve pagamento de teste, consulta de titularidade ou conciliação bancária.

Foram corrigidos contrastes de legendas identificados pelo Axe. O novo modal usa `dialog.showModal()` para foco e navegação por teclado. A cópia ocorre diretamente no gesto do usuário, para preservar compatibilidade com as restrições de clipboard do Safari.

Banco opcional: as migrações, RLS e regras de duas pessoas continuam testadas em PostgreSQL embarcado PGlite, com helpers de claims fictícios. Isso não homologa Supabase Auth, TOTP real ou banco financeiro.

Limites: WebKit com viewport iPhone não substitui aparelho físico. Roteador/controlador da igreja ainda não identificado; nenhuma configuração de rede ou publicação externa foi executada. Abertura automática e saída da janela de Wi-Fi precisam de teste no local. Não foi afirmada homologação contábil ou titularidade bancária. O servidor de desenvolvimento já aberto pelo usuário foi preservado; servidores adicionais de QA são encerrados pelos scripts.
