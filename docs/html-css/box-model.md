---
sidebar_position: 3
description:
  Content, padding, border and margin, box-sizing, margin collapsing, block vs
  inline, block formatting context, overflow, logical properties
tags: [junior, middle]
---

# Box Model

Every element is a rectangular box: **content**, **padding**, **border** and
**margin** around it. What `width` and `height` mean depends on
**`box-sizing`**:

- `content-box` (the default): `width` is the content only; padding and border
  are added on top. `width: 200px; padding: 20px; border: 1px solid` takes
  242px.
- `border-box`: `width` includes padding and border; the content shrinks. Most
  projects switch it on for all elements.

Margins are outside the border and do not count toward the element's size;
**vertical margins of block elements can collapse** into one.

## Details

### `box-sizing` Reset

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

- With `border-box`, `width: 50%` plus padding still takes exactly 50%.
- `height` works the same way; `min-` and `max-` sizes follow `box-sizing` too.

### Margin Collapsing

Vertical margins of block boxes in normal flow merge into one, equal to the
**larger** of them (with negative margins: the largest positive plus the most
negative).

- **Adjacent siblings**: `margin-bottom: 20px` and `margin-top: 30px` give a
  30px gap, not 50px.
- **Parent and its first or last child**: the child's top margin goes outside
  the parent if nothing separates them: border, padding, inline content; for the
  bottom margin, also a set `height`.
- **Empty block**: its own top and bottom margins merge.

Margins do **not** collapse:

- horizontally;
- for flex and grid items, floats, absolutely positioned and `inline-block`
  elements;
- between a parent and its children when the parent creates a block formatting
  context (below) or has padding or a border.

### Block vs Inline

|                    | Block                                       | Inline                              | Inline-block           |
| ------------------ | ------------------------------------------- | ----------------------------------- | ---------------------- |
| Position           | starts on a new line                        | flows inside a line of text         | flows inside a line    |
| Width              | all available width                         | the width of its content            | the width of content   |
| `width` / `height` | applied                                     | ignored                             | applied                |
| Vertical margin    | applied                                     | ignored                             | applied                |
| Vertical padding   | applied, pushes neighbors                   | painted, but does not move lines    | applied                |
| Default for        | `<div>`, `<p>`, `<h1>`, `<ul>`, `<section>` | `<span>`, `<a>`, `<strong>`, `<em>` | `<button>`, `<select>` |

- Replaced elements (`<img>`, `<video>`, `<iframe>`, `<canvas>`) are inline but
  respect `width`, `height` and vertical margins.
- An inline `<img>` sits on the text baseline, so a few pixels appear under it:
  `display: block` or `vertical-align: middle` removes them.
- Whitespace between `inline-block` elements in the HTML is rendered as a space.
- `display` has two parts: the outer type (block or inline, how the box behaves
  among siblings) and the inner one (flow, flex, grid, how it lays out its
  children). `inline-flex` is `inline flex`.

### Block Formatting Context

A **block formatting context (BFC)** is an isolated area of block layout. An
element that creates one:

- contains its floats: its height includes them;
- does not collapse margins with its children;
- does not overlap floats next to it.

Created by the root, floats, absolutely positioned elements, `inline-block`,
`overflow` other than `visible` and `clip`, flex and grid items,
`contain: layout` and **`display: flow-root`** — the one value made only for
this, with no side effects (the old clearfix hack is no longer needed).

### Overflow

| Value     | Content that does not fit                                                 |
| --------- | ------------------------------------------------------------------------- |
| `visible` | is drawn outside the box (default)                                        |
| `hidden`  | is clipped; the box is still a scroll container and creates a BFC         |
| `clip`    | is clipped; no scroll container, no BFC, `position: sticky` keeps working |
| `scroll`  | is clipped, scrollbars always shown                                       |
| `auto`    | is clipped, scrollbars when needed                                        |

`overflow-x` and `overflow-y` can be set separately, but `visible` on one axis
becomes `auto` if the other is not `visible` or `clip`.

### Sizes

- **`width: auto`** of a block fills the container **minus its own margins,
  padding and border**. **`width: 100%`** is the container's content width; with
  `content-box`, padding and border are added and the box overflows, and margins
  push it out with any `box-sizing`.
