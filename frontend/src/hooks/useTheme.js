import { useEffect, useState } from 'react';

const STORAGE_KEY = 'qr-studio-theme';

// Tema guardado pelo utilizador ou, na falta dele, o tema do sistema.
// O index.html aplica o mesmo valor antes de o React arrancar, para evitar um "flash".
function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage indisponível (ex.: navegação privada): usa o tema do sistema.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sem persistência: o tema volta ao do sistema na próxima visita.
    }
  }

  return { theme, toggleTheme };
}
