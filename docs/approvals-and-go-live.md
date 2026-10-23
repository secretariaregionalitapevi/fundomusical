# Homologação e bloqueadores de produção

Atualização: o usuário forneceu um QR Bradesco e pediu a página simples. A configuração local agora pode apresentar exatamente esse QR com `fund_static_pix`. Isso não é validação de titularidade ou homologação contábil. O checklist abaixo continua referente à publicação/operação institucional, que não foi executada. Veja [o escopo atualizado](pix-page.md).

**Nenhum item abaixo está homologado ou assinado.** Não houve publicação externa. O único modo financeiro disponível para produção nesta versão é desabilitado. Flags não substituem revisão ou liberação de código.

| Gate                                    | Evidência exigida                                                                                          | Responsável                | Estado    |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------- | --------- |
| Finalidade e autorização institucional  | Documento e escopo Fundo Musical / Itapevi                                                                 | Administração              | Pendente  |
| Segregação financeira                   | Conta específica OU cobrança dinâmica com classificação comprovada em banco/ERP                            | Tesouraria                 | Pendente  |
| Titular e CNPJ                          | Conferência da conta por responsáveis distintos                                                            | Administração + tesouraria | Pendente  |
| Integração bancária                     | Banco, modalidade, fonte do payload, validação oficial e conciliação                                       | Banco + equipe técnica     | Bloqueada |
| Isolamento financeiro                   | Demonstrar oferta regular fora do relatório e Fundo Musical fora do regular; totais coincidem com extratos | Tesouraria                 | Pendente  |
| Pagamento autorizado de valor simbólico | Comprovado no banco e conciliado por responsáveis, fora do portal público                                  | Tesouraria                 | Pendente  |
| Dupla aprovação e MFA                   | Dois operadores distintos, evidência e teste com backend isolado                                           | Segurança                  | Pendente  |
| Domínio e TLS                           | Domínio aprovado; HTTPS e origem exata                                                                     | Administração + operação   | Pendente  |
| Identidade e conteúdo                   | Arquivos autorizados e aceite escrito                                                                      | Administração              | Pendente  |
| Privacidade                             | Controlador, base legal, fornecedores, retenção e canal de direitos                                        | Jurídico/privacidade       | Pendente  |
| Operação                                | CI verde, WAF/rate limit, restauração e rollback ensaiados                                                 | Operação                   | Pendente  |
| Dispositivos reais                      | Safari iOS, Android econômico, leitor de tela e rede ruim                                                  | QA                         | Pendente  |

Requisitos para a integração: identificar fund_id/purpose_code/regional_id e, se exigido, event_id na conciliação aprovada; jamais supor transmissão automática desses campos no Pix. Falha de classificação bloqueia emissão. Pendências de conciliação ficam restritas a operadores, sem PII ou extrato bruto no portal público.

Novo emissor deverá obter payload do banco autorizado, validar BR Code/EMV/CRC com vetores oficiais e garantir igualdade QR/Copia e Cola. Este piloto **não implementa gerador ou validador BR Code certificado**, apenas QR de texto não pagável.

Registro de liberação (a preencher fora da demo): versão/commit, evidências, nome e função dos dois responsáveis, decisão, data, validade, plano de rollback, responsável técnico. Não preencher com assinaturas fictícias. Enquanto faltar qualquer gate, manter OFFERING_MODE=disabled.
