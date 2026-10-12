import { describe, expect, it } from 'vitest';
import { buildPayload, getInitialValues } from './contentTypes.js';
import { isValidEmail, isValidPhone, isValidUrl, normalizeUrl } from './validation.js';
import { contrastRatio, getColorWarnings, COLOR_PRESETS } from './color.js';

const withValues = (type, values) => buildPayload(type, { ...getInitialValues(type), ...values });

describe('validação', () => {
  it('URLs', () => {
    expect(isValidUrl('exemplo.pt')).toBe(true);
    expect(isValidUrl('https://exemplo.pt/a?b=1')).toBe(true);
    expect(isValidUrl('http://localhost:5173')).toBe(true);
    expect(isValidUrl('exemplo')).toBe(false);
    expect(isValidUrl('ftp://exemplo.pt')).toBe(false);
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('exemplo .pt')).toBe(false);
    expect(normalizeUrl(' exemplo.pt ')).toBe('https://exemplo.pt');
  });

  it('e-mail e telefone', () => {
    expect(isValidEmail('ana@exemplo.pt')).toBe(true);
    expect(isValidEmail('ana@exemplo')).toBe(false);
    expect(isValidPhone('+351 912 345 678')).toBe(true);
    expect(isValidPhone('(21) 123-4567')).toBe(true);
    expect(isValidPhone('abc')).toBe(false);
    expect(isValidPhone('12')).toBe(false);
  });
});

describe('buildPayload', () => {
  it('formulário vazio não gera dados', () => {
    for (const type of ['url', 'text', 'wifi', 'email', 'phone', 'sms', 'vcard']) {
      expect(buildPayload(type, getInitialValues(type))).toMatchObject({ status: 'empty', data: '' });
    }
  });

  it('dados inválidos não geram dados', () => {
    expect(withValues('url', { url: 'nao valido' })).toMatchObject({ status: 'invalid', data: '' });
    expect(withValues('email', { to: 'x' }).errors.to).toBeTruthy();
    expect(withValues('text', { text: '   ' }).status).toBe('empty');
  });

  it('URL', () => {
    expect(withValues('url', { url: 'exemplo.pt' }).data).toBe('https://exemplo.pt');
  });

  it('Wi-Fi com escape de caracteres especiais', () => {
    const result = withValues('wifi', { ssid: 'Casa;1', password: 'pa:ss"word', security: 'WPA' });
    expect(result.data).toBe('WIFI:T:WPA;S:Casa\\;1;P:pa\\:ss\\"word;;');
  });

  it('Wi-Fi: palavra-passe WPA curta é inválida, rede aberta não precisa', () => {
    expect(withValues('wifi', { ssid: 'Casa', password: '123' }).errors.password).toBeTruthy();
    expect(withValues('wifi', { ssid: 'Casa', security: 'nopass', hidden: true }).data).toBe('WIFI:T:nopass;S:Casa;H:true;;');
  });

  it('e-mail com assunto e mensagem codificados', () => {
    const result = withValues('email', { to: 'ana@exemplo.pt', subject: 'Olá & adeus', body: 'Linha 1' });
    expect(result.data).toBe('mailto:ana@exemplo.pt?subject=Ol%C3%A1%20%26%20adeus&body=Linha%201');
  });

  it('telefone e SMS normalizados', () => {
    expect(withValues('phone', { phone: '+351 912 345 678' }).data).toBe('tel:+351912345678');
    expect(withValues('sms', { phone: '912345678', message: 'Olá' }).data).toBe('SMSTO:912345678:Olá');
    expect(withValues('sms', { phone: '912345678' }).data).toBe('SMSTO:912345678');
  });

  it('vCard', () => {
    const result = withValues('vcard', { firstName: 'Ana', lastName: 'Silva', phone: '912 345 678', organization: 'A, B; C' });
    expect(result.data.split('\r\n')).toEqual([
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Silva;Ana;;;',
      'FN:Ana Silva',
      'ORG:A\\, B\\; C',
      'TEL;TYPE=CELL:912345678',
      'END:VCARD',
    ]);
    expect(withValues('vcard', { firstName: 'Ana', email: 'mau' }).status).toBe('invalid');
  });
});

describe('cores', () => {
  it('contraste', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(getColorWarnings({ dotsColor: '#cccccc', backgroundColor: '#ffffff' })[0].level).toBe('error');
    expect(getColorWarnings({ dotsColor: '#ffffff', backgroundColor: '#000000' })[0].message).toMatch(/invertidas/);
  });

  it('todas as combinações predefinidas têm bom contraste', () => {
    for (const preset of COLOR_PRESETS) {
      expect(getColorWarnings(preset)).toEqual([]);
    }
  });
});

describe('codificação UTF-8', () => {
  it('converte caracteres acentuados e emojis em bytes UTF-8', async () => {
    const { toUtf8ByteString } = await import('./qrStyle.js');
    expect(toUtf8ByteString('abc')).toBe('abc');
    expect([...toUtf8ByteString('ç✓')].map((c) => c.charCodeAt(0))).toEqual([0xc3, 0xa7, 0xe2, 0x9c, 0x93]);
  });
});
