# Homologação e bloqueadores de produção

Atualização de 23/10/2026: o usuário solicitou explicitamente a publicação técnica da página com o QR Bradesco existente. O projeto está em [fundomusical.vercel.app](https://fundomusical.vercel.app), com repositório `secretariaregionalitapevi/fundomusical`, produção na branch `main` e modo `fund_static_pix`. A página pública e a igualdade do código Pix foram verificadas; o admin permanece desativado. Veja [as configurações de publicação](vercel.md) e [o escopo atualizado](pix-page.md).

**Nenhum item abaixo está homologado ou assinado.** A publicação técnica solicitada pelo usuário não verifica titularidade, segregação contábil ou autorização institucional e não homologa iniciação bancária, pagamentos ou o módulo administrativo. O checklist registra essas pendências; não representa bloqueio retroativo à publicação técnica já solicitada. Para retirar o QR do ar, configurar `OFFERING_MODE=disabled` e publicar novamente.

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

Novo emissor deverá obter payload do banco autorizado, validar BR Code/EMV/CRC com vetores oficiais e garantir igualdade QR/Copia e Cola. A versão atual reapresenta o payload fornecido pelo usuário, com checagem local de CRC e hash; não é gerador ou validador certificado. Os testes de demonstração usam texto não pagável.

Registro de homologação institucional (a preencher pelos responsáveis): versão/commit, evidências, nome e função dos dois responsáveis, decisão, data, validade, plano de rollback, responsável técnico. Não preencher com assinaturas fictícias. Não ativar novas integrações financeiras ou o admin sem a homologação correspondente. O encaminhamento ao banco em Android e iPhone continua pendente, conforme [bank-handoff.md](bank-handoff.md).
