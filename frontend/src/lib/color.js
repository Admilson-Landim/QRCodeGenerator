// Utilitários de cor: contraste WCAG e avisos de legibilidade do QR Code.

export const HEX_COLOR = /^#[\da-f]{6}$/i;

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Luminância relativa segundo a WCAG 2.x.
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

// Cor de texto legível sobre um fundo (usada no texto da moldura).
export function readableTextColor(background) {
  return contrastRatio(background, '#ffffff') >= contrastRatio(background, '#111111') ? '#ffffff' : '#111111';
}

/**
 * Avisos sobre as cores escolhidas. Não bloqueiam a exportação,
 * mas explicam porque é que o código pode não ser lido.
 */
export function getColorWarnings({ dotsColor, backgroundColor }) {
  const warnings = [];
  const ratio = contrastRatio(dotsColor, backgroundColor);

  if (ratio < 3) {
    warnings.push({
      level: 'error',
      message: `Contraste muito baixo (${ratio.toFixed(1)}:1). Muitos leitores não conseguem ler este código. Recomenda-se pelo menos 4,5:1.`,
    });
  } else if (ratio < 4.5) {
    warnings.push({
      level: 'warning',
      message: `Contraste baixo (${ratio.toFixed(1)}:1). Testa a leitura antes de imprimir; recomenda-se pelo menos 4,5:1.`,
    });
  }

  if (luminance(dotsColor) > luminance(backgroundColor)) {
    warnings.push({
      level: 'warning',
      message: 'Os módulos são mais claros do que o fundo (cores invertidas). Algumas aplicações não leem códigos invertidos.',
    });
  }
  return warnings;
}

export const COLOR_PRESETS = [
  { id: 'classic', name: 'Clássico', dotsColor: '#111111', backgroundColor: '#ffffff' },
  { id: 'navy', name: 'Marinho', dotsColor: '#1e3a5f', backgroundColor: '#ffffff' },
  { id: 'petrol', name: 'Petróleo', dotsColor: '#0f4c52', backgroundColor: '#eef6f5' },
  { id: 'forest', name: 'Floresta', dotsColor: '#1f4d36', backgroundColor: '#f3f7f0' },
  { id: 'wine', name: 'Bordô', dotsColor: '#6b1d2f', backgroundColor: '#fcf5f2' },
  { id: 'ink', name: 'Tinta', dotsColor: '#2b2d42', backgroundColor: '#f3efe4' },
];
