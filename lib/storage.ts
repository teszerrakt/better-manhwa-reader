import { browser } from 'wxt/browser';
import { DEFAULT_SITES } from './defaults';
import type { SiteConfig } from './types';

const KEY = 'sites';

function isSiteArray(v: unknown): v is SiteConfig[] {
  return Array.isArray(v) && v.every((s) => s && typeof s === 'object' && 'id' in s);
}

export async function loadSites(): Promise<SiteConfig[]> {
  const raw = await browser.storage.sync.get(KEY);
  const stored = raw[KEY];
  if (!isSiteArray(stored) || stored.length === 0) {
    const fresh = DEFAULT_SITES.map((s) => ({ ...s }));
    await browser.storage.sync.set({ [KEY]: fresh });
    return fresh;
  }
  return stored;
}

export async function saveSites(sites: SiteConfig[]): Promise<void> {
  await browser.storage.sync.set({ [KEY]: sites });
}

export async function resetDefaults(): Promise<SiteConfig[]> {
  const fresh = DEFAULT_SITES.map((s) => ({ ...s }));
  await browser.storage.sync.set({ [KEY]: fresh });
  return fresh;
}

export function onSitesChanged(cb: (sites: SiteConfig[]) => void): () => void {
  const listener = (
    changes: Record<string, { oldValue?: unknown; newValue?: unknown }>,
    area: string,
  ) => {
    if (area !== 'sync' || !changes[KEY]) return;
    const next = changes[KEY].newValue;
    if (isSiteArray(next)) cb(next);
  };
  browser.storage.onChanged.addListener(listener);
  return () => browser.storage.onChanged.removeListener(listener);
}
