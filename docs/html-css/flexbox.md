---
sidebar_position: 5
description:
  Main and cross axes, container and item properties, flex-grow / shrink / basis
  and flex 1, gap and wrapping, the min-width trap, order
tags: [junior, middle]
---

# Flexbox

**Flexbox** lays out items in **one dimension**: a row or a column. The **main
axis** is set by `flex-direction` (`row` by default), the **cross axis** is
perpendicular to it. `justify-content` aligns items along the main axis,
`align-items` along the cross axis.

**`flex-grow`** shares out free space, **`flex-shrink`** shares out the
overflow, both starting from **`flex-basis`**. `flex: 1` means "share the free
space equally, not starting from the content size".

## Details

### Container Properties

| Property          | Values (default first)                                                              | Does                                    |
| ----------------- | ----------------------------------------------------------------------------------- | --------------------------------------- |
| `display`         | `flex`, `inline-flex`                                                               | makes the children flex items           |
| `flex-direction`  | `row`, `row-reverse`, `column`, `column-reverse`                                    | sets the main axis                      |
| `flex-wrap`       | `nowrap`, `wrap`, `wrap-reverse`                                                    | allows several lines                    |
| `flex-flow`       | `row nowrap`                                                                        | shorthand for direction and wrap        |
| `justify-content` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | main axis                               |
| `align-items`     | `stretch`, `flex-start`, `center`, `flex-end`, `baseline`                           | cross axis, each line                   |
| `align-content`   | `normal` (stretch), `flex-start`, `center`, `space-between`, …                      | cross axis, lines as a whole; with wrap |
| `gap`             | `0`, `16px`, `8px 16px`                                                             | space between items, not at the edges   |

### Item Properties

| Property      | Default    | Does                                                           |
| ------------- | ---------- | -------------------------------------------------------------- |
| `flex-grow`   | `0`        | share of the **free** space the item takes                     |
| `flex-shrink` | `1`        | how much it shrinks when space is short, weighted by basis     |
| `flex-basis`  | `auto`     | starting size: `width` (or `height` in a column), else content |
| `flex`        | `0 1 auto` | shorthand for grow, shrink, basis                              |
| `align-self`  | `auto`     | overrides `align-items` for one item                           |
| `order`       | `0`        | visual order; lower goes first                                 |

| Shorthand         | Means      | Behavior                                                                            |
| ----------------- | ---------- | ----------------------------------------------------------------------------------- |
| `flex: 1`         | `1 1 0%`   | equal shares of the whole space, content size ignored                               |
| `flex: auto`      | `1 1 auto` | starts from content size, then shares the rest                                      |
| `flex: none`      | `0 0 auto` | rigid: neither grows nor shrinks                                                    |
| `flex: 0 0 200px` | —          | 200px, neither grows nor shrinks (but not below its content without `min-width: 0`) |

- With `flex: 1` items get **equal widths**; with `flex: auto` a longer label
  gets a wider item.
- There is no `justify-self` in flexbox: to push one item to the end, use
  `margin-left: auto` (or `margin-inline-start: auto`); an `auto` margin takes
  all free space.
- Margins of flex items do not collapse.

### The `min-width: auto` Trap

A flex item's minimum width is **`auto`**, which means "not smaller than its
content" (the longest word, a `<pre>`, a wide table, a nested flex row with
`white-space: nowrap`). So `flex: 1` and `flex-shrink` stop at the content
width, and the item overflows its container.

- Fix: **`min-width: 0`** (`min-height: 0` in a column) on the item, or
  `overflow: hidden` or `auto` (not `clip`).
- Typical symptom: `text-overflow: ellipsis` does not work inside a flex item.

### `order` and Accessibility

`order` and `row-reverse` change only the **visual** order. Tab order and screen
readers follow the DOM, so the focus jumps around the page. Change the order in
the HTML when it matters. See
[Web Accessibility](../web-platform/accessibility/accessibility.md#keyboard-and-focus).

## Example

```css
/* Header: logo left, links right, all centered vertically */
.header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header .logo {
  /* highlight-next-line */
  margin-inline-end: auto; /* pushes the rest to the right */
}

/* Sidebar of fixed width + content that takes the rest */
.layout {
  display: flex;
}
.sidebar {
  flex: 0 0 240px;
}
.content {
  flex: 1;
  min-width: 0; /* otherwise a long line or a wide table overflows */
}
```

<details>
<summary>Wrapping cards with a minimum width</summary>

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 240px; /* starts at 240px, grows to fill the line */
}
```

The last line stretches its cards to the full width, because each line shares
its own free space. When columns must stay aligned across lines, use
[Grid](./grid.md) with `repeat(auto-fill, minmax(240px, 1fr))`.

</details>

## Follow-up Questions

- How do you center an element?
  `display: flex; justify-content: center; align-items: center` on the parent;
  other ways are in [Positioning](./positioning.md#centering).
- What is the difference between `flex-basis` and `width`? `flex-basis` wins
  along the main axis when both are set; in a column it acts on the height.
  `min-width` and `max-width` still limit it.
- How is `flex-shrink` calculated? The overflow is split in proportion to
  `flex-shrink × flex-basis`, so large items lose more pixels.
- How do you keep the footer at the bottom of a short page?
  `body { min-height: 100dvh; display: flex; flex-direction: column }` and
  `margin-top: auto` on the footer (or Grid with rows `auto 1fr auto`).
- Do `float` and `vertical-align` affect flex items? No, they are ignored.
- Why do items stretch to the full height? `align-items` defaults to `stretch`;
  an item with an explicit `height` or `align-self: flex-start` does not
  stretch.
- How does Flexbox differ in React Native? Column by default, `flexShrink: 0`,
  `flex` takes a single number. See
  [Flexbox in React Native](../react-native/flexbox.md).

## Common Mistakes

- Expecting `flex: 1` to respect content size: its basis is `0`, so items get
  equal widths whatever their content.
- A flex item with long text or a table overflows: missing `min-width: 0`.
- `align-content` without `flex-wrap: wrap`: on a single line it does nothing,
  `align-items` is the one to use.
- Margins between items instead of `gap`: they need `:last-child` exceptions and
  break on wrapping.
- Reordering important content with `order` and breaking keyboard navigation.

## See Also

- [CSS Grid](./grid.md)
- [Box Model](./box-model.md)
- [Flexbox in React Native](../react-native/flexbox.md)
- [MDN: Basic concepts of flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)
