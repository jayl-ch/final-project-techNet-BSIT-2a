import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const apiTarget = env.SERVER_LOCAL;

  return {
    plugins: [
      react(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.js",
        registerType: "prompt",
        injectRegister: "none",
        includeAssets: ["favicon.svg", "offline.html"],
        manifest: {
          name: "TaskWise - Smart Task Management",
          short_name: "TaskWise",
          description: "Plan, prioritize, and track tasks with TaskWise.",
          theme_color: "#4F46E5",
          background_color: "#0f172a",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any",
            },
            {
              src: "/favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "maskable",
            },
          ],
        },
        injectManifest: {
          globPatterns: [
            "**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,json,woff2}",
          ],
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
