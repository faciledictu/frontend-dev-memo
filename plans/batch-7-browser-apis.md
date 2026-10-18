# Batch 7: Web Platform, browser APIs

Status: approved by the user. Five new pages: four in
`docs/web-platform/browser/`, one in `docs/web-platform/network/`.

## Decisions

- The three observers go on one page; Web Components and Shadow DOM on one page.
- New pages are inserted between existing ones with renumbering (not appended).
- The Navigation API is a section with a snippet inside the History page; the
  main example stays on `pushState` / `popstate`.
- Page (a) keeps the ROADMAP title "requestAnimationFrame and
  requestIdleCallback"; `scheduler.yield()` and `postTask` go into its
  comparison table.
- No page for `structuredClone` (covered in `javascript/objects.md` and
  `browser/web-workers.md`); links only.
- View Transitions, Page Visibility and bfcache, BroadcastChannel, Clipboard API
  are out of this batch.

## Feature status (web-features 3.43.0, October 2026; re-verify)

| Feature                                                                                                          | Status                                                                       |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Intersection / Resize / Mutation Observer                                                                        | Widely available                                                             |
| IntersectionObserver v2 (`trackVisibility`)                                                                      | Chromium only                                                                |
| History API                                                                                                      | Widely available                                                             |
| Navigation API                                                                                                   | Newly available (January 2026); precommit handlers Chromium and Firefox only |
| Shadow DOM, custom elements, `<template>`, `<slot>`, `::part`, constructed stylesheets, form-associated elements | Widely available                                                             |
| Declarative Shadow DOM                                                                                           | Widely available since August 2026                                           |
| Customized built-ins (`is="…"`)                                                                                  | Not in Safari                                                                |
| Scoped custom element registries                                                                                 | Chrome / Edge 146, Safari 26; not Firefox; not Baseline                      |
| `requestAnimationFrame`                                                                                          | Widely available                                                             |
| `requestIdleCallback`                                                                                            | No Safari; not Baseline                                                      |
| `scheduler.yield()`, `scheduler.postTask()`                                                                      | No Safari; not Baseline                                                      |
| `URL.parse()`                                                                                                    | Newly available (September 2024)                                             |
| `URL.canParse()`                                                                                                 | Widely available                                                             |
| `URLPattern`                                                                                                     | Newly available (September 2025)                                             |

## Pages

1. `browser/scheduling.md`, "requestAnimationFrame and requestIdleCallback",
   `[middle, senior]`, position 3. Answers: when each callback runs relative to
   a frame, and which one fits animation, background work or splitting a long
   task. Includes: frame timeline (task → microtasks → rAF → style / layout →
   ResizeObserver → paint → idle); table of `setTimeout(0)` / rAF / rIC /
   `scheduler.yield()` / `scheduler.postTask()`; rAF timestamp,
   `cancelAnimationFrame`, pausing in background tabs, double-rAF, preferring
   CSS or `element.animate()`; rIC `deadline.timeRemaining()` (≤ 50 ms),
   `timeout`, `setTimeout` fallback; `scheduler.yield()` continuation runs ahead
   of other tasks, unlike `setTimeout` with its 4 ms clamp. Example: a rAF loop
   and an rIC queue with a fallback.
2. `browser/observers.md`, "Intersection, Resize and Mutation Observers",
   `[middle]`, position 4. Answers: how to react to visibility, size or DOM
   changes without `scroll` / `resize` handlers or polling. Includes: shared
   pattern (`observe` / `unobserve` / `disconnect`, batched entries); table of
   the three (what each watches, options, when the callback runs: Intersection
   via a task, Resize after layout and before paint, Mutation as a microtask;
   uses); Intersection `root` / `rootMargin` / `threshold` (lazy loading,
   infinite scroll, impressions; `loading="lazy"` is enough for images); Resize
   `contentRect` vs `borderBoxSize` and the "ResizeObserver loop" error;
   Mutation options, `oldValue`, `takeRecords()`, Mutation Events removed;
   PerformanceObserver follows the same pattern (one line). Example: an
   infinite-scroll sentinel.
