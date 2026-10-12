// Definição declarativa de cada tipo de conteúdo: campos do formulário,
// validação e construção do payload. O formulário é gerado a partir daqui,
// por isso acrescentar um tipo novo não obriga a criar um componente novo.

import {
  buildEmail,
  buildPhone,
  buildSms,
  buildText,
  buildUrl,
  buildVCard,
  buildWifi,
} from './payloads.js';
import { byteLength, isBlank, isValidEmail, isValidPhone, isValidUrl } from './validation.js';

const MSG = {
  required: 'Campo obrigatório.',
  url: 'Introduz um endereço válido, por exemplo exemplo.pt.',
  email: 'Introduz um e-mail válido.',
  phone: 'Introduz um número válido (3 a 15 dígitos, pode começar por +).',
};

export const CONTENT_TYPES = [
  {
    id: 'url',
    label: 'URL',
    hint: 'Abre um site no navegador.',
    fields: [
      { name: 'url', label: 'Endereço do site', type: 'url', required: true, placeholder: 'https://', autoComplete: 'url' },
    ],
    validate: ({ url }) => {
      if (isBlank(url)) return { url: MSG.required };
      if (!isValidUrl(url)) return { url: MSG.url };
      return {};
    },
    build: buildUrl,
  },
  {
    id: 'text',
    label: 'Texto',
    hint: 'Mostra um texto simples.',
    fields: [{ name: 'text', label: 'Texto', type: 'textarea', required: true, maxLength: 1500 }],
    validate: ({ text }) => (isBlank(text) ? { text: MSG.required } : {}),
    build: buildText,
  },
  {
    id: 'wifi',
    label: 'Wi-Fi',
    hint: 'Liga o telemóvel a uma rede sem escrever a palavra-passe.',
    fields: [
      { name: 'ssid', label: 'Nome da rede (SSID)', type: 'text', required: true, autoComplete: 'off' },
      {
        name: 'security',
        label: 'Segurança',
        type: 'select',
        options: [
          { value: 'WPA', label: 'WPA / WPA2 / WPA3' },
          { value: 'WEP', label: 'WEP (antigo)' },
          { value: 'nopass', label: 'Sem palavra-passe' },
        ],
      },
      {
        name: 'password',
        label: 'Palavra-passe',
        type: 'password',
        required: true,
        autoComplete: 'off',
        visible: (values) => values.security !== 'nopass',
      },
      { name: 'hidden', label: 'Rede oculta', type: 'checkbox' },
    ],
    validate: ({ ssid, password, security }) => {
      const errors = {};
      if (isBlank(ssid)) errors.ssid = MSG.required;
      else if (byteLength(ssid) > 32) errors.ssid = 'O nome da rede tem no máximo 32 bytes.';

      if (security === 'WPA') {
        if (password === '') errors.password = MSG.required;
        else if (password.length < 8 || password.length > 63)
          errors.password = 'Uma palavra-passe WPA tem entre 8 e 63 caracteres.';
      } else if (security === 'WEP') {
        const validWep = [5, 13].includes(password.length) || /^([\da-f]{10}|[\da-f]{26})$/i.test(password);
        if (password === '') errors.password = MSG.required;
        else if (!validWep) errors.password = 'Uma chave WEP tem 5 ou 13 caracteres (ou 10/26 hexadecimais).';
      }
      return errors;
    },
    build: buildWifi,
  },
  {
    id: 'email',
    label: 'E-mail',
    hint: 'Abre um e-mail pré-preenchido.',
    fields: [
      { name: 'to', label: 'Destinatário', type: 'email', required: true, autoComplete: 'off' },
      { name: 'subject', label: 'Assunto', type: 'text', maxLength: 200 },
      { name: 'body', label: 'Mensagem', type: 'textarea', maxLength: 1000 },
    ],
    validate: ({ to }) => {
      if (isBlank(to)) return { to: MSG.required };
      if (!isValidEmail(to)) return { to: MSG.email };
      return {};
    },
    build: buildEmail,
  },
  {
    id: 'phone',
    label: 'Telefone',
    hint: 'Liga para um número.',
    fields: [{ name: 'phone', label: 'Número de telefone', type: 'tel', required: true, autoComplete: 'off' }],
    validate: ({ phone }) => {
      if (isBlank(phone)) return { phone: MSG.required };
      if (!isValidPhone(phone)) return { phone: MSG.phone };
      return {};
    },
    build: buildPhone,
  },
  {
    id: 'sms',
    label: 'SMS',
    hint: 'Prepara uma mensagem para um número.',
    fields: [
      { name: 'phone', label: 'Número de telefone', type: 'tel', required: true, autoComplete: 'off' },
      { name: 'message', label: 'Mensagem', type: 'textarea', maxLength: 500 },
    ],
    validate: ({ phone }) => {
      if (isBlank(phone)) return { phone: MSG.required };
      if (!isValidPhone(phone)) return { phone: MSG.phone };
      return {};
    },
    build: buildSms,
  },
  {
    id: 'vcard',
    label: 'Contacto',
    hint: 'Guarda um contacto (vCard) no telemóvel.',
    fields: [
      { name: 'firstName', label: 'Nome próprio', type: 'text', required: true, autoComplete: 'off' },
      { name: 'lastName', label: 'Apelido', type: 'text', autoComplete: 'off' },
      { name: 'phone', label: 'Telefone', type: 'tel', autoComplete: 'off' },
      { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'off' },
      { name: 'organization', label: 'Empresa', type: 'text', autoComplete: 'off' },
      { name: 'jobTitle', label: 'Cargo', type: 'text', autoComplete: 'off' },
      { name: 'website', label: 'Site', type: 'url', autoComplete: 'off' },
    ],
    validate: ({ firstName, phone, email, website }) => {
      const errors = {};
      if (isBlank(firstName)) errors.firstName = MSG.required;
      if (!isBlank(phone) && !isValidPhone(phone)) errors.phone = MSG.phone;
      if (!isBlank(email) && !isValidEmail(email)) errors.email = MSG.email;
      if (!isBlank(website) && !isValidUrl(website)) errors.website = MSG.url;
      return errors;
    },
    build: buildVCard,
  },
];

export const CONTENT_TYPE_IDS = CONTENT_TYPES.map((type) => type.id);

export function getContentType(id) {
  return CONTENT_TYPES.find((type) => type.id === id);
}

function defaultValueFor(field) {
  if (field.type === 'checkbox') return false;
  if (field.type === 'select') return field.options[0].value;
  return '';
}

export function getInitialValues(typeId) {
  return Object.fromEntries(getContentType(typeId).fields.map((f) => [f.name, defaultValueFor(f)]));
}

export function getAllInitialValues() {
  return Object.fromEntries(CONTENT_TYPE_IDS.map((id) => [id, getInitialValues(id)]));
}

// "Vazio" = o utilizador ainda não escreveu nada (selects e checkboxes não contam).
function isUntouchedForm(type, values) {
  return type.fields
    .filter((f) => f.type !== 'select' && f.type !== 'checkbox')
    .every((f) => isBlank(values[f.name]));
}

/**
 * Valida os valores e devolve o texto a codificar.
 * @returns {{ status: 'empty' | 'invalid' | 'valid', errors: Record<string,string>, data: string }}
 */
export function buildPayload(typeId, values) {
  const type = getContentType(typeId);
  const errors = type.validate(values);
  if (isUntouchedForm(type, values)) return { status: 'empty', errors, data: '' };
  if (Object.keys(errors).length > 0) return { status: 'invalid', errors, data: '' };
  return { status: 'valid', errors, data: type.build(values) };
}
