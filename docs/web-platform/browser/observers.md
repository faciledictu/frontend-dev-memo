---
sidebar_position: 4
description:
  IntersectionObserver, ResizeObserver and MutationObserver, when their
  callbacks run, lazy loading, infinite scroll and the ResizeObserver loop error
tags: [middle]
---

# Intersection, Resize and Mutation Observers

Observers let the browser tell the code that something changed, instead of
`scroll` / `resize` handlers or polling with `getBoundingClientRect()`:

- **`IntersectionObserver`**: an element entered or left the viewport (or
  another container). Lazy loading, infinite scroll, impressions.
- **`ResizeObserver`**: the size of an element changed, for any reason, not only
  when the window was resized.
- **`MutationObserver`**: the DOM changed: children, attributes, text.

All three work the same way: create an observer with a callback, call
`observe(target)`, and get changes **in batches**, as an array of entries.

## Details

### The Shared Pattern

- `new XObserver(callback, options)`; the callback receives
  `(entries, observer)`.
- `observe(target)` adds a target, `unobserve(target)` removes one (not in
  `MutationObserver`), `disconnect()` stops everything. Disconnect when the
  component is removed.
- One observer can watch many elements; that is cheaper than one observer per
  element.
- `PerformanceObserver` (for [Web Vitals](../performance/web-vitals.md)) follows
  the same pattern.

| Observer               | Watches                                     | Callback runs                                | Uses                                          |
| ---------------------- | ------------------------------------------- | -------------------------------------------- | --------------------------------------------- |
| `IntersectionObserver` | Visibility of an element within a root      | In a task, after the frame                   | Lazy loading, infinite scroll, analytics      |
| `ResizeObserver`       | The size of an element's box                | In the frame, after layout and before paint  | Responsive components, charts, text that fits |
| `MutationObserver`     | Children, attributes, text in a DOM subtree | As a **microtask**, after the current script | Reacting to DOM changes by third-party code   |

### IntersectionObserver

- Options: `root` (the scroll container; `null` means the viewport),
  `rootMargin` (expands or shrinks the root like CSS margins: `'200px'` starts
  loading before the element is visible), `threshold` (the share of the element
  that must be visible: `0`, `0.5`, `[0, 0.25, 0.5, 1]`).
- The callback runs **once right after `observe()`** with the current state,
  then on every threshold crossing. Check `entry.isIntersecting`;
  `entry .intersectionRatio` gives the visible share.
- The browser computes intersections once per frame, after layout, so the code
  does not force extra layouts the way `getBoundingClientRect()` in a `scroll`
  handler does.
- For images and iframes, `loading="lazy"` is enough. See
  [Critical Rendering Path and Loading Performance](../performance/loading-performance.md#images).
- Version 2 (`trackVisibility`) also detects whether the element is covered by
  other content; Chromium only.

### ResizeObserver

- `entry.contentRect` is the content box (the older property);
  `entry.contentBoxSize` and `entry.borderBoxSize` are arrays of
  `{ inlineSize, blockSize }`, which respect the writing mode. The `box` option
  chooses which box triggers the callback.
- It runs after layout and before paint, so a size change applied in the
  callback is painted in the same frame, without a flicker.
- If the callback changes the size of observed elements, the browser runs layout
  and checks them again, only for elements deeper in the tree. The rest are
  postponed to the next frame, and the browser reports **"ResizeObserver loop
  completed with undelivered notifications"** as a `window` `error` event. It
  usually means a callback that resizes what it observes: move the change into
  `requestAnimationFrame` or skip it if the size is already right.
- In React, the observer is attached with a callback ref. See
  [Refs](../../react/hooks/refs.md#callback-refs).

### MutationObserver

- Options of `observe(target, options)`: `childList`, `attributes`,
  `characterData` (at least one), `subtree`, `attributeFilter`,
  `attributeOldValue`, `characterDataOldValue`.
- Records are delivered as a **microtask** after the script that changed the
  DOM, all together: a hundred `appendChild` calls produce one callback.
- `takeRecords()` returns the pending records and empties the queue, for example
  before `disconnect()`.
- It replaced the synchronous **Mutation Events** (`DOMNodeInserted`), which
  slowed down every DOM change and have been removed from browsers.
- Changing the observed DOM inside the callback produces new records and can
  loop.

Support: all three observers are Baseline.

## Example

Infinite scroll with a sentinel element at the end of the list:

```javascript
const list = document.querySelector('#list');
const sentinel = document.querySelector('#sentinel'); // an empty div after the list
let page = 1;
let loading = false;

const observer = new IntersectionObserver(
  async ([entry]) => {
    if (!entry.isIntersecting || loading) return;
    loading = true;
    const items = await fetchPage(page++);
    list.append(...items.map(renderItem));
    loading = false;
    if (items.length === 0) observer.disconnect(); // the end of the list
  },
  // highlight-next-line
  { rootMargin: '300px' } // start loading 300px before the sentinel is visible
);

observer.observe(sentinel);
```

## Follow-up Questions

- Why not a `scroll` handler with `getBoundingClientRect()`? The handler fires
  many times per frame, and each `getBoundingClientRect()` after a DOM change
  forces a layout. The observer is computed by the browser once per frame.
- Will the sentinel load the next page if the new items do not fill the screen?
  No: the callback runs only when the intersection state changes. Re-observe the
  sentinel (`unobserve` + `observe`) or check `isIntersecting` again after
  loading.
- How do you track that an ad was really seen? `threshold: 0.5` plus a timer:
  the element counts as seen after it stays half visible for a second.
- Why does `MutationObserver` use microtasks and not run synchronously? To
  deliver all changes of one script in one batch, after the DOM is consistent.
- How do you watch an element inside an `iframe` or a scroll container? Pass the
  container as `root`.

## Common Mistakes

- Forgetting `disconnect()` when the component is removed: the observer keeps
  the callback and the closure alive.
- Treating the first callback after `observe()` as a real intersection: check
  `isIntersecting`.
- Using `IntersectionObserver` for images when `loading="lazy"` does the job.
- Resizing the observed element in the `ResizeObserver` callback without a
  check, which leads to the loop error.
- Creating a separate observer for each of hundreds of list items.

## See Also

- [requestAnimationFrame and requestIdleCallback](./scheduling.md)
- [Debounce and Throttle](../../javascript/debounce-throttle.md)
- [Critical Rendering Path and Loading Performance](../performance/loading-performance.md)
- [Refs](../../react/hooks/refs.md)
