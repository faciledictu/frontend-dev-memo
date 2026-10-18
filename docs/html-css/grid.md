---
sidebar_position: 5
description:
  Tracks and fr, repeat() with auto-fill vs auto-fit, line placement and grid
  areas, implicit grid, subgrid, Grid vs Flexbox
tags: [junior, middle]
---

# CSS Grid

**Grid** lays out items in **two dimensions** at once: the container defines
rows and columns (**tracks**), and items are placed into cells or areas by
**line numbers** or **names**. The **`fr`** unit shares free space between
tracks. Flexbox sizes items by their content along one axis; Grid fixes the
structure first and puts content into it.

## Details

### Tracks and `fr`

- `grid-template-columns: 200px 1fr 2fr`: a fixed column, then the rest shared
  1:2.
- **`fr`** shares the space left after the non-`fr` tracks and the gaps.
- `1fr` is really `minmax(auto, 1fr)`: a track does not shrink below its
  content, and a long word or a wide `<pre>` makes it wider than the others. For
  strictly equal columns use **`minmax(0, 1fr)`**.
- `minmax(min, max)`, `auto`, `min-content`, `max-content` and
  `fit-content(300px)` size tracks by content.

### `auto-fill` vs `auto-fit`

`repeat(auto-fill | auto-fit, minmax(200px, 1fr))` creates as many columns as
fit into the container: a responsive grid without media queries.

| Keyword     | When there are fewer items than columns                            |
| ----------- | ------------------------------------------------------------------ |
| `auto-fill` | keeps the empty columns; items keep the column width               |
| `auto-fit`  | collapses the empty columns to zero; items stretch to fill the row |

With enough items to fill the row, both behave the same.

### Placing Items

- **Lines** are numbered from 1; negative numbers count from the end:
  `grid-column: 1 / -1` spans the whole explicit grid.
- `grid-column: span 2` takes two columns from wherever the item lands.
- **`grid-template-areas`** names areas with strings; each area must be a
  rectangle, `.` is an empty cell. Items take them with `grid-area: header`.
- Items can overlap when placed into the same cells; `z-index` decides which is
  on top.

### Implicit Grid

- Items that do not fit into the defined tracks create **implicit** rows (or
  columns), sized by **`grid-auto-rows`** / `grid-auto-columns` (`auto` by
  default).
- **`grid-auto-flow`**: `row` (default) fills row by row, `column` column by
  column; `dense` fills holes left by large items with later small ones, so the
  visual order no longer matches the DOM (see
  [`order` and accessibility](./flexbox.md#order-and-accessibility)).
- `-1` refers to the last line of the **explicit** grid only.

### Subgrid

A nested grid normally has its own tracks, unrelated to the parent's.
**`grid-template-rows: subgrid`** (or columns) makes a grid item reuse the
parent's tracks instead, so the content of different items lines up. Typical
case: cards in a row where titles, texts and buttons must align across cards.
The item must span the parent tracks it borrows (`grid-row: span 3`).

### Alignment

The same properties as in [Flexbox](./flexbox.md), plus what Flexbox does not
have:

- **`justify-items`** / **`justify-self`** align items inside their cell along
  the row (Flexbox has no `justify-self`).
- `place-items: center` is `align-items` + `justify-items`; `place-self` is the
  same for one item.
- `justify-content` / `align-content` move the whole set of tracks when they are
  smaller than the container.

### Grid vs Flexbox

|                 | Grid                                      | Flexbox                                                 |
| --------------- | ----------------------------------------- | ------------------------------------------------------- |
| Dimensions      | two: rows and columns together            | one: a row or a column                                  |
| Sizes come from | the container's tracks (layout first)     | the items' content (content first)                      |
| Wrapped lines   | columns stay aligned across rows          | each line distributes its space alone                   |
| Placement       | any cell or area, overlapping             | in source order (or `order`)                            |
| Typical use     | page layout, card grids, forms, galleries | navbars, toolbars, a row of buttons, centering one item |

They combine: a Grid page layout with Flexbox inside the header and the cards.

## Example

```css
/* Mobile: one column */
.page {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto 1fr auto auto;
  grid-template-areas: 'header' 'main' 'sidebar' 'footer';
  min-height: 100dvh;
}

@media (width >= 768px) {
  .page {
    grid-template-columns: 240px minmax(0, 1fr);
    grid-template-rows: auto 1fr auto;
    /* highlight-start */
    grid-template-areas:
      'header header'
      'sidebar main'
      'footer footer';
    /* highlight-end */
  }
}

.page > header {
  grid-area: header;
}
.page > nav {
  grid-area: sidebar;
}
.page > main {
  grid-area: main;
}
.page > footer {
  grid-area: footer;
}
```

<details>
<summary>Cards aligned with subgrid</summary>

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.card {
  display: grid;
  /* title, text, button: the rows are shared with the other cards in the row */
  grid-row: span 3;
  /* highlight-next-line */
  grid-template-rows: subgrid;
}
```

Without subgrid, a card with a two-line title has its text and button lower than
its neighbors.

</details>

## Follow-up Questions

- What is the difference between `fr` and `%`? A percentage is taken from the
  container and ignores `gap`, so `25%` × 4 plus gaps overflows; `fr` shares
  what is left after the gaps.

- `auto` vs `1fr` tracks? `auto` is sized by content; `fr` tracks share the free
  space, so `auto 1fr` is a content-sized column plus the rest.
- Does `order` work on grid items? Yes, as in Flexbox, with the same
  accessibility caveat.

## Common Mistakes

- `1fr` columns of unequal width because of long content: use `minmax(0, 1fr)`.
- Confusing `auto-fill` and `auto-fit`: they differ only when the row is not
  full.
- `grid-template-areas` with a non-rectangular area (an L shape): the whole
  declaration is invalid and ignored.
- Using Grid for a single row of items of different widths: Flexbox is simpler.
- Reading `grid-area: 1 / 2 / 3 / 4` as top / right / bottom / left: it is
  row-start / column-start / row-end / column-end.

## See Also

- [Flexbox](./flexbox.md)
- [Responsive Design](./responsive-design.md)
- [MDN: Basic concepts of grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)
