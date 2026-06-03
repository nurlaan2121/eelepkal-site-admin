// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://admin.eelepkal.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
