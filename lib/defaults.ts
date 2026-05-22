import type { SiteConfig } from './types';

export const DEFAULT_SITES: SiteConfig[] = [
  {
    id: 'asurascans',
    name: 'AsuraScans',
    urlPattern: 'https://asurascans.com/comics/*/chapter/*',
    selector: 'main',
    width: 480,
    enabled: true,
    builtin: true,
  },
  {
    id: 'flamecomics',
    name: 'FlameComics',
    urlPattern: 'https://flamecomics.xyz/series/*/*',
    selector: 'main',
    width: 480,
    enabled: true,
    builtin: true,
  },
];
