import { browser } from 'wxt/browser';
import { DEFAULT_SITES } from './defaults';
import type { SiteConfig } from './types';

const KEY = 'sites';
const LAST_SELECTED_KEY = 'lastSelectedId';

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

export async function loadLastSelected(): Promise<string | undefined> {
  const raw = await browser.storage.sync.get(LAST_SELECTED_KEY);
  const v = raw[LAST_SELECTED_KEY];
  return typeof v === 'string' ? v : undefined;
}

export async function saveLastSelected(id: string): Promise<void> {
  await browser.storage.sync.set({ [LAST_SELECTED_KEY]: id });
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
