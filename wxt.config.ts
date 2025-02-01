import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: 'Ldrize Next for Search Engine',
    permissions: ['storage'],
    // NOTE: This is a workaround because content_scripts are not properly set up when using the dev server
    content_scripts: [
      {
        matches: ['*://*.google.com/*', '*://*.google.co.jp/*', '*://kagi.com/*', '*://*.kagi.com/*'],
        js: ['content-scripts/content.js'],
        run_at: 'document_end',
      },
    ],
  },
  srcDir: 'src',
})
