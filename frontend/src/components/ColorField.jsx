import { useId } from 'react';
import { HEX_COLOR } from '../lib/color.js';

// Seletor de cor nativo + campo de texto para escrever o código hexadecimal.
export default function ColorField({ label, value, onChange }) {
  const id = useId();

  function commitHex(event) {
    const hex = event.target.value.trim();
    const normalized = hex.startsWith('#') ? hex : `#${hex}`;
    if (HEX_COLOR.test(normalized)) onChange(normalized.toLowerCase());
    else event.target.value = value; // valor inválido: repõe o anterior
  }

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className="color-field">
        <input
          type="color"
          className="color-field__swatch"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label}: seletor de cor`}
        />
        {/* key={value}: o campo de texto é recriado quando a cor muda pelo seletor. */}
        <input
          key={value}
          id={id}
          className="input color-field__hex"
          defaultValue={value}
          maxLength={7}
          spellCheck={false}
          onBlur={commitHex}
          onKeyDown={(event) => event.key === 'Enter' && commitHex(event)}
        />
      </div>
    </div>
  );
}
