import { useId } from 'react';
import ColorField from './ColorField.jsx';
import SelectField from './SelectField.jsx';
import LogoField from './LogoField.jsx';
import Warnings from './Warnings.jsx';
import { COLOR_PRESETS } from '../lib/color.js';
import { CORNER_DOT_TYPES, CORNER_SQUARE_TYPES, DOT_TYPES, SIZES } from '../lib/qrStyle.js';

const SIZE_OPTIONS = SIZES.map((size) => ({ value: String(size), label: `${size} × ${size} px` }));

export default function CustomizationPanel({ style, onChange, warnings }) {
  const frameTextId = useId();

  return (
    <div className="customization">
      <fieldset className="group">
        <legend>Cores</legend>
        <div className="presets" role="group" aria-label="Combinações predefinidas">
          {COLOR_PRESETS.map((preset) => {
            const active = preset.dotsColor === style.dotsColor && preset.backgroundColor === style.backgroundColor;
            return (
              <button
                key={preset.id}
                type="button"
                className="preset"
                aria-pressed={active}
                onClick={() => onChange({ dotsColor: preset.dotsColor, backgroundColor: preset.backgroundColor })}
              >
                <span className="preset__swatch" style={{ background: preset.backgroundColor }} aria-hidden="true">
                  <span style={{ background: preset.dotsColor }} />
                </span>
                {preset.name}
              </button>
            );
          })}
        </div>
        <div className="grid-2">
          <ColorField label="Cor do código" value={style.dotsColor} onChange={(dotsColor) => onChange({ dotsColor })} />
          <ColorField
            label="Cor de fundo"
            value={style.backgroundColor}
            onChange={(backgroundColor) => onChange({ backgroundColor })}
          />
        </div>
        <Warnings items={warnings} />
      </fieldset>

      <fieldset className="group">
        <legend>Forma</legend>
        <div className="grid-3">
          <SelectField label="Módulos" value={style.dotsType} options={DOT_TYPES} onChange={(dotsType) => onChange({ dotsType })} />
          <SelectField
            label="Marcadores (exterior)"
            value={style.cornersSquareType}
            options={CORNER_SQUARE_TYPES}
            onChange={(cornersSquareType) => onChange({ cornersSquareType })}
          />
          <SelectField
            label="Marcadores (interior)"
            value={style.cornersDotType}
            options={CORNER_DOT_TYPES}
            onChange={(cornersDotType) => onChange({ cornersDotType })}
          />
        </div>
      </fieldset>

      <fieldset className="group">
        <legend>Logótipo (opcional)</legend>
        <LogoField logo={style.logo} logoName={style.logoName} logoSize={style.logoSize} onChange={onChange} />
      </fieldset>

      <fieldset className="group">
        <legend>Moldura</legend>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={style.frameEnabled}
            onChange={(event) => onChange({ frameEnabled: event.target.checked })}
          />
          Adicionar moldura com texto
        </label>
        {style.frameEnabled && (
          <div className="grid-2">
            <div className="field">
              <label htmlFor={frameTextId} className="field__label">
                Texto da moldura
              </label>
              <input
                id={frameTextId}
                className="input"
                value={style.frameText}
                maxLength={30}
                onChange={(event) => onChange({ frameText: event.target.value })}
              />
            </div>
            <ColorField label="Cor da moldura" value={style.frameColor} onChange={(frameColor) => onChange({ frameColor })} />
          </div>
        )}
      </fieldset>

      <fieldset className="group">
        <legend>Exportação</legend>
        <SelectField
          label="Tamanho da imagem"
          value={String(style.size)}
          options={SIZE_OPTIONS}
          onChange={(size) => onChange({ size: Number(size) })}
        />
      </fieldset>
    </div>
  );
}
