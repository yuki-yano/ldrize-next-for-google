import { defineConfig } from "vite";
import webExtension from "@samrum/vite-plugin-web-extension";
import path from "path";
import { getManifest } from "./src/manifest";

export default defineConfig(() => {
  const env = process.env.ENV as "CHROME" | "FIREFOX";
  const manifestVersion = env === "CHROME" ? 3 : 2;

  return {
    plugins: [
      webExtension({
        manifest: getManifest(manifestVersion),
      }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  };
});
