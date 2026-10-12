import { useId } from 'react';

// Secção com título e uma ação opcional no canto (ex.: botão "Limpar").
export default function Panel({ title, action, children }) {
  const headingId = useId();
  return (
    <section className="panel" aria-labelledby={headingId}>
      <div className="panel__header">
        <h2 id={headingId}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
