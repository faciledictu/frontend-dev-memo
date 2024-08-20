---
sidebar_position: 6
---

# Flexbox Model

Flexbox is a powerful layout system used in React Native to create responsive
UIs. It helps in organizing components in a flexible and predictable way, which
is especially useful for mobile app development where screen sizes vary.

## Properties

### `flexDirection`

- `column` (default)<br /> Aligns children vertically (top to bottom).
- `row`<br /> Aligns children horizontally (left to right).
- `column-reverse`<br /> Aligns children vertically in reverse order (bottom to
  top).
- `row-reverse`<br /> Aligns children horizontally in reverse order (right to
  left).

### `justifyContent`

Aligns children along **the primary axis** (direction defined by
`flexDirection`).

- `flex-start` (default)<br /> Children are aligned at the beginning of the
  container.
- `center`<br /> Children are centered within the container.
- `flex-end`<br /> Children are aligned at the end of the container.
- `space-between`<br /> Space is evenly distributed between children.
- `space-around`<br /> Space is evenly distributed around children.
- `space-evenly`<br /> Space is evenly distributed, including at the ends of the
  container.

### `alignItems`

Aligns children along **the cross axis** (perpendicular to the `flexDirection`).

- `stretch`<br /> Children stretch to fill the container (default for column
  direction).
- `flex-start`<br /> Children are aligned at the start of the cross axis.
- `center`<br /> Children are centered on the cross axis.
- `flex-end`<br /> Children are aligned at the end of the cross axis.

### `flex`

Controls how much space a child should take up relative to its siblings

Example:

- `flex: 1`: The child will expand to fill available space, dividing it equally
  if other children also have `flex: 1`.
- `flex: 0.5`: The child will take up half the space relative to a child with
  `flex: 1`.

### `alignSelf`

Allows individual child elements to override the `alignItems` of their parent.

- `auto` (default)<br /> Inherits the parent's alignItems.
- `flex-start`, `center`, `flex-end`, `stretch`<br /> Same as alignItems.

### `flexWrap`

Determines whether the children should wrap onto multiple lines/columns when
they exceed the container's boundaries.

- `nowrap` (default)<br /> All children are placed in a single line.
- `wrap`<br /> Children wrap to the next line/column if they exceed the
  container's boundaries.
- `wrap-reverse`<br /> Children wrap to the next line/column in reverse order.

### `alignContent`

Aligns multiple rows or columns within the container when `flexWrap` is set to
`wrap`.

- `flex-start`<br /> Lines are packed at the start of the container.
- `center`<br /> Lines are packed at the center of the container.
- `flex-end`<br /> Lines are packed at the end of the container.
- `space-between`<br /> Lines are evenly distributed with the first line at the
  start and the last line at the end.
- `space-around`<br /> Lines are evenly distributed with equal space around each
  line.
- `stretch`<br /> Lines stretch to take up the remaining space.
