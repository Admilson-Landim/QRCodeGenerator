import { useId, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { LOGO_SIZE } from '../lib/qrStyle.js';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const MAX_BYTES = 2 * 1024 * 1024;

// Lê o ficheiro localmente como data URL; a imagem nunca sai do navegador.
function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function LogoField({ logo, logoName, logoSize, onChange }) {
  const inputId = useId();
  const sizeId = useId();
  const [error, setError] = useState('');

  async function handleFile(event) {
    const file = event.target.files[0];
    event.target.value = ''; // permite voltar a escolher o mesmo ficheiro
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato não suportado. Usa PNG, JPG, WebP ou SVG.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('A imagem tem mais de 2 MB. Escolhe uma imagem mais pequena.');
      return;
    }
    try {
      setError('');
      onChange({ logo: await readAsDataUrl(file), logoName: file.name });
    } catch {
      setError('Não foi possível ler a imagem.');
    }
  }

  return (
    <div className="logo-field">
      {logo ? (
        <div className="logo-field__current">
          <img src={logo} alt="" className="logo-field__thumb" />
          <span className="logo-field__name">{logoName}</span>
          <button type="button" className="button button--ghost" onClick={() => onChange({ logo: null, logoName: '' })}>
            <Trash2 size={16} aria-hidden="true" /> Remover
          </button>
        </div>
      ) : (
        <>
          {/* O input fica oculto mas focável; a etiqueta seguinte funciona como botão. */}
          <input id={inputId} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleFile} className="visually-hidden file-input" />
          <label htmlFor={inputId} className="button button--secondary">
            <ImagePlus size={16} aria-hidden="true" /> Escolher imagem
          </label>
        </>
      )}

      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}

      {logo && (
        <div className="field">
          <label htmlFor={sizeId} className="field__label">
            Tamanho do logótipo: {Math.round(logoSize * 100)}%
          </label>
          <input
            id={sizeId}
            type="range"
            min={LOGO_SIZE.min}
            max={LOGO_SIZE.max}
            step={LOGO_SIZE.step}
            value={logoSize}
            onChange={(event) => onChange({ logoSize: Number(event.target.value) })}
          />
        </div>
      )}
      <p className="field__hint">
        Com logótipo, o código usa correção de erros máxima (H) para continuar legível. Logótipos grandes reduzem a margem
        de segurança.
      </p>
    </div>
  );
}