3. `browser/history-api.md`, "History API", `[junior, middle]`, position 5.
   Answers: how an SPA changes the URL without a reload and learns about back /
   forward. Includes: `pushState` / `replaceState` (same-origin, no request, no
   `popstate`); `popstate` only on traversal; `history.state` is a structured
   clone; `scrollRestoration`; `hashchange` and hash vs history routing;
   Navigation API section (`navigate` event, `event.intercept()`,
   `navigation.entries()`). Example: a minimal router (link delegation +
   `pushState` + `popstate`) and a short Navigation API snippet.
4. `browser/web-components.md`, "Web Components and Shadow DOM",
   `[middle, senior]`, position 6. Answers: what Web Components are, what Shadow
   DOM isolates and what gets through, how they work with frameworks. Includes:
   custom elements, Shadow DOM, `<template>` / `<slot>`; hyphenated names,
   lifecycle callbacks, `observedAttributes`, autonomous vs customized
   built-ins; `attachShadow` open vs closed; what crosses the boundary
   (inherited properties and custom properties do, page selectors do not;
   `:host`, `::slotted`, `::part`, `adoptedStyleSheets`); Declarative Shadow DOM
   for SSR; forms via `ElementInternals`; ARIA ID references do not cross the
   boundary; scoped registries in one line. Example: a counter element with a
   shadow root, a slot and an attribute.
5. `network/url.md`, "URL and Encoding", `[junior, middle]`, network position 2.
   Answers: the parts of a URL, how to build and parse one safely, `encodeURI`
   vs `encodeURIComponent`. Includes: parts table (`protocol`, `host` /
   `hostname` / `port`, `pathname`, `search`, `hash`, `origin`; the hash is not
   sent); `new URL(input, base)` throws, `URL.canParse()` / `URL.parse()`;
   `URLSearchParams`; percent-encoding (UTF-8 bytes), table of `encodeURI` /
   `encodeURIComponent` / `URLSearchParams` (space as `+` vs `%20`), `escape`
   deprecated; `decodeURIComponent` throws `URIError`, double encoding,
   punycode; `URLPattern` in 1–2 lines. Example: a query built by concatenation
   breaks on `&`, `URLSearchParams` does not.

Renumbering: `browser/web-workers.md` 3 → 7, `browser/service-workers.md` 4 → 8;
`network/cors.md` 2 → 3, `storage.md` 3 → 4, `authentication.md` 4 → 5,
`realtime.md` 5 → 6. Update `browser/_category_.json` and
`network/_category_.json` descriptions.

## Links instead of repeats

- Scheduling: tasks and microtasks → `javascript/event-loop.md`; render pipeline
  → `browser-workflow.md`; the `yieldToMain` INP example stays in
  `performance/web-vitals.md`; rAF as a throttle →
  `javascript/debounce-throttle.md`; workers → `web-workers.md`; React's
  scheduler → `react/rendering/concurrent-rendering.md`.
- Observers: `loading="lazy"` → `performance/loading-performance.md`; React
  ResizeObserver callback ref → `react/hooks/refs.md`.
- History: React Router, server fallback, `HashRouter` →
  `react/ecosystem/routing.md`; link delegation → `browser/events.md`.
- Web Components: retargeting and `composedPath()` → `browser/events.md`; custom
  elements in React 19 → `react/react-19.md`; ARIA →
  `accessibility/accessibility.md`.
- URL: origin → `network/cors.md`; `javascript:` URLs → `security/xss.md`;
  cookie encoding → `network/storage.md`.

## Edits to existing pages

- `javascript/event-loop.md`: drop "not in Safari yet" from the
  `scheduler.yield()` follow-up and link to `scheduling.md`; link rAF and
  `MutationObserver` to the new pages.
- `browser/browser-workflow.md`: "How does JavaScript fit into rendering?" →
  link to `scheduling.md`.
- `browser/events.md`: the Shadow DOM follow-up → link to `web-components.md`.
- `javascript/debounce-throttle.md`: rAF → `scheduling.md`;
  `IntersectionObserver` → `observers.md`.
- `performance/web-vitals.md`: `scheduler.yield()` → `scheduling.md`.
- `react/ecosystem/routing.md`: the `<Link>` / `history.pushState` follow-up →
  `history-api.md`.
- `react/hooks/refs.md`: Fragment-ref observers and the ResizeObserver example →
  `observers.md`.
- `react/react-19.md`: custom elements row → `web-components.md`.
- `network/storage.md` (`encodeURIComponent`) and `security/xss.md` (`new URL`
  protocol check) → `url.md`.
