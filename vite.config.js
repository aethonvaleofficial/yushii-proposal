import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // Permit any HTTPS tunnel address created by ngrok's free domain.
    // Do not set `allowedHosts: true`, which would disable this protection.
    allowedHosts: [".ngrok-free.dev"],
  },
});
