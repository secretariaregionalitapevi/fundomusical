'use client';
import { useActionState } from 'react';
import { login, verifyMfa } from '@/app/admin/login/actions';
export function LoginForm() {
  const [loginState, loginAction, loginPending] = useActionState(login, { message: '' });
  const [mfaState, mfaAction, mfaPending] = useActionState(verifyMfa, { message: '' });
  return (
    <div className="admin-grid">
      <form className="admin-form" action={loginAction}>
        <fieldset>
          <legend>1. Credenciais do operador</legend>
          <label>
            E-mail institucional
            <input name="email" type="email" autoComplete="username" required maxLength={254} />
          </label>
          <label>
            Senha
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={200}
            />
          </label>
        </fieldset>
        <button className="button primary" disabled={loginPending}>
          {loginPending ? 'Verificando…' : 'Continuar'}
        </button>
        <p role="status">{loginState.message}</p>
      </form>
      <form className="admin-form" action={mfaAction}>
        <fieldset>
          <legend>2. Autenticação multifator</legend>
          <label>
            Código do autenticador
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />
          </label>
        </fieldset>
        <button className="button secondary" disabled={mfaPending}>
          {mfaPending ? 'Verificando…' : 'Verificar MFA'}
        </button>
        <p role="status">{mfaState.message}</p>
      </form>
    </div>
  );
}
