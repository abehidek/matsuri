import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envp from 'vite-plugin-environment'
import generouted from '@generouted/react-router'

//@ts-ignore
import { env } from '../../packages/env/index';

// https://vitejs.dev/config/
export default defineConfig({
  //@ts-ignore
  plugins: [react(), generouted(), envp(env, {
    loadEnvFiles: false
  })],
  server: {
    host: true,
    port: 3000,
    strictPort: true
  }
})
