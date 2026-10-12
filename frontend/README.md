# QR Studio — frontend

React 19 + Vite, JavaScript. Ver o README na raiz para os comandos.

```
src/
  App.jsx                  Estado da aplicação e composição das secções
  components/              Componentes de interface (sem lógica de negócio)
  hooks/
    useQRCode.js           Instância única de qr-code-styling → SVG final
    useDebouncedValue.js   Evita regenerar a cada tecla
  lib/                     Lógica pura, testável sem React
    contentTypes.js        Campos, validação e payload de cada tipo
    payloads.js            Formatos WIFI:, mailto:, tel:, SMSTO:, vCard
    validation.js          Validação/normalização de URL, e-mail, telefone
    qrStyle.js             Opções visuais, layout e conversão UTF-8
    compose.js             Moldura, SVG→PNG e transferência
    color.js               Contraste WCAG, avisos e combinações predefinidas
```
