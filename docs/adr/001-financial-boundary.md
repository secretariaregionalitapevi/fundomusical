# ADR 001 — Emissão financeira negada por padrão

Status: aceita para o piloto; ativação financeira não autorizada.

O software não intermedeia fundos. Conta dedicada é a preferência; conta compartilhada somente com classificação bancária dinâmica, extratos e conciliação homologados. Texto livre de descrição, chave comum e metadados internos não provam segregação.

Decisão: nenhum emissor real nesta versão. FundMusicBankIntegration retorna indisponível mesmo com conta aprovada. Demo é string fora do padrão Pix. Metadados fund_id, purpose_code, regional_id e event_id não são automaticamente transmitidos ao banco. Não há fallback para ofertas regulares.

Consequência: a interface e as regras podem ser validadas já, mas pagamentos são bloqueados até uma implementação bancária certificada e aprovação humana. Referência: [Banco Central — Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix).
