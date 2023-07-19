import pkg from '../package.json'

const sharedManifest: Partial<chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3> = {
  icons: {
    '16': 'icons/16.png',
    '32': 'icons/32.png',
    '48': 'icons/48.png',
    '128': 'icons/128.png',
  },
  content_scripts: [
    {
      js: ['src/entries/contentScript/main.ts'],
      matches: ['https://www.google.com/search?*'],
    },
  ],
  permissions: ['storage'],
}

const browserAction = {
  default_icon: {
    '16': 'icons/16.png',
    '32': 'icons/32.png',
    '48': 'icons/48.png',
    '128': 'icons/128.png',
  },
  default_popup: 'src/entries/popup/index.html',
}

const localFirefoxManifest = {
  applications: {
    gecko: {
      id: 'yuki-ycino@gmail.com',
    },
  },
}

const manifestV2 = {
  ...sharedManifest,
  browser_action: browserAction,
  permissions: [...(sharedManifest.permissions as Array<string>), '*://*/*'],
}

const manifestV3 = {
  ...sharedManifest,
  action: browserAction,
  host_permissions: ['*://*/*'],
}

export function getManifest(version: 2 | 3): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  const manifest = {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
  }

  if (version === 2) {
    return {
      ...manifest,
      ...manifestV2,
      manifest_version: version,
      ...(process.env.BROWSER === 'FIREFOX_LOCAL' ? localFirefoxManifest : {}),
    } as chrome.runtime.ManifestV2
  }

  if (version === 3) {
    return {
      ...manifest,
      ...manifestV3,
      manifest_version: version,
    } as chrome.runtime.ManifestV3
  }

  throw new Error('Invalid manifest version')
}
