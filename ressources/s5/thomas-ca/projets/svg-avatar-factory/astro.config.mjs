// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  base: "/mmi-tca-troyes/s5/thomas-ca/projets/svg-avatar-factory/",
  integrations: [react()],
});
