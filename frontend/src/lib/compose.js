// Composição da imagem final (QR Code + moldura opcional) e exportação.
// A pré-visualização e os dois formatos de exportação usam o mesmo SVG,
// por isso o que se vê é exatamente o que se descarrega.

import { readableTextColor } from './color.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const FONT_STACK = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Recebe o SVG gerado pela biblioteca e devolve o SVG final, com moldura se ativa.
 * @param {string} qrSvg  SVG do QR Code com largura layout.qrSize
 */
export function composeSvg(qrSvg, style, layout) {
  const doc = new DOMParser().parseFromString(qrSvg, 'image/svg+xml');
  const qr = doc.documentElement;
  if (!qr.hasAttribute('viewBox')) qr.setAttribute('viewBox', `0 0 ${layout.qrSize} ${layout.qrSize}`);

  if (!style.frameEnabled) {
    return new XMLSerializer().serializeToString(qr);
  }

  const { width, height, qrSize, border, captionHeight } = layout;
  qr.setAttribute('x', border);
  qr.setAttribute('y', border);
  qr.setAttribute('width', qrSize);
  qr.setAttribute('height', qrSize);
  const inner = new XMLSerializer().serializeToString(qr);

  let caption = '';
  const text = style.frameText.trim();
  if (text) {
    // Reduz a letra em textos longos para não sair da moldura.
    const fontSize = Math.min(captionHeight * 0.42, (width * 0.88) / (text.length * 0.6));
    caption = `<text x="${width / 2}" y="${border + qrSize + captionHeight / 2}" text-anchor="middle" dominant-baseline="central" font-family="${FONT_STACK}" font-size="${fontSize.toFixed(1)}" font-weight="600" fill="${readableTextColor(style.frameColor)}">${escapeXml(text)}</text>`;
  }

  return `<svg xmlns="${SVG_NS}" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" rx="${Math.round(width * 0.04)}" fill="${style.frameColor}"/>${inner}${caption}</svg>`;
}

export function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Converte o SVG em PNG desenhando-o num canvas, inteiramente no navegador.
export function svgToPngBlob(svg, width, height) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Falha ao criar o PNG.'))), 'image/png');
    };
    img.onerror = () => reject(new Error('Falha ao converter a imagem.'));
    img.src = svgToDataUrl(svg);
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  // Dá tempo ao navegador para iniciar a transferência antes de libertar o URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
