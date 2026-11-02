import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// Astro does not route folders that start with "_", so the scratch page is injected.
// Remove this integration together with src/pages/_dev/ before launch.
const devScratchPage = {
  name: "dev-scratch-page",
  hooks: {
    "astro:config:setup": ({ injectRoute }) => {
      injectRoute({ pattern: "/_dev", entrypoint: "./src/pages/_dev/index.astro" });
    },
  },
};

export default defineConfig({
  site: "https://www.healthcareconsultants417.com",
  output: "static",
  adapter: vercel(),
  trailingSlash: "always",
  build: {
    inlineStylesheets: "always",
  },
  integrations: [devScratchPage],
  vite: {
    plugins: [tailwindcss()],
  },
});
