import type { SiteConfig } from './types';

export function globToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const withWildcards = escaped.replace(/\*/g, '.*');
  return new RegExp(`^${withWildcards}$`);
}

export function matchSite(url: string, sites: SiteConfig[]): SiteConfig | null {
  for (const site of sites) {
    if (!site.enabled) continue;
    try {
      if (globToRegex(site.urlPattern).test(url)) return site;
    } catch {
      continue;
    }
  }
  return null;
}
