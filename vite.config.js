import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Rutas relativas: funciona en usuario.github.io/repo/ y en un dominio propio.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        carta: resolve('carta.html'),
      },
    },
  },
});
