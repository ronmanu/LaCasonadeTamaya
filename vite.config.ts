import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base: "./"' permite que la web funcione tanto en un dominio raíz (ej. casonatamaya.com)
  // como en una subcarpeta, asegurando que las imágenes y estilos carguen bien.
  base: './', 
})