import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    sourcemap: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\/](react|react-dom|react-router|scheduler)[\/]/ },
            { name: 'motion', test: /node_modules[\/](gsap|@gsap|lenis|framer-motion|motion-dom|motion-utils)[\/]/ },
          ],
        },
      },
    },
  },
})
