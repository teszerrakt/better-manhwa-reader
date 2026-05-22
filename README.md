# Better Manhwa Reader

Chrome (MV3) extension that clamps manhwa reader pages to a comfortable
mobile-ish width on desktop, so you stop having to fake an iPhone in DevTools
every time you want to read a chapter.

Built with [WXT](https://wxt.dev), Vue 3, Tailwind, and
[shadcn-vue](https://www.shadcn-vue.com/).

## Features

- Per-site rules: URL pattern, CSS selector, target width, on/off.
- Live updates: change the width slider, the open tab reacts immediately —
  no reload.
- Built-in preset for AsuraScans. Add Flamescans, Reaperscans, etc. at
  runtime from the popup.
- Config persisted via `chrome.storage.sync` (rides along with your Chrome
  profile).

## Develop

Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev       # launches a Chrome dev instance with the extension loaded
bun run compile   # vue-tsc typecheck
bun run build     # production build to .output/chrome-mv3/
```

## Load in regular Chrome

```sh
bun run build
```

Then `chrome://extensions` → enable Developer mode → **Load unpacked** →
select `.output/chrome-mv3/`.

## Adding a site

Click the extension icon → **Add site**. Fill:

- **Name** — display label.
- **URL pattern** — glob, e.g. `https://flamescans.org/*/chapter/*`. `*`
  matches any characters including `/`.
- **CSS selector** — element to clamp. `main` works for most readers; fall
  back to inspecting the page if not.
- **Width** — px (default 480).

## Layout

```
entrypoints/
  popup/        Vue popup app
  content.ts    content script — reads storage, injects <style>
components/     UI: SiteCard, AddSiteForm + shadcn-vue primitives
lib/            types, defaults, matcher, cssBuilder, storage
```
