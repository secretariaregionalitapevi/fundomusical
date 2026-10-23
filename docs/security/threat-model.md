# Modelo de ameaças

| Ameaça                        | Controle implementado                                                                  | Validação / limite                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Troca de favorecido           | Configuração no servidor, versões, MFA, dupla decisão, checksum e RPC auditada         | SQL precisa homologação no Supabase local                                               |
| Autoaprovação ou role elevada | getUser + AAL2 + perfil ativo; RBAC repetido no banco; sem escrita em perfis           | Provisionamento só fora do portal                                                       |
| Mistura de verba              | Constantes e validação fund/purpose, sem URL de ofertas regulares, nenhum emissor real | Tesouraria deve homologar fonte bancária                                                |
| Dados desatualizados          | no-store, expiração, invalidação offline/visibilidade e SW neutro                      | Health comprova apenas resposta atual do servidor, não banco                            |
| XSS / clickjacking            | React escaping, CSP nonce, frame-ancestors none, headers                               | Sem HTML arbitrário, uploads ou redirects externos                                      |
| CSRF                          | Server Actions verificam Origin + checagem explícita da origem configurada             | URL deve coincidir com origem publicada                                                 |
| Força bruta                   | Supabase sem credencial padrão e limite de tentativas por processo                     | Rate limit distribuído de Auth/CAPTCHA e WAF deve ser homologado antes de admin público |
| Vazamento de visitante        | Sem cadastro, analytics, localStorage ou comprovante                                   | Hospedagem/CDN ainda podem registrar IP                                                 |
| Supply chain                  | Versões exatas, lockfile, CI/audit e Dependabot                                        | Revisão de licença e scan periódico ainda exigem operação                               |

Cookies SSR são HttpOnly, SameSite=Lax e Secure em produção. Não há cliente Supabase no browser nem uso da secret key. O proxy renova sessão; cada acesso verifica usuário e perfil novamente. Operadores são identificados na auditoria administrativa, nunca ligados a contribuintes.

O limite adicional usa HMAC com sal efêmero em memória sobre identificador de operador, sem IP, logs ou persistência. Expira em dez minutos, limita oito tentativas por etapa e usa no máximo mil entradas por processo. Reinício e múltiplas instâncias não compartilham estado; a borda e o Auth precisam de controles próprios.

SECURITY DEFINER é restrito a quatro funções justificadas: verificar role própria sem recursão RLS; criar proposta; registrar decisão; criar rascunho de ensaio. `search_path=''`, objetos qualificados, grants somente authenticated e AAL2 + role verificados dentro das funções. Triggers genéricos e policies `using(true)` não são usados.

Integrações futuras precisam autenticação de origem, assinatura quando fornecida, idempotência, deduplicação e conciliação, além de proteção de callbacks. Não existem endpoints para visitante marcar pagamento.
