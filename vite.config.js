import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/login": "http://localhost:9000",
      "/students": "http://localhost:9000",
      "/teachers": "http://localhost:9000",
      "/choice": "http://localhost:9000",
      "/dashboard": "http://localhost:9000",
    },
  },
});
