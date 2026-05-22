import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'Better Manhwa Reader',
    description: 'Clamp manhwa reader pages to mobile width on desktop.',
    permissions: ['storage'],
    host_permissions: ['https://*/*'],
    action: { default_title: 'Better Manhwa Reader' },
  },
});
