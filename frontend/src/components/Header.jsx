import { Moon, QrCode, ShieldCheck, Sun } from 'lucide-react';

export default function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <span className="header__logo" aria-hidden="true">
            <QrCode size={26} />
          </span>
          <div>
            <h1>QR Studio</h1>
            <p className="header__tagline">Cria, personaliza e descarrega QR Codes gratuitamente.</p>
          </div>
        </div>

        <div className="header__actions">
          <p className="header__badge" title="Nada do que escreves é enviado para servidores.">
            <ShieldCheck size={16} aria-hidden="true" />
            Sem registo · 100% no navegador
          </p>
          <button
            type="button"
            className="icon-button icon-button--round"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={isDark ? 'Modo claro' : 'Modo escuro'}
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
