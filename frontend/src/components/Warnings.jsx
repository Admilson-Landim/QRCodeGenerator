import { Info, TriangleAlert } from 'lucide-react';

// Lista de avisos ({ level: 'error' | 'warning' | 'info', message }).
// O contentor existe sempre para que os leitores de ecrã anunciem avisos novos.
export default function Warnings({ items }) {
  return (
    <div aria-live="polite">
      {items.length > 0 && (
        <ul className="warnings">
          {items.map((item) => (
            <li key={item.message} className={`warning warning--${item.level}`}>
              {item.level === 'info' ? <Info size={16} aria-hidden="true" /> : <TriangleAlert size={16} aria-hidden="true" />}
              <span>{item.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
