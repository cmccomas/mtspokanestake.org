import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.mtspokanestake.org",
  redirects: {
    "/ysa-ward-conference": "/ysa",
  },
});
