import { useEffect, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { downloadBlob, svgToPngBlob } from '../lib/compose.js';
import { getErrorCorrectionLevel } from '../lib/qrStyle.js';
import Warnings from './Warnings.jsx';

// Copiar imagens exige a API Clipboard com ClipboardItem (e um contexto seguro: https ou localhost).
const CAN_COPY_IMAGE = Boolean(navigator.clipboard?.write) && typeof ClipboardItem !== 'undefined';

function getFormatNotes(style) {
  const notes = [];
  if (style.frameEnabled && style.frameText.trim()) {
    notes.push({
      level: 'info',
      message:
        'No SVG, o texto da moldura usa as fontes do dispositivo onde for aberto e pode variar ligeiramente. Para um resultado idêntico em qualquer lado, usa PNG.',
    });
  }
  if (style.logo) {
    notes.push({
      level: 'info',
      message: 'No SVG, o logótipo fica incorporado como imagem (não é convertido em vetor).',
    });
  }
  return notes;
}

export default function ExportControls({ qr, disabled, fileName, style }) {
  const [exporting, setExporting] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // A confirmação "Copiado" desaparece passados 2 segundos.
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function exportAs(format) {
    setExporting(format);
    setError('');
    try {
      const blob =
        format === 'png'
          ? await svgToPngBlob(qr.svg, qr.width, qr.height)
          : new Blob([qr.svg], { type: 'image/svg+xml' });
      downloadBlob(blob, `${fileName}.${format}`);
    } catch (exportError) {
      setError(`${exportError.message} Tenta o outro formato.`);
    } finally {
      setExporting(null);
    }
  }

  async function copyImage() {
    setExporting('copy');
    setError('');
    try {
      // O ClipboardItem recebe a Promise diretamente: o Safari exige que seja criado
      // no mesmo instante do clique, antes de qualquer await.
      const item = new ClipboardItem({ 'image/png': svgToPngBlob(qr.svg, qr.width, qr.height) });
      await navigator.clipboard.write([item]);
      setCopied(true);
    } catch {
      setError('Não foi possível copiar a imagem. Usa "Descarregar PNG".');
    } finally {
      setExporting(null);
    }
  }

  const level = getErrorCorrectionLevel(style);
  const busy = disabled || exporting !== null;

  return (
    <div className="export">
      <div className="export__buttons">
        <button type="button" className="button button--primary" disabled={busy} onClick={() => exportAs('png')}>
          <Download size={18} aria-hidden="true" />
          {exporting === 'png' ? 'A preparar…' : 'Descarregar PNG'}
        </button>
        <button type="button" className="button button--secondary" disabled={busy} onClick={() => exportAs('svg')}>
          <Download size={18} aria-hidden="true" />
          {exporting === 'svg' ? 'A preparar…' : 'Descarregar SVG'}
        </button>
        {CAN_COPY_IMAGE && (
          <button type="button" className="button button--ghost export__copy" disabled={busy} onClick={copyImage}>
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            {copied ? 'Copiado!' : 'Copiar imagem'}
          </button>
        )}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {copied ? 'Imagem copiada para a área de transferência.' : ''}
      </p>
      <p className="export__meta">
        {qr.width > 0 ? `${qr.width} × ${qr.height} px` : `${style.size} px`} · Correção de erros {level}
      </p>
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
      <Warnings items={getFormatNotes(style)} />
    </div>
  );
}
