import FormField from './FormField.jsx';

// Formulário gerado a partir da definição do tipo (ver lib/contentTypes.js).
export default function ContentForm({ type, values, errors, touched, onChange, onBlur }) {
  const visibleFields = type.fields.filter((field) => !field.visible || field.visible(values));

  return (
    <form className="content-form" noValidate onSubmit={(event) => event.preventDefault()}>
      {visibleFields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={values[field.name]}
          error={touched[field.name] ? errors[field.name] : undefined}
          onChange={(value) => onChange(field.name, value)}
          onBlur={() => onBlur(field.name)}
        />
      ))}
      <p className="form-note">* Campo obrigatório</p>
    </form>
  );
}
