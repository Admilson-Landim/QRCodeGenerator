import { useEffect, useState } from 'react';

// Devolve o valor apenas depois de deixar de mudar durante `delay` ms.
// Evita regenerar o QR Code a cada tecla ou a cada movimento do seletor de cor.
export function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
