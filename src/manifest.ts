import pkg from "../package.json";

const sharedManifest: Partial<chrome.runtime.ManifestBase> = {
  icons: {
    "16": "icons/16.png",
    "32": "icons/32.png",
    "48": "icons/48.png",
    "128": "icons/128.png",
  },
  content_scripts: [
    {
      js: ["src/entries/contentScript/main.ts"],
      matches: ["https://www.google.com/search?*"],
    },
  ],
};

const localFirefoxManifest = {
  applications: {
    gecko: {
      id: "yuki-ycino@gmail.com",
    },
  },
};
export function getManifest(
  version: 2 | 3
): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  return {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
    manifest_version: version,
    ...sharedManifest,
    ...(process.env.BROWSER === "FIREFOX_LOCAL" ? localFirefoxManifest : {}),
  } as chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3;
}
