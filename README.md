# QR Studio

Ferramenta web gratuita para criar, personalizar e descarregar QR Codes. Tudo é gerado no navegador; nenhum dado é enviado para servidores.

**Experimenta online:** https://admilson-landim.github.io/QRCodeGenerator/

O site é publicado automaticamente no GitHub Pages a cada push para `main` (ver `.github/workflows/deploy.yml`).

```
frontend/   Aplicação React + Vite
backend/    (vazio — reservado para uma versão futura)
```

## Executar

```bash
cd frontend
npm install
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
npm test         # testes unitários (Vitest)
npm run lint     # oxlint
npm run build    # build de produção em frontend/dist
```
