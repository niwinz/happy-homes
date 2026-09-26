import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://happyhomes.example",
  server: {
    host: "0.0.0.0",
    port: 11001,
  },
});
