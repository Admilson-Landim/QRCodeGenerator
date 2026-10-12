import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { composeSvg } from '../lib/compose.js';
import { getLayout, toQrCodeStylingOptions } from '../lib/qrStyle.js';

function toErrorMessage(error) {
  // A biblioteca lança uma string (não um Error) quando o conteúdo não cabe.
  if (String(error?.message ?? error).includes('code length overflow')) {
    return 'O conteúdo é demasiado longo para caber num QR Code. Reduz o texto.';
  }
  return 'Não foi possível gerar o QR Code. Tenta novamente.';
}

/**
 * Gera o SVG final a partir dos dados e das opções visuais.
 * Usa uma única instância de QRCodeStyling durante toda a vida do componente
 * e apenas chama update() quando os dados ou o estilo mudam.
 *
 * @returns {{ status: 'idle'|'loading'|'ready'|'error', svg: string|null, width: number, height: number, error: string|null }}
 */
export function useQRCode(data, style) {
  const qrRef = useRef(null);
  // Guarda também os dados/estilo que originaram o resultado, para sabermos se está atualizado.
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!data) return;

    // Ignora resultados de gerações anteriores que terminem depois desta.
    let cancelled = false;

    async function generate() {
      try {
        qrRef.current ??= new QRCodeStyling({ type: 'svg' });
        const layout = getLayout(style);
        qrRef.current.update(toQrCodeStylingOptions(data, style, layout.qrSize));
        const blob = await qrRef.current.getRawData('svg');
        const svg = composeSvg(await blob.text(), style, layout);
        if (!cancelled) setResult({ data, style, svg, width: layout.width, height: layout.height, error: null });
      } catch (error) {
        if (!cancelled) setResult({ data, style, svg: null, width: 0, height: 0, error: toErrorMessage(error) });
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [data, style]);

  if (!data) return { status: 'idle', svg: null, width: 0, height: 0, error: null };

  const isCurrent = result && result.data === data && result.style === style;
  if (!isCurrent) {
    // Enquanto gera, mantém a imagem anterior visível (se existir).
    return { status: 'loading', svg: result?.svg ?? null, width: result?.width ?? 0, height: result?.height ?? 0, error: null };
  }
  return { status: result.error ? 'error' : 'ready', svg: result.svg, width: result.width, height: result.height, error: result.error };
}
