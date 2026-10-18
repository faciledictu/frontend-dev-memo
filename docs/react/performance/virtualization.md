---
sidebar_position: 2
description: Rendering only the visible part of a long list or grid
tags: [middle]
---

# List Virtualization

**Virtualization** (windowing) renders only the items that are visible in the
viewport, plus a few around it, instead of the whole list. The number of DOM
nodes stays constant whatever the size of the data, which fixes slow first
render, slow updates and high memory use. Current libraries: **TanStack
Virtual** (a headless hook), **react-window** and **React Virtuoso** (ready
components). `react-virtualized` is no longer maintained.

Applies to: TanStack Virtual 3.

## Details

### How It Works

- The scroll container has a fixed height and `overflow: auto`.
- An inner element has the **full height** of the list, so the scrollbar is
  real.
- Only the visible items are rendered, absolutely positioned at their offsets.
- On scroll the library recalculates which indexes are visible.
- **Overscan** is a few extra items above and below, so fast scrolling does not
  show blank space.
- Item size is either fixed, or estimated first and then measured (dynamic
  heights).

### When to Use

- Thousands of rows, or hundreds of heavy ones.
- For a few hundred simple items it is usually unnecessary.
- First check whether pagination or "load more" solves the problem.

### Trade-offs

- The browser's find-in-page does not see items that are not rendered.
- Screen readers see only the rendered part: the total needs `aria-rowcount` or
  `aria-setsize`.
- Dynamic heights can make the scroll position jump.
- Scroll restoration and "scroll to item" need the library API.
- [React Compiler](./optimization.md#react-compiler) skips components that call
  `useVirtualizer`: the hook is on its list of known incompatible libraries
  (lint rule `incompatible-library`), because it returns functions that can't be
  memoized safely.

### Alternatives

- Pagination or infinite scroll (often combined with virtualization).
- CSS `content-visibility: auto`: the nodes stay in the DOM, but the browser
  skips layout and paint for the off-screen ones.

## Example

```jsx
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export default function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Follow-up Questions

- Why not just paginate? Pagination changes the UX; virtualization keeps one
  scrollable list. They are often combined with infinite scroll.
- How does the scrollbar look right if only 20 items are rendered? The inner
  element has the full (estimated) height of the list.
- What is overscan? Extra items rendered beyond the viewport, so fast scrolling
  does not show blank space.
- How are dynamic heights handled? An `estimateSize` first, then the real size
  from `measureElement` after the item renders.
- Why do keys matter here? Items mount and unmount on scroll: an index key would
  move the state of one item to another, see
  [Lists and `key`](../basics/lists-and-keys.md). `virtualItem.key` is the index
  unless `getItemKey` returns the item's ID.

## Common Mistakes

- Virtualizing a short list: complexity without a measurable gain.
- A scroll container without a fixed height or `overflow`: every item is
  "visible" and all of them render.
- Index keys for items with state or for a list that can be reordered.
- Forgetting `aria-rowcount` or `aria-setsize`.

## See Also

- [Optimizing React Components](./optimization.md)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
