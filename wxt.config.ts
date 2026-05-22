import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Better Manhwa Reader',
    description: 'Clamp manhwa reader pages to mobile width on desktop.',
    permissions: ['storage', 'favicon'],
    host_permissions: ['https://*/*'],
    action: { default_title: 'Better Manhwa Reader' },
    web_accessible_resources: [
      {
        resources: ['_favicon/*'],
        matches: ['<all_urls>'],
        extension_ids: [],
      },
    ],
  },
});
