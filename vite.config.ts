import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    minify: true,
  },
});
