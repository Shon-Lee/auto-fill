import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName =
  process.env.VITE_BASE_PATH ||
  process.env.GITHUB_REPOSITORY?.split("/")[1] ||
  "land-doc-tool";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "serve" ? "/" : `/${repoName}/`
}));
