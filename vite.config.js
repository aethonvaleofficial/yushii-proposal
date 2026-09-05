import { defineConfig } from "vite";

// Relative asset URLs keep the production build working when opened directly
// from the computer (file://), as well as when it is deployed to a subfolder.
export default defineConfig({
  base: "./",
  server: {
    // Permit any HTTPS tunnel address created by ngrok's free domain.
    // Do not set `allowedHosts: true`, which would disable this protection.
    allowedHosts: [".ngrok-free.dev"],
  },
  build: {
    rollupOptions: {
      input: { index: "src/index.html" },
    },
  },
});
