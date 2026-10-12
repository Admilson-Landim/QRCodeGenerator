import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // No GitHub Pages o site fica em https://<utilizador>.github.io/QRCodeGenerator/
  base: command === 'build' ? '/QRCodeGenerator/' : '/',
}))
