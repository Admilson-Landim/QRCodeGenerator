import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Panel from './components/Panel.jsx';
import ContentTypeSelector from './components/ContentTypeSelector.jsx';
import ContentForm from './components/ContentForm.jsx';
import CustomizationPanel from './components/CustomizationPanel.jsx';
import QRCodePreview from './components/QRCodePreview.jsx';
import ExportControls from './components/ExportControls.jsx';
import { useDebouncedValue } from './hooks/useDebouncedValue.js';
import { useQRCode } from './hooks/useQRCode.js';
import { buildPayload, getAllInitialValues, getContentType, getInitialValues } from './lib/contentTypes.js';
import { getColorWarnings } from './lib/color.js';
import { DEFAULT_STYLE } from './lib/qrStyle.js';
import { Eraser, RotateCcw } from 'lucide-react';

export default function App() {
  const [typeId, setTypeId] = useState('url');
  // Guardamos os valores de todos os tipos para não se perderem ao trocar de separador.
  const [values, setValues] = useState(getAllInitialValues);
  const [touched, setTouched] = useState({});
  const [style, setStyle] = useState(DEFAULT_STYLE);

  const currentValues = values[typeId];
  const payload = useMemo(() => buildPayload(typeId, currentValues), [typeId, currentValues]);
  const colorWarnings = useMemo(() => getColorWarnings(style), [style]);

  const debouncedData = useDebouncedValue(payload.data, 250);
  const debouncedStyle = useDebouncedValue(style, 150);
  const qr = useQRCode(debouncedData, debouncedStyle);
  const isPending = payload.data !== debouncedData || style !== debouncedStyle || qr.status === 'loading';

  function handleFieldChange(name, value) {
    setValues((prev) => ({ ...prev, [typeId]: { ...prev[typeId], [name]: value } }));
  }

  function handleFieldBlur(name) {
    setTouched((prev) => ({ ...prev, [typeId]: { ...prev[typeId], [name]: true } }));
  }

  function handleClearForm() {
    setValues((prev) => ({ ...prev, [typeId]: getInitialValues(typeId) }));
    setTouched((prev) => ({ ...prev, [typeId]: {} }));
  }

  function handleStyleChange(changes) {
    setStyle((prev) => ({ ...prev, ...changes }));
  }

  return (
    <div className="app">
      <Header />

      <main className="layout">
        <div className="layout__config">
          <Panel
            title="1. Conteúdo"
            action={
              <button type="button" className="button button--ghost" onClick={handleClearForm}>
                <Eraser size={16} aria-hidden="true" /> Limpar
              </button>
            }
          >
            <ContentTypeSelector value={typeId} onChange={setTypeId} />
            <ContentForm
              key={typeId}
              type={getContentType(typeId)}
              values={currentValues}
              errors={payload.errors}
              touched={touched[typeId] ?? {}}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
            />
          </Panel>

          <Panel
            title="2. Aparência"
            action={
              <button type="button" className="button button--ghost" onClick={() => setStyle(DEFAULT_STYLE)}>
                <RotateCcw size={16} aria-hidden="true" /> Repor predefinições
              </button>
            }
          >
            <CustomizationPanel style={style} onChange={handleStyleChange} warnings={colorWarnings} />
          </Panel>
        </div>

        <aside className="layout__preview" aria-label="Pré-visualização e exportação">
          <Panel title="3. Pré-visualização">
            <QRCodePreview payloadStatus={payload.status} qr={qr} isPending={isPending} warnings={colorWarnings} />
            <ExportControls
              qr={qr}
              disabled={payload.status !== 'valid' || qr.status !== 'ready' || isPending}
              fileName={`qr-studio-${typeId}`}
              style={style}
            />
          </Panel>
        </aside>
      </main>
    </div>
  );
}
