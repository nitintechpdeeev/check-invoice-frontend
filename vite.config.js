import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from external networks
    port: 5173, // Change if needed
    strictPort: true, // Ensures the port does not change
    hmr: {
      clientPort: 443, // Needed for Ngrok
      host: 'e321-115-246-60-212.ngrok-free.app',
    },
    cors: true, // Allow cross-origin requests if needed
  }
})