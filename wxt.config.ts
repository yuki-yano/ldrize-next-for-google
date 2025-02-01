import { defineConfig } from 'wxt'

// NOTE: This is a workaround because content_scripts are not properly set up when using the dev server
const content_scripts =
  process.env.NODE_ENV === 'development'
    ? [
        {
          matches: ['*://*.google.com/*', '*://*.google.co.jp/*', '*://kagi.com/*', '*://*.kagi.com/*'],
          js: ['content-scripts/content.js'],
          run_at: 'document_end' as const,
        },
      ]
    : []

export default defineConfig({
  manifest: {
    name: 'Ldrize Next for Search Engine',
    permissions: ['storage'],
    content_scripts: content_scripts,
  },
  srcDir: 'src',
})
