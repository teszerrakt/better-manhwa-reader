import { browser } from 'wxt/browser';

export function originFromUrlPattern(pattern: string): string | null {
  try {
    const concrete = pattern.replace(/^\*:\/\//, 'https://').replace(/\*/g, 'x');
    return new URL(concrete).origin;
  } catch {
    return null;
  }
}

const CACHE_BUST = Date.now().toString(36);

export function faviconUrl(origin: string, size = 32): string {
  const getURL = browser.runtime.getURL as (path: string) => string;
  const url = new URL(getURL('/_favicon/'));
  url.searchParams.set('pageUrl', origin);
  url.searchParams.set('size', String(size));
  url.searchParams.set('_', CACHE_BUST);
  return url.toString();
}

export function initialFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed[0]!.toUpperCase();
}
