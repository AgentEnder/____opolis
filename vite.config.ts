import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Don't add Vike's Vite plugin when running Vitest
    !process.env.VITEST && vike(),
    react(),
    tailwindcss(),
  ],
  build: {
    target: "es2022",
  },
  base: process.env.CI ? "/____opolis/" : "/",
});
