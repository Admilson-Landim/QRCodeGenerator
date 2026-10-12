// Construção do texto que fica codificado no QR Code para cada tipo de conteúdo.
// Os formatos seguem as convenções reconhecidas pelas câmaras de iOS e Android.

import { normalizePhone, normalizeUrl } from './validation.js';

export function buildUrl({ url }) {
  return normalizeUrl(url);
}

export function buildText({ text }) {
  return text;
}

// No formato WIFI: os caracteres \ ; , : " têm de ser escapados com "\".
function escapeWifi(value) {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

export function buildWifi({ ssid, password, security, hidden }) {
  const parts = [`T:${security}`, `S:${escapeWifi(ssid)}`];
  if (security !== 'nopass') parts.push(`P:${escapeWifi(password)}`);
  if (hidden) parts.push('H:true');
  return `WIFI:${parts.join(';')};;`;
}

export function buildEmail({ to, subject, body }) {
  const params = [];
  if (subject.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
  if (body.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);
  const query = params.length ? `?${params.join('&')}` : '';
  return `mailto:${to.trim()}${query}`;
}

export function buildPhone({ phone }) {
  return `tel:${normalizePhone(phone)}`;
}

// SMSTO é o formato com melhor suporte para incluir uma mensagem pré-preenchida.
export function buildSms({ phone, message }) {
  const text = message.trim();
  return `SMSTO:${normalizePhone(phone)}${text ? `:${text}` : ''}`;
}

// No vCard: \ , ; e quebras de linha têm de ser escapados.
function escapeVCard(value) {
  return value
    .trim()
    .replace(/\\/g, '\\\\')
    .replace(/([,;])/g, '\\$1')
    .replace(/\r?\n/g, '\\n');
}

export function buildVCard({ firstName, lastName, phone, email, organization, jobTitle, website }) {
  const first = escapeVCard(firstName);
  const last = escapeVCard(lastName);
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${last};${first};;;`,
    `FN:${[first, last].filter(Boolean).join(' ')}`,
  ];
  if (organization.trim()) lines.push(`ORG:${escapeVCard(organization)}`);
  if (jobTitle.trim()) lines.push(`TITLE:${escapeVCard(jobTitle)}`);
  if (phone.trim()) lines.push(`TEL;TYPE=CELL:${normalizePhone(phone)}`);
  if (email.trim()) lines.push(`EMAIL:${email.trim()}`);
  if (website.trim()) lines.push(`URL:${normalizeUrl(website)}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}
