import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://priyanarora.com",

  integrations: [
    react(),
    tailwind(),
    sitemap()
  ],

  output: "static",

  vite: {
    server: {
      allowedHosts: ["padding-prescribe-popsicle.ngrok-free.dev"],
    },
  },

  adapter: cloudflare()
});