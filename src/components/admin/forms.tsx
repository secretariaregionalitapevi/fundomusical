'use client';
import { useActionState } from 'react';
import { proposeRecipient, decideRecipient, createEvent } from '@/app/admin/(protected)/actions';
export function ProposalForm() {
  const [state, action, pending] = useActionState(proposeRecipient, { message: '' });
  return (
    <form action={action} className="admin-form">
      <h2>Propor alteração de conta</h2>
      <label>
        Razão social autorizada
        <input name="beneficiaryLegalName" required maxLength={140} />
      </label>
      <label>
        CNPJ (14 posições, sem pontuação)
        <input
          name="beneficiaryDocument"
          autoCapitalize="characters"
          pattern="[A-Za-z0-9]{12}[0-9]{2}"
          maxLength={14}
          required
        />
      </label>
      <label>
        Chave Pix autorizada
        <input name="pixKey" required maxLength={140} autoComplete="off" />
      </label>
      <label>
        Arranjo financeiro
        <select name="sourceType">
          <option value="dedicated_account">Conta específica do Fundo Musical</option>
          <option value="classified_dynamic">Cobrança dinâmica com classificação homologada</option>
        </select>
      </label>
      <label>
        Validade
        <input name="expiresAt" type="datetime-local" required />
      </label>
      <label>
        Referência interna de autorização (sem dados de doador)
        <input name="evidence" required maxLength={200} />
      </label>
      <button className="button primary" disabled={pending}>
        Enviar para revisão
      </button>
      <p role="status">{state.message}</p>
    </form>
  );
}
export function DecisionForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(decideRecipient, { message: '' });
  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="id" value={id} />
      <label>
        Referência da evidência de revisão
        <input name="evidence" required maxLength={200} />
      </label>
      <label>
        <input type="checkbox" name="segregation" />
        Segregação e conciliação homologadas pela tesouraria
      </label>
      <label>
        Decisão
        <select name="decision">
          <option value="rejected">Rejeitar</option>
          <option value="approved">Aprovar administrativamente</option>
        </select>
      </label>
      <button className="button secondary" disabled={pending}>
        Registrar decisão
      </button>
      <p role="status">{state.message}</p>
    </form>
  );
}
export function EventForm() {
  const [state, action, pending] = useActionState(createEvent, { message: '' });
  return (
    <form action={action} className="admin-form">
      <h2>Planejar ensaio</h2>
      <label>
        Título
        <input name="title" required minLength={4} maxLength={140} />
      </label>
      <label>
        Data
        <input name="date" type="date" required />
      </label>
      <label>
        Município / região
        <input name="region" required maxLength={100} />
      </label>
      <button className="button secondary" disabled={pending}>
        Salvar rascunho
      </button>
      <p role="status">{state.message}</p>
    </form>
  );
}
