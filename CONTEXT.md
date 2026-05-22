# Better Manhwa Reader

Chrome MV3 extension that clamps manhwa reader pages to a configurable width on desktop.

## Language

**Site**:
A configured target for width clamping. Has a URL pattern, a CSS selector, a width, an enabled flag, and a built-in flag.
_Avoid_: Page, target, entry

**URL pattern**:
A glob-style match string (e.g. `https://asurascans.com/comics/*/chapter/*`) that decides whether a Site applies to the current page. Also the source for deriving the Site's origin (used for favicon lookup).
_Avoid_: URL, pattern, match string, glob

**Selector**:
A CSS selector that picks the content element to clamp on a matched page.
_Avoid_: Query, element selector

**Width**:
Max pixel width applied to the selected element via injected CSS.
_Avoid_: Size, clamp value

**Built-in site**:
A Site that ships with the extension. Cannot be deleted, can be disabled or edited.
_Avoid_: Default site, preset site

**Custom site**:
A Site added by the user at runtime. Deletable.
_Avoid_: User site, added site

**Favicon**:
The icon shown on a Site's sidebar tab. Sourced from Chrome's `_favicon/` API using the origin derived from the Site's URL pattern. For sites not in Chrome's history, the API returns its own generic placeholder — we accept that as the visible state (no further fallback).
_Avoid_: Icon, logo, site image

**Sidebar tab**:
The vertical tab strip on the left of the popup, one entry per Site plus an `+` button at the bottom for adding a Custom site.
_Avoid_: Site list, nav

**Last selected**:
The `id` of the most recently active sidebar tab, persisted in storage so the popup re-opens on the same Site.
_Avoid_: Current site, active site

## Example dialogue

> **Dev:** When I open the popup and click AsuraScans, what am I editing?
> **Domain:** The AsuraScans **Site** — its URL pattern, selector, width, enabled flag.
> **Dev:** And the icon next to "AsuraScans" in the sidebar?
> **Domain:** The **favicon**, looked up from Chrome's cache using the origin derived from its URL pattern. If Chrome doesn't have it, you get a letter avatar instead.
> **Dev:** Can I delete it?
> **Domain:** No — it's a **built-in site**. You can disable it. Only **custom sites** are deletable.
> **Dev:** What does "+" do?
> **Domain:** Opens the add form in the panel. Submit creates a new **custom site** and the **sidebar tab** auto-switches to it.
