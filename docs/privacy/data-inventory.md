# Inventário de dados

| Categoria               | Implementação atual                         | Destino / controle                                             |
| ----------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| Identidade de visitante | Não coletada                                | Nenhum formulário ou banco de doador                           |
| Valor e comprovante     | Não solicitados                             | Transferência restrita ao banco                                |
| Cache de navegador      | HTML offline e ícones                       | Removível pelo navegador; sem dados financeiros                |
| IP e metadados HTTP     | Podem existir na hospedagem                 | Provedor e retenção dependem do ambiente a contratar           |
| Operador administrativo | UUID, role, sessão Auth, decisões           | Supabase opcional, acesso restrito e MFA                       |
| Conta institucional     | Versões de destinatário e evidência interna | Só servidor e operadores autorizados; nenhuma conta cadastrada |
| Métricas agregadas      | Coleta desativada                           | Tabela futura pronta, sem ingestão de visitante                |

Sem marketing, pixel, Google Analytics, geolocalização, SDK WhatsApp, identificação de device ou cookies públicos. A ausência de cadastro não significa conformidade total LGPD.
