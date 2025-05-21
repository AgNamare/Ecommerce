import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/admin/',  // change to '/admin/' or '/app/' based on your use case
  build: {
    outDir: '../public/app',
    emptyOutDir: true
  },
});
