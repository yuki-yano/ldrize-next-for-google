import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from '@samrum/vite-plugin-web-extension'
import EnvironmentPlugin from 'vite-plugin-environment'
import zipPack from 'vite-plugin-zip-pack'
import path from 'path'
import { getManifest } from './src/manifest'

export default defineConfig(() => {
  const browser = process.env.BROWSER as 'CHROME' | 'FIREFOX' | 'FIREFOX_LOCAL'
  const manifestVersion = browser === 'CHROME' ? 3 : 2

  return {
    plugins: [
      react(),
      webExtension({
        manifest: getManifest(manifestVersion),
      }),
      EnvironmentPlugin(['BROWSER']),
      zipPack({
        outDir: 'extensions',
        outFileName: `${browser.toLowerCase()}-ldrize-next-for-google.zip`,
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  }
})
