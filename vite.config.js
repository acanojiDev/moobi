import { defineConfig } from 'vite';

// Rutas relativas: funciona en usuario.github.io/repo/ y en un dominio propio.
export default defineConfig({ base: './' });
