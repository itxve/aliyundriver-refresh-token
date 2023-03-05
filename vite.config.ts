import { defineConfig } from "vite";
export const SPORT = process.env.SPORT;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    proxy: {
      "/api": {
        target: `http://localhost:${SPORT}/`,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    minify: true,
  },
});
