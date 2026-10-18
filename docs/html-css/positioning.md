---
sidebar_position: 6
description:
  position values, containing block, why sticky does not stick, stacking context
  and z-index, top layer, anchor positioning, ways to center an element
tags: [junior, middle]
---

# Positioning and z-index

`position` decides whether an element stays in the normal flow and what `top` /
`left` are measured from:

- `static` (default) and `relative` stay in the flow; `relative` only shifts the
  element visually.
- `absolute` and `fixed` leave the flow; `absolute` is positioned against the
  nearest **positioned ancestor**, `fixed` against the viewport.
- `sticky` behaves as `relative` until scrolling reaches the threshold, then
  sticks.

**`z-index`** orders elements only **inside one stacking context**. If a parent
creates its own context (`opacity`, `transform`, `z-index` on a positioned
element…), no `z-index` on a child can lift it above the parent's siblings.

## Details

### `position` Values

| Value      | In the flow     | Offsets are relative to                            | Typical use                   |
| ---------- | --------------- | -------------------------------------------------- | ----------------------------- |
| `static`   | yes             | ignored (`top`, `z-index` have no effect)          | default                       |
| `relative` | yes, space kept | its own normal position                            | anchor for absolute children  |
| `absolute` | no              | the padding box of the nearest positioned ancestor | badges, dropdowns, overlays   |
| `fixed`    | no              | the viewport (with exceptions, below)              | headers, floating buttons     |
| `sticky`   | yes             | the nearest scrolling ancestor, within its parent  | table headers, section titles |

- The rectangle that offsets and percentages are measured from is the
  **containing block**. Without positioned ancestors, `absolute` uses the
  initial containing block (the first screen of the page).
- **`inset: 0`** is `top: 0; right: 0; bottom: 0; left: 0`: an absolute element
  with it covers its containing block.
- An absolute element without offsets stays where it would have been in the
  flow.

### When `fixed` Is Not Fixed

An ancestor with **`transform`**, **`filter`**, **`perspective`**,
`backdrop-filter`, `contain: layout` or `paint`, or `will-change` for any of
these becomes the containing block for its `fixed` descendants. The "fixed"
element then scrolls with that ancestor and is clipped by it. Typical case: a
modal inside an animated card. Fix: render the modal at the end of `<body>` (a
portal) or use `<dialog>`.

### Why `sticky` Does Not Stick

- No threshold: `top`, `bottom`, `left` or `right` is required.
- An ancestor between it and the scrolling container has `overflow: hidden`,
  `auto` or `scroll`: the element sticks inside that ancestor, which usually
  does not scroll (`overflow: clip` does not have this problem).
- The parent is not taller than the sticky element: it can only move inside its
  parent and has no room. A common case is a sticky sidebar in a flex or grid
  row that is stretched to the full height: add `align-self: start`.

### Stacking Context

A **stacking context** is a group of elements that is painted as one layer and
ordered among its siblings as a whole. Created by:

- the root `<html>`;
- `position: absolute` or `relative` with `z-index` other than `auto`;
- `position: fixed` and `sticky` always;
- flex and grid items with `z-index` other than `auto` (even when `static`);
- **`opacity` less than 1**, **`transform`**, `filter`, `perspective`,
  `clip-path`, `mask`, `mix-blend-mode` other than `normal`;
- **`isolation: isolate`**: a new context with no other side effects;
- `will-change` for any of these, `contain: layout` or `paint`.

Inside a context, from bottom to top: its background, children with negative
`z-index`, blocks in the flow, floats, inline content, positioned children with
`z-index: auto` or `0`, positive `z-index`.

- `z-index: 9999` on a child of an element with `z-index: 1` stays below a
  sibling of that element with `z-index: 2`: the child's value is compared only
  inside its parent's context.
- `isolation: isolate` on a component root keeps its internal `z-index` values
  from leaking out and competing with the rest of the page.

### Top Layer

`<dialog>` opened with `showModal()`, popovers (`popover` attribute) and
fullscreen elements are rendered in the **top layer**, above the whole page,
regardless of `z-index`, stacking contexts and ancestors' `overflow` or
`transform`. See [Portals](../react/basics/portals.md).

### Anchor Positioning

```css
.button {
  anchor-name: --menu-button;
}
.menu {
  position: absolute;
  position-anchor: --menu-button;
  position-area: bottom span-right; /* below, aligned to the left edge */
  position-try-fallbacks: flip-block; /* above if there is no room below */
}
```

Positions an element relative to any other element, not just its containing
block: tooltips and dropdowns without JavaScript measuring. `anchor(bottom)` can
be used in `top` and other insets for exact placement. Browser support: not
Baseline yet.

### Centering

| Method                                                          | Centers      | Notes                                 |
| --------------------------------------------------------------- | ------------ | ------------------------------------- |
| `display: grid; place-items: center` on the parent              | both axes    | the shortest                          |
| `display: flex; justify-content: center; align-items: center`   | both axes    | also for a row of several items       |
| `margin: auto` on a flex or grid item                           | both axes    |                                       |
| `margin-inline: auto` with a width                              | horizontally | blocks in normal flow                 |
| `text-align: center` on the parent                              | horizontally | inline content and `inline-block`     |
| `position: absolute; inset: 0; margin: auto` + size             | both axes    | needs `width` and `height`            |
| `position: absolute; top: 50%; left: 50%; translate: -50% -50%` | both axes    | unknown size; may blur on half pixels |
| `align-content: center` on a block                              | vertically   | without flex or grid                  |

## Example

```css
.card {
  position: relative; /* the containing block for the badge */
  /* highlight-next-line */
  isolation: isolate; /* the card's z-index values stay inside it */
}
.card .badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

<details>
<summary>A `z-index` that does not work</summary>

```html
<div class="header" style="position: relative; z-index: 2">Header</div>
<div class="content" style="position: relative; z-index: 1">
  <div class="dropdown" style="position: absolute; z-index: 9999">Menu</div>
</div>
```

The menu is painted under the header: it is inside `.content`, whose whole
stacking context sits at level 1, below the header's level 2. Fixes: remove
`z-index` from `.content` (then it creates no context), raise `.content` itself,
or move the menu to the top layer (`popover`) or a portal.

</details>

## Follow-up Questions

- What is the difference between `relative` and `absolute`? A relative element
  keeps its place in the flow and shifts visually; an absolute one leaves the
  flow, and its neighbors close the gap.
- `transform: translate()` vs `top` / `left` for animation? `transform` is done
  by the compositor without layout, see
  [CSS Transitions and Animations](./animations.md#what-to-animate).
- Can a child with a negative `z-index` go behind its parent? Behind the
  parent's background only if the parent does not create a stacking context;
  otherwise it stays above the parent's background.
- `fixed` vs `sticky`? `fixed` leaves the flow and ignores its parent; `sticky`
  keeps its space and moves only inside its parent, so it stops at the parent's
  bottom edge.
- Does `z-index` work without `position`? Only on flex and grid items; on a
  static block it is ignored.

## Common Mistakes

- Raising `z-index` to 9999 instead of finding which ancestor creates a stacking
  context.
- `position: absolute` without a positioned ancestor: the element is placed
  against the initial containing block (the first screen).
- `position: fixed` inside an element with `transform`: it is no longer fixed to
  the viewport.
- `position: sticky` inside a parent with `overflow: hidden`.

## See Also

- [Box Model](./box-model.md)
- [Portals](../react/basics/portals.md)
- [MDN: Stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)