- `height: auto` is the height of the content. A percentage `height` works only
  if the parent has a definite height.
- Percentage `padding` and `margin` are taken from the container's **width**,
  even vertical ones.
- **`aspect-ratio: 16 / 9`** sets the height from the width. `<img>` with
  `width` and `height` attributes gets the same ratio automatically, so the
  space is reserved before the image loads (against CLS).

### Logical Properties

Physical properties (`left`, `width`, `margin-top`) are tied to the screen;
**logical** ones follow the writing direction:

| Physical                         | Logical                                                                   |
| -------------------------------- | ------------------------------------------------------------------------- |
| `width` / `height`               | `inline-size` / `block-size`                                              |
| `margin-left` / `margin-right`   | `margin-inline-start` / `margin-inline-end`                               |
| `margin-top` + `margin-bottom`   | `margin-block`                                                            |
| `padding-left` + `padding-right` | `padding-inline`                                                          |
| `top`, `right`, `bottom`, `left` | `inset-block-start`, `inset-inline-end`, …, `inset-block`, `inset-inline` |
| `text-align: left`               | `text-align: start`                                                       |

- With `dir="rtl"` (Arabic, Hebrew), `margin-inline-start` becomes the right
  margin by itself; with `writing-mode: vertical-rl`, `inline-size` becomes the
  height. One stylesheet serves both directions.
- `inline` is the direction of text in a line, `block` is the direction in which
  lines and paragraphs stack.

## Example

```css
.card {
  box-sizing: border-box;
  /* highlight-next-line */
  width: 300px; /* the whole card, padding and border included */
  padding: 16px;
  border: 1px solid #ddd;
  margin-block: 24px; /* top and bottom; collapses with siblings' margins */
  padding-inline-start: 24px; /* left in LTR, right in RTL */
}

/* Contains floats and stops margin collapsing with children */
.media {
  display: flow-root;
}

.video {
  inline-size: 100%;
  aspect-ratio: 16 / 9;
}
```

<details>
<summary>Margin collapsing between a parent and its child</summary>

```html
<section style="background: #eee">
  <h2 style="margin-top: 40px">Title</h2>
</section>
```

The 40px margin of `<h2>` ends up above the gray `<section>`, not inside it: the
margins of the parent and its first child collapsed. `padding-top: 1px`, a
border or `display: flow-root` on the `<section>` keeps the margin inside.

</details>

## Follow-up Questions

- `display: none` vs `visibility: hidden` vs `opacity: 0`? Removed from layout
  and the accessibility tree / keeps its space but is not painted or focusable /
  painted invisible, still focusable and clickable. See
  [How the Browser Works](../web-platform/browser/browser-workflow.md).
- What do `float` and `clear` do? `float` takes the element out of the flow and
  lets text wrap around it; `clear` moves an element below floats. A parent
  contains its floats only if it creates a BFC (`display: flow-root`).
- How do you remove the gap between `inline-block` items? Use flex or grid
  instead; the gap is a space character from the HTML.
- Can an element have a negative margin? Yes: it pulls the element or its
  neighbors closer; negative padding is invalid.
- What does `display: contents` do? It removes the element's own box, and its
  children take part in the parent's layout (for example, as grid items). On
  buttons and other interactive elements it can break accessibility.
- Why use `outline` for focus instead of `border`? An outline does not take
  space, so it does not shift the layout.

## Common Mistakes

- `width: 100%` plus padding with `content-box`: the element is wider than its
  container.
- Expecting `margin-top` or `width` to work on a `<span>`: an inline element
  ignores them.
- Adding margins to the first child and wondering why the parent moves down:
  margin collapsing.
- Using `overflow: hidden` only to contain floats or stop margin collapsing: it
  also clips shadows and breaks `position: sticky` inside; `display: flow-root`
  does just that.

## See Also

- [HTML](./html.md)
- [Flexbox](./flexbox.md)
- [Positioning and z-index](./positioning.md)
- [How the Browser Works](../web-platform/browser/browser-workflow.md): layout,
  reflow and `display: none` vs `visibility: hidden`
