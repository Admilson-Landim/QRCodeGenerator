// Opções visuais da aplicação e tradução para o formato da biblioteca qr-code-styling.

export const DEFAULT_STYLE = {
  dotsColor: '#111111',
  backgroundColor: '#ffffff',
  dotsType: 'square',
  cornersSquareType: 'square',
  cornersDotType: 'square',
  logo: null, // data URL lido localmente (nunca é enviado para nenhum servidor)
  logoName: '',
  logoSize: 0.3,
  size: 1024,
  frameEnabled: false,
  frameText: 'Digitaliza-me',
  frameColor: '#111111',
};

export const DOT_TYPES = [
  { value: 'square', label: 'Quadrados' },
  { value: 'rounded', label: 'Arredondados' },
  { value: 'extra-rounded', label: 'Muito arredondados' },
  { value: 'dots', label: 'Pontos' },
  { value: 'classy', label: 'Elegante' },
  { value: 'classy-rounded', label: 'Elegante arredondado' },
];

export const CORNER_SQUARE_TYPES = [
  { value: 'square', label: 'Quadrado' },
  { value: 'extra-rounded', label: 'Arredondado' },
  { value: 'dot', label: 'Circular' },
];

export const CORNER_DOT_TYPES = [
  { value: 'square', label: 'Quadrado' },
  { value: 'dot', label: 'Circular' },
];

export const SIZES = [256, 512, 1024, 2048];

export const LOGO_SIZE = { min: 0.15, max: 0.4, step: 0.05 };

// Com logótipo usamos o nível H (até ~30% do código pode ficar tapado).
// Sem logótipo, o nível M é um bom equilíbrio entre robustez e densidade.
export function getErrorCorrectionLevel(style) {
  return style.logo ? 'H' : 'M';
}

/**
 * Dimensões da imagem final. Com moldura, o QR Code fica mais pequeno
 * para caber dentro da largura escolhida e o texto ocupa uma faixa por baixo.
 */
export function getLayout(style) {
  const { size, frameEnabled, frameText } = style;
  if (!frameEnabled) return { width: size, height: size, qrSize: size, border: 0, captionHeight: 0 };

  const border = Math.round(size * 0.04);
  const captionHeight = frameText.trim() ? Math.round(size * 0.16) : border;
  const qrSize = size - border * 2;
  return { width: size, height: border + qrSize + captionHeight, qrSize, border, captionHeight };
}

/**
 * A qr-code-styling converte cada carácter num byte com `charCode & 255`,
 * o que corrompe acentos e emojis ("ç", "ã", "✓"). Convertemos primeiro para
 * bytes UTF-8 e passamos uma string em que cada carácter representa um byte.
 */
export function toUtf8ByteString(text) {
  return Array.from(new TextEncoder().encode(text), (byte) => String.fromCharCode(byte)).join('');
}

export function toQrCodeStylingOptions(data, style, qrSize) {
  return {
    type: 'svg',
    width: qrSize,
    height: qrSize,
    // Zona de silêncio à volta do código, necessária para os leitores o detetarem.
    margin: Math.round(qrSize * 0.06),
    data: toUtf8ByteString(data),
    // String vazia (e não undefined) para que update() remova um logótipo anterior.
    image: style.logo ?? '',
    qrOptions: { errorCorrectionLevel: getErrorCorrectionLevel(style) },
    imageOptions: { hideBackgroundDots: true, imageSize: style.logoSize, margin: Math.round(qrSize * 0.01) },
    dotsOptions: { type: style.dotsType, color: style.dotsColor },
    // Os marcadores de posição usam a mesma cor dos módulos para se manterem legíveis.
    cornersSquareOptions: { type: style.cornersSquareType, color: style.dotsColor },
    cornersDotOptions: { type: style.cornersDotType, color: style.dotsColor },
    backgroundOptions: { color: style.backgroundColor },
  };
}
