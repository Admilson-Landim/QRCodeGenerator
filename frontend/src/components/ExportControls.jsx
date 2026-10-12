import { useState } from 'react';
import { Download } from 'lucide-react';
import { downloadBlob, svgToPngBlob } from '../lib/compose.js';
import { getErrorCorrectionLevel } from '../lib/qrStyle.js';
import Warnings from './Warnings.jsx';

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

  const level = getErrorCorrectionLevel(style);

  return (
    <div className="export">
      <div className="export__buttons">
        <button type="button" className="button button--primary" disabled={disabled || exporting !== null} onClick={() => exportAs('png')}>
          <Download size={18} aria-hidden="true" />
          {exporting === 'png' ? 'A preparar…' : 'Descarregar PNG'}
        </button>
        <button type="button" className="button button--secondary" disabled={disabled || exporting !== null} onClick={() => exportAs('svg')}>
          <Download size={18} aria-hidden="true" />
          {exporting === 'svg' ? 'A preparar…' : 'Descarregar SVG'}
        </button>
      </div>
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
