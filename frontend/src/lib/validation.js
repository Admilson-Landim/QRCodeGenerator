// Funções puras de normalização e validação. Não dependem do React,
// por isso podem ser testadas isoladamente (ver validation.test.js).

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?\d{3,15}$/;
const HAS_SCHEME = /^[a-z][a-z\d+.-]*:/i;

export function isBlank(value) {
  return typeof value !== 'string' || value.trim() === '';
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

// Remove espaços, hífenes, pontos e parênteses: "+351 912 345 678" -> "+351912345678".
export function normalizePhone(value) {
  return value.replace(/[\s().-]/g, '');
}

export function isValidPhone(value) {
  return PHONE_PATTERN.test(normalizePhone(value));
}

// Acrescenta "https://" quando o utilizador escreve apenas "exemplo.pt".
export function normalizeUrl(value) {
  const trimmed = value.trim();
  return HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function isValidUrl(value) {
  const trimmed = value.trim();
  if (/\s/.test(trimmed)) return false;
  try {
    const url = new URL(normalizeUrl(trimmed));
    const isWeb = url.protocol === 'http:' || url.protocol === 'https:';
    const hasHost = url.hostname === 'localhost' || /\.[a-z\d-]{2,}$/i.test(url.hostname);
    return isWeb && hasHost;
  } catch {
    return false;
  }
}

// Tamanho em bytes UTF-8 (o SSID Wi-Fi tem um limite de 32 bytes, não caracteres).
export function byteLength(value) {
  return new TextEncoder().encode(value).length;
}
