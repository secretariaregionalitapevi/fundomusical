'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  LoaderCircle,
  LockKeyhole,
  QrCode,
  RefreshCw,
  Smartphone,
  WifiOff,
} from 'lucide-react';
import QRCode from 'qrcode';
import { offeringResultSchema, type OfferingResult } from '@/domain/offering/model';

type State =
  'loading' | 'ready' | 'copied' | 'copy-error' | 'offline' | 'expired' | 'unavailable' | 'error';
type AvailableOffering = Extract<OfferingResult, { kind: 'ready' | 'demo' }>;
export function ContributionPanel() {
  const [state, setState] = useState<State>('loading');
  const [offering, setOffering] = useState<AvailableOffering | null>(null);
  const [qr, setQr] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const generation = useRef(0);
  const current = useRef<AvailableOffering | null>(null);
  const expiry = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeField = useRef<HTMLTextAreaElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (showInstructions && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [showInstructions]);
  const invalidate = useCallback((next: State) => {
    generation.current += 1;
    current.current = null;
    if (expiry.current) clearTimeout(expiry.current);
    setOffering(null);
    setQr('');
    setShowCode(false);
    setState(next);
  }, []);
  const refresh = useCallback(async () => {
    invalidate('loading');
    const version = generation.current;
    try {
      if (!navigator.onLine) {
        invalidate('offline');
        return;
      }
      const health = await fetch('/api/health', {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      if (!health.ok || (await health.json()).status !== 'ok') throw new Error('network');
      const response = await fetch('/api/offering', {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error('network');
      const data = offeringResultSchema.parse(await response.json());
      if (generation.current !== version) return;
      if (data.kind === 'unavailable') {
        setState(data.reason === 'expired' ? 'expired' : 'unavailable');
        return;
      }
      const remaining = Date.parse(data.expiresAt) - Date.now();
      if (remaining <= 0) {
        invalidate('expired');
        return;
      }
      const image = await QRCode.toDataURL(data.payload, {
        width: 320,
        margin: 4,
        errorCorrectionLevel: 'M',
        color: { dark: '#10243aff', light: '#ffffffff' },
      });
      if (generation.current !== version) return;
      current.current = data;
      setOffering(data);
      setQr(image);
      setState('ready');
      expiry.current = setTimeout(() => invalidate('expired'), remaining);
    } catch {
      if (generation.current === version) invalidate(navigator.onLine ? 'error' : 'offline');
    }
  }, [invalidate]);
  useEffect(() => {
    const start = setTimeout(() => void refresh(), 0);
    const online = () => void refresh();
    const offline = () => invalidate('offline');
    const visibility = () => {
      if (document.visibilityState === 'hidden') invalidate('loading');
      else void refresh();
    };
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    window.addEventListener('pagehide', offline);
    window.addEventListener('pageshow', online);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearTimeout(start);
      if (expiry.current) clearTimeout(expiry.current);
      generation.current += 1;
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
      window.removeEventListener('pagehide', offline);
      window.removeEventListener('pageshow', online);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [refresh, invalidate]);
  async function copy() {
    const data = current.current;
    if (!navigator.onLine) {
      invalidate('offline');
      return;
    }
    if (!data || Date.parse(data.expiresAt) <= Date.now()) {
      invalidate('expired');
      return;
    }
    // Preserva o gesto do usuário exigido pelo Safari para acesso ao clipboard.
    try {
      await navigator.clipboard.writeText(data.payload);
      if (current.current === data) {
        setState('copied');
        setShowInstructions(true);
      }
    } catch {
      if (current.current === data) {
        setState('copy-error');
        setShowCode(true);
      }
    }
  }
  const demo = offering?.kind === 'demo';
  const available = !!offering && !!qr;
  const title =
    state === 'offline'
      ? 'Você está sem conexão'
      : state === 'expired'
        ? 'Atualize o QR Code'
        : state === 'error'
          ? 'Não foi possível carregar o Pix'
          : 'Pix ainda não configurado';
  return (
    <>
      <article className="pix-card" aria-labelledby="pix-title">
        <header className="pix-header">
          <picture>
            <img
              className="ccb-logo"
              src="/branding/ccb-logo.png"
              width="568"
              height="288"
              alt="Congregação Cristã no Brasil"
            />
          </picture>
          <h1 id="pix-title">Fundo Musical</h1>
          <p>Regional Itapevi</p>
        </header>
        <div className="pix-body">
          <p className="pix-purpose">
            Contribua para a aquisição e reforma
            <br className="wide-break" /> de instrumentos musicais.
          </p>
          <div className="pix-amount">
            <span className="pix-diamond" aria-hidden="true">
              ◇
            </span>{' '}
            Pix <span aria-hidden="true">·</span> Valor livre
          </div>
          {state === 'loading' ? (
            <div className="qr-loading" role="status">
              <LoaderCircle size={26} className="spin" aria-hidden="true" />
              <span>Carregando QR Code…</span>
            </div>
          ) : available ? (
            <>
              <div className="qr-frame">
                <picture>
                  <img
                    src={qr}
                    width="320"
                    height="320"
                    alt={
                      demo
                        ? 'QR Code de demonstração, não pagável'
                        : 'QR Code Pix do Fundo Musical — Regional Itapevi'
                    }
                  />
                </picture>
              </div>
              {demo && <p className="preview-label">Prévia de teste · este QR não é pagável</p>}
              <p className="qr-caption">Escaneie com o aplicativo do seu banco</p>
              <div className="pix-divider">
                <span>ou copie o código abaixo</span>
              </div>
              {offering.kind === 'ready' && (
                <div className="recipient">
                  <span>FAVORECIDO</span>
                  <strong>{offering.beneficiaryName}</strong>
                  <p>
                    {offering.bankName}
                    {offering.beneficiaryDocument ? ` · CNPJ ${offering.beneficiaryDocument}` : ''}
                  </p>
                </div>
              )}
              <button
                className={`button primary full copy-pix ${state === 'copied' ? 'copied' : ''}`}
                onClick={() => void copy()}
              >
                {state === 'copied' ? (
                  <Check size={21} aria-hidden="true" />
                ) : (
                  <Copy size={20} aria-hidden="true" />
                )}
                {state === 'copied'
                  ? 'Código copiado!'
                  : demo
                    ? 'Copiar código de teste'
                    : 'Copiar código Pix'}
              </button>
              <div role="status" aria-live="polite" className="pix-feedback">
                {state === 'copied'
                  ? demo
                    ? 'Texto de teste copiado. Não é um pagamento.'
                    : 'Agora abra seu banco e escolha Pix Copia e Cola.'
                  : state === 'copy-error'
                    ? 'Selecione o código abaixo e copie manualmente.'
                    : 'Depois, abra seu banco e use Pix Copia e Cola.'}
              </div>
              <button
                className="text-button code-toggle"
                onClick={() => setShowCode(!showCode)}
                aria-expanded={showCode}
                aria-controls="pix-code-section"
              >
                {showCode ? 'Ocultar código' : 'Ver código Pix'}{' '}
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {showCode && (
                <div id="pix-code-section" className="code-section">
                  <label htmlFor="pix-code">
                    {demo ? 'Código de teste, não pagável' : 'Pix Copia e Cola'}
                  </label>
                  <textarea
                    ref={codeField}
                    id="pix-code"
                    readOnly
                    value={offering.payload}
                    rows={3}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                  <button
                    className="text-button"
                    onClick={() => {
                      codeField.current?.focus();
                      codeField.current?.select();
                    }}
                  >
                    Selecionar código
                  </button>
                </div>
              )}
              <a
                className="save-qr"
                href={qr}
                download={demo ? 'qr-demonstracao.png' : 'pix-fundo-musical-itapevi.png'}
              >
                <Download size={15} aria-hidden="true" /> Salvar QR Code
              </a>
            </>
          ) : (
            <div className="pix-empty" role="status">
              {state === 'offline' ? (
                <WifiOff size={32} aria-hidden="true" />
              ) : (
                <QrCode size={38} aria-hidden="true" />
              )}
              <h2>{title}</h2>
              <p>
                {state === 'offline'
                  ? 'Reconecte-se ao Wi-Fi ou aos dados móveis para carregar os dados atuais.'
                  : state === 'expired'
                    ? 'Confira novamente os dados antes de contribuir.'
                    : state === 'error'
                      ? 'Verifique sua conexão e tente novamente.'
                      : 'O código do Fundo Musical precisa ser cadastrado para aparecer aqui.'}
              </p>
              <button className="button secondary" onClick={() => void refresh()}>
                <RefreshCw size={17} aria-hidden="true" /> Tentar novamente
              </button>
            </div>
          )}
          <div className="bank-tip">
            <LockKeyhole size={17} aria-hidden="true" />
            <p>
              Confira o favorecido no seu banco
              <br />
              <strong>antes de confirmar a transferência.</strong>
            </p>
          </div>
        </div>
        <footer className="pix-card-footer">
          <button className="text-button" onClick={() => setShowInstructions(true)}>
            <Smartphone size={17} aria-hidden="true" /> Como fazer o Pix{' '}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
          <span>Contribuição voluntária</span>
        </footer>
      </article>
      <p className="page-footnote">Exclusivo para o Fundo Musical · Regional Itapevi</p>
      {showInstructions && (
        <div
          className="instructions-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInstructions(false);
          }}
        >
          <dialog
            ref={dialog}
            className="instructions-sheet"
            aria-labelledby="instructions-title"
            onCancel={() => setShowInstructions(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowInstructions(false);
            }}
          >
            <span className="sheet-handle" aria-hidden="true" />
            <div className="sheet-icon">
              <Smartphone size={25} aria-hidden="true" />
            </div>
            <h2 id="instructions-title">
              {state === 'copied' ? 'Agora é no seu banco' : 'Como fazer o Pix'}
            </h2>
            <p>O pagamento é feito no aplicativo do seu banco.</p>
            <ol className="bank-steps">
              <li>
                <span>1</span>
                <p>Abra o aplicativo do seu banco.</p>
              </li>
              <li>
                <span>2</span>
                <p>
                  Toque em <strong>Pix → Copia e Cola</strong> e cole o código.
                </p>
              </li>
              <li>
                <span>3</span>
                <p>Informe o valor, confira o favorecido e confirme no banco.</p>
              </li>
            </ol>
            {demo && (
              <p className="preview-label">Esta prévia usa um texto de teste não pagável.</p>
            )}
            <button
              autoFocus
              className="button primary full"
              onClick={() => setShowInstructions(false)}
            >
              Entendi <Check size={18} aria-hidden="true" />
            </button>
            <small>
              Se abriu pelo Wi-Fi, conclua a conexão antes de usar o banco. Este site não confirma
              pagamentos.
            </small>
          </dialog>
        </div>
      )}
    </>
  );
}
