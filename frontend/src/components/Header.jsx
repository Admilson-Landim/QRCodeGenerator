import { QrCode } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <QrCode size={28} aria-hidden="true" />
        <h1>QR Studio</h1>
      </div>
      <p className="header__tagline">Cria, personaliza e descarrega QR Codes gratuitamente.</p>
      <p className="header__privacy">Sem registo. Tudo é gerado no teu navegador; nada do que escreves é enviado.</p>
    </header>
  );
}
