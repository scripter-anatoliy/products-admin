import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Для gh-pages: при 404 сервер отдаёт 404.html — тогда загрузится SPA и роуты заработают при перезагрузке
function copyIndexTo404() {
  return {
    name: "copy-404",
    closeBundle() {
      const outDir = path.resolve(__dirname, "dist");
      const index = path.join(outDir, "index.html");
      const notFound = path.join(outDir, "404.html");
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, notFound);
        console.log("✓ 404.html created for gh-pages SPA routing");
      }
    },
  };
}

export default defineConfig({
  base: "/products-admin/", // имя репозитория на GitHub для gh-pages
  plugins: [react(), copyIndexTo404()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-antd": ["antd", "@ant-design/icons"],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
