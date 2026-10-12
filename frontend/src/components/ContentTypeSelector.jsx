import { Contact, Link, Mail, MessageSquare, Phone, Type, Wifi } from 'lucide-react';
import { CONTENT_TYPES } from '../lib/contentTypes.js';

const ICONS = { url: Link, text: Type, wifi: Wifi, email: Mail, phone: Phone, sms: MessageSquare, vcard: Contact };

// Usa radios nativos: o teclado (setas, Tab) funciona sem código extra.
export default function ContentTypeSelector({ value, onChange }) {
  const selected = CONTENT_TYPES.find((type) => type.id === value);

  return (
    <fieldset className="type-selector">
      <legend className="field__label">Tipo de conteúdo</legend>
      <div className="type-selector__options">
        {CONTENT_TYPES.map((type) => {
          const Icon = ICONS[type.id];
          return (
            <label key={type.id} className="type-option">
              <input
                type="radio"
                name="content-type"
                value={type.id}
                checked={value === type.id}
                onChange={() => onChange(type.id)}
              />
              <span className="type-option__body">
                <Icon size={18} aria-hidden="true" />
                {type.label}
              </span>
            </label>
          );
        })}
      </div>
      <p className="type-selector__hint">{selected.hint}</p>
    </fieldset>
  );
}
