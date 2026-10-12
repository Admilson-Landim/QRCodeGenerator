import { useMemo } from 'react';
import { LoaderCircle, QrCode, TriangleAlert } from 'lucide-react';
import { svgToDataUrl } from '../lib/compose.js';

function Placeholder({ icon: Icon, title, children, tone }) {
  return (
    <div className={`preview__placeholder ${tone ? `preview__placeholder--${tone}` : ''}`}>
      <Icon size={40} aria-hidden="true" />
      <p className="preview__placeholder-title">{title}</p>
      <p>{children}</p>
    </div>
  );
}

export default function QRCodePreview({ payloadStatus, qr, isPending, warnings }) {
  const src = useMemo(() => (qr.svg ? svgToDataUrl(qr.svg) : null), [qr.svg]);
  const hasContrastProblem = warnings.some((warning) => warning.level === 'error');

  let content;
  if (payloadStatus === 'empty') {
    content = (
      <Placeholder icon={QrCode} title="O teu QR Code aparece aqui">
        Escolhe o tipo de conteúdo e preenche os campos. A pré-visualização atualiza-se automaticamente.
      </Placeholder>
    );
  } else if (payloadStatus === 'invalid') {
    content = (
      <Placeholder icon={TriangleAlert} title="Faltam dados" tone="muted">
        Completa ou corrige os campos do formulário para gerar o QR Code.
      </Placeholder>
    );
  } else if (qr.status === 'error' && !isPending) {
    // Enquanto há alterações pendentes, o erro pode ser de um conteúdo anterior.
    content = (
      <Placeholder icon={TriangleAlert} title="Erro" tone="error">
        {qr.error}
      </Placeholder>
    );
  } else if (src && qr.status !== 'error') {
    content = (
      <img
        className="preview__image"
        src={src}
        width={qr.width}
        height={qr.height}
        alt="Pré-visualização do QR Code gerado"
      />
    );
  }

  const showSpinner = payloadStatus === 'valid' && isPending;

  return (
    <div className="preview">
      <div className="preview__stage" aria-busy={showSpinner}>
        {content}
        {showSpinner && (
          <span className="preview__spinner" role="status">
            <LoaderCircle size={20} aria-hidden="true" />
            <span className="visually-hidden">A atualizar a pré-visualização…</span>
          </span>
        )}
      </div>
      {payloadStatus === 'valid' && hasContrastProblem && (
        <p className="field__error">Atenção: o contraste das cores pode impedir a leitura deste código.</p>
      )}
    </div>
  );
}
