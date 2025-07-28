import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'pages': '/src/pages',
      'api': '/src/api',
      'constants': '/src/constants',
      'contexts': '/src/contexts',
      'functions': '/src/functions',
    },
  },
})
