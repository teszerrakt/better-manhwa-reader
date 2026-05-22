import { buildCss } from '@/lib/cssBuilder';
import { matchSite } from '@/lib/matcher';
import { loadSites, onSitesChanged } from '@/lib/storage';
import type { SiteConfig } from '@/lib/types';

export default defineContentScript({
  matches: ['https://*/*'],
  runAt: 'document_start',
  async main() {
    const STYLE_ID = 'bmr-style';

    function applyStyle(site: SiteConfig | null) {
      let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
      if (!site) {
        style?.remove();
        return;
      }
      if (!style) {
        style = document.createElement('style');
        style.id = STYLE_ID;
        (document.head ?? document.documentElement).appendChild(style);
      }
      style.textContent = buildCss(site);
    }

    const sites = await loadSites();
    applyStyle(matchSite(location.href, sites));

    onSitesChanged((next) => {
      applyStyle(matchSite(location.href, next));
    });
  },
});
