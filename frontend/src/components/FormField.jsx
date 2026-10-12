import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Um campo do formulário com etiqueta, mensagem de erro e atributos de acessibilidade.
export default function FormField({ field, value, error, onChange, onBlur }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [showPassword, setShowPassword] = useState(false);

  if (field.type === 'checkbox') {
    return (
      <label className="checkbox">
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
        {field.label}
      </label>
    );
  }

  const common = {
    id,
    name: field.name,
    value,
    onBlur,
    onChange: (event) => onChange(event.target.value),
    required: field.required,
    maxLength: field.maxLength,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: 'input',
  };

  let control;
  if (field.type === 'textarea') {
    control = <textarea {...common} rows={4} />;
  } else if (field.type === 'select') {
    control = (
      <select {...common}>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'password') {
    control = (
      <div className="input-group">
        <input {...common} type={showPassword ? 'text' : 'password'} autoComplete={field.autoComplete} spellCheck={false} />
        <button
          type="button"
          className="icon-button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    );
  } else {
    control = (
      <input
        {...common}
        type={field.type}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        inputMode={field.type === 'tel' ? 'tel' : undefined}
      />
    );
  }

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>
      {control}
      {field.maxLength && field.type === 'textarea' && (
        <span className="field__counter">
          {value.length}/{field.maxLength}
        </span>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
