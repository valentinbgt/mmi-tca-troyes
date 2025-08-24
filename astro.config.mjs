// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  base: "/mmi-tca-troyes",
  redirects: {
    "/": "/mmi-tca-troyes/s5",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
