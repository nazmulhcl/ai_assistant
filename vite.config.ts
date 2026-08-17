import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const aiForceEndpoint = new URL(
    env.AIFORCE_URL || "https://aiforce.hcltech.com/aes/usecases/execute",
  );

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      proxy: {
        "/api/aiforce": {
          target: aiForceEndpoint.origin,
          changeOrigin: true,
          secure: true,
          rewrite: () => `${aiForceEndpoint.pathname}${aiForceEndpoint.search}`,
          headers: env.AIFORCE_TOKEN
            ? { Authorization: `Bearer ${env.AIFORCE_TOKEN}` }
            : undefined,
        },
      },
    },
  };
});
