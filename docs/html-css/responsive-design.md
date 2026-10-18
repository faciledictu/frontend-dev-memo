---
sidebar_position: 8
description:
  Mobile-first media queries and range syntax, CSS units, clamp() / min() /
  max(), container queries, srcset and sizes vs picture, user preference queries
tags: [junior, middle]
---

# Responsive Design

A responsive layout adapts to the space it gets. The main tools:

- **Fluid layout** first: Flexbox and Grid with `fr`, `%`, `minmax()` and
  `clamp()` often need no breakpoints at all.
- **Media queries**, written **mobile-first**: base styles for small screens,
  `@media (width >= 768px)` adds to them.
- **Container queries** adapt a component to the size of its container, not the
  viewport, so the same card works in a sidebar and in the main column.
- **Responsive images**: `srcset` and `sizes` let the browser pick a file of the
  right size; `<picture>` switches between different images.

It all needs the [viewport meta tag](./html.md#viewport-meta-tag).

## Details

### Media Queries

```css
/* Mobile-first: no query for the base, then min-width steps */
.grid {
  grid-template-columns: 1fr;
}
@media (width >= 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
```

- **Range syntax** `(width >= 768px)`, `(400px <= width < 800px)` replaces
  `min-width` / `max-width`, and makes it clear whether the boundary is
  included.
- Mobile-first keeps the simplest styles as the base, and phones do not have to
  undo desktop styles; desktop-first (`max-width`) works too, but mixing both
  leads to gaps and overlaps at the boundaries.
- Breakpoints in `em` follow the user's default font size, so the layout
  switches before the text gets cramped.

### Units

| Unit                | Relative to                                                               | Use for                               |
| ------------------- | ------------------------------------------------------------------------- | ------------------------------------- |
| `px`                | nothing (a CSS pixel, not a device pixel)                                 | borders, shadows, small fixed details |
| `em`                | the element's font size (for `font-size` itself: the parent's)            | padding that scales with the text     |
| `rem`               | the root (`<html>`) font size                                             | font sizes, spacing                   |
| `%`                 | the containing block (for `width`; see [Box Model](./box-model.md#sizes)) | fluid widths                          |
| `vw`, `vh`          | 1% of the viewport width / height                                         | full-screen sections, fluid type      |
| `svh`, `lvh`, `dvh` | 1% of the small / large / dynamic viewport height                         | full-height layouts on mobile         |
| `cqi`, `cqw`, `cqh` | 1% of the query container's inline size / width / height                  | sizes inside a component              |
| `ch`                | the width of `0` in the current font                                      | line length (`max-inline-size: 65ch`) |

- On mobile, **`100vh`** is the **large** viewport: the height with the browser
  toolbars hidden, so the bottom of a `100vh` screen is under the toolbar.
  **`100dvh`** follows the toolbars as they show and hide; **`100svh`** is the
  height with them shown and never jumps.
- `rem` for font sizes respects the user's browser font setting; `px` font sizes
  ignore it. See
  [Web Accessibility](../web-platform/accessibility/accessibility.md).
- `em` compounds: a list inside a list with `font-size: 0.8em` gets smaller and
  smaller.

### `clamp()`, `min()`, `max()`

- **`clamp(min, preferred, max)`**: the preferred value, but not below `min` and
  not above `max`. Fluid type without breakpoints:
  `font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem)`.
- **`min(a, b)`** takes the smaller: `width: min(100%, 1200px)` is a container
  that is fluid on small screens and limited on large ones.
- **`max(a, b)`** takes the larger: `padding: max(16px, 4vw)`.
- Keep a `rem` part in a fluid font size: `font-size: 5vw` alone does not grow
  when the user zooms.

### Container Queries

```css
.card-list {
  container-type: inline-size; /* this element can be queried */
  container-name: cards; /* optional */
}

@container cards (width > 400px) {
  .card {
    grid-template-columns: 120px 1fr;
  }
}
```

- An element queries its **nearest ancestor container**, never itself:
  `container-type` goes on the wrapper.
- `inline-size` applies size containment along the inline axis: the container's
  width must not depend on its content. `size` contains both axes, so the
  container needs an explicit height.
- Units `cqi` / `cqw` size things relative to the container.
- **Style queries** `@container style(--variant: compact)` check the value of a
  custom property on an ancestor (the parent when no container is named; no
  `container-type` needed). Browser support: Baseline 2026, newly available.

### Responsive Images

```html
<!-- Same image, different sizes: the browser chooses -->
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
  sizes="(width >= 768px) 50vw, 100vw"
  width="800"
  height="600"
  alt="A dog on the beach"
/>
```

- **`srcset` with `w`** lists files and their real widths; **`sizes`** tells the
  browser how wide the image will be on the page. The browser multiplies by the
  pixel density and picks a file; it may also take a smaller one on a slow
  network or reuse a larger one from the cache.
- **`srcset` with `x`** (`logo.png 1x, logo@2x.png 2x`) is for images of a fixed
  size.
- **`<picture>`** with `<source media>` is for **art direction**: a different
  crop on mobile. With `<source type="image/avif">` it offers formats with a
  fallback. The browser must take the first matching `<source>`; the `<img>`
  inside is required and carries `alt` and the size.
- Lazy loading and the LCP image: see
  [Loading Performance](../web-platform/performance/loading-performance.md#images).

### User Preferences and Input

| Query                                | True when                                             |
| ------------------------------------ | ----------------------------------------------------- |
| `(hover: hover) and (pointer: fine)` | the primary input is a mouse or a trackpad            |
| `(pointer: coarse)`                  | the primary input is a finger: make targets larger    |
| `(any-hover: hover)`                 | at least one input can hover (a tablet with a mouse)  |
| `(prefers-color-scheme: dark)`       | the system uses a dark theme                          |
| `(prefers-reduced-motion: reduce)`   | the user asked for less motion: drop large animations |

Hover effects without `(hover: hover)` stick on touch screens after a tap.

## Example

```css
.container {
  /* highlight-next-line */
  width: min(100% - 2rem, 1200px); /* 1rem gutters on phones, 1200px max */
  margin-inline: auto;
}

h1 {
  font-size: clamp(1.75rem, 1.2rem + 2vw, 3rem);
}

.hero {
  min-height: 100svh; /* fits the screen with the browser toolbars shown */
}

/* A global switch; per-component queries are more precise */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Follow-up Questions

- Media query or container query? A media query for the page layout (number of
  columns, navigation); a container query for a reusable component that can be
  placed in areas of different width.

- Why do `vw` units cause horizontal scroll on desktop? `100vw` includes the
  vertical scrollbar; use `100%` for full-width blocks.
- `srcset` or `<picture>`? `srcset` when it is the same image at different
  resolutions and the browser may choose; `<picture>` when the content or format
  must change and the choice is yours.
- How do you make an image responsive? `max-width: 100%; height: auto`: it
  shrinks with the container and never grows past its natural size; `width` /
  `height` attributes reserve the space.
- Responsive vs adaptive design? Responsive is one fluid layout that reflows;
  adaptive is a set of fixed layouts switched at breakpoints or chosen by the
  server per device.

## Common Mistakes

- Breakpoints for specific devices (375px, 414px) instead of where the layout
  actually breaks.
- `height: 100vh` on mobile: the bottom is hidden under the browser toolbar.
- `srcset` with `w` descriptors but no `sizes`: the browser assumes `100vw` and
  downloads too large a file.
- Font sizes in `px` or pure `vw`: they ignore the user's font settings or zoom.
- Using `user-scalable=no` to "fix" the mobile layout.
- Hiding a large image on mobile with `display: none`: it is still downloaded;
  use `<picture>` or `srcset`.

## See Also

- [HTML: viewport meta tag](./html.md#viewport-meta-tag)
- [CSS Grid](./grid.md)
- [CSS Transitions and Animations](./animations.md): `prefers-reduced-motion`
- [Loading Performance](../web-platform/performance/loading-performance.md)
- [Web Vitals](../web-platform/performance/web-vitals.md): CLS and image sizes
