import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3001,  // Use the port provided by Render or default to 3000
    strictPort: true,                // Fail if the port is already in use
    host: '0.0.0.0'                  // Bind to all IP addresses, allowing external access
  }
})
