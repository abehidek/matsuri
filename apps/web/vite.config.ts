import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envp from "vite-plugin-environment";

//@ts-ignore: vite tsconfig rootDir error, but it works perfectly
import { env } from "../../packages/env/index";

// https://vitejs.dev/config/
export default defineConfig({
  //@ts-ignore: ignore env type errors (because there are some number environment variables)
  plugins: [
    react(),
    envp(env, {
      loadEnvFiles: false,
    }),
  ],
  server: {
    host: true,
    port: env.PUBLIC_WEB_PORT,
    strictPort: true,
  },
});
