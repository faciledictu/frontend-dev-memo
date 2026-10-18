---
sidebar_position: 2
description:
  Combinators, attribute selectors, :nth-child vs :nth-of-type, :focus-visible,
  pseudo-classes vs pseudo-elements, :has(), right-to-left matching
tags: [junior]
---

# CSS Selectors

A selector picks the elements a rule applies to. It is built from:

- **simple selectors**: type `p`, class `.btn`, id `#main`, attribute `[href]`;
- **combinators** between them: descendant (space), child `>`, next sibling `+`,
  subsequent sibling `~`;
- **pseudo-classes** (`:hover`, `:nth-child()`, `:has()`) for a state or a
  position, and **pseudo-elements** (`::before`, `::marker`) for a part of an
  element.

Which rule wins when several match is decided by the cascade and specificity,
see [Specificity and the Cascade](./cascade.md).

## Details

### Combinators and Attributes

Only what is usually asked; the full list is on
[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors).

| Selector          | Matches                                              |
| ----------------- | ---------------------------------------------------- |
| `.a .b`           | `.b` anywhere inside `.a`                            |
| `.a > .b`         | `.b` that is a direct child of `.a`                  |
| `.a + .b`         | `.b` right after `.a`, same parent                   |
| `.a ~ .b`         | any `.b` after `.a`, same parent                     |
| `.a.b`            | one element with both classes                        |
| `[href^='https']` | attribute starts with; `$=` ends with, `*=` contains |

### `:nth-child()` and `:nth-of-type()`

- `:nth-child(2)` counts all siblings; `:nth-of-type(2)` counts only siblings
  with the same tag. Neither looks at the class before the colon.
- `:nth-child(2 of .item)` counts only the siblings that match `.item`.
- Formulas: `odd`, `even`, `3n+1`; `-n+3` is the first three.
- `:first-child`, `:last-child` and `:only-child` are shortcuts with the same
  rule: `.item:last-child` matches only if `.item` is the last child.

### State Pseudo-Classes

- `:focus-visible` matches focus the browser would show a ring for (keyboard
  navigation, text fields), not a mouse click on a button. Style it instead of
  `:focus` so that mouse users do not see the ring.
- `:focus-within` matches an element that has focus or contains the focused
  element.
- `:user-invalid` matches an invalid field only after the user has interacted
  with it or tried to submit the form, unlike `:invalid`, which matches on page
  load.

### Pseudo-Elements

- `::before` and `::after` render only with `content` (`content: ''` for a
  decorative box); they do not work on replaced elements (`<img>`, `<video>`,
  most `<input>`s).
- Others: `::placeholder`, `::marker` (list bullets), `::selection`,
  `::backdrop` (behind a modal `<dialog>`, a popover or a fullscreen element),
  `::first-line`.

### `:has()`

`:has()` selects an element by what is relative to it: descendants
(`.card:has(img)`), children (`:has(> img)`), following siblings
(`label:has(+ input)`). It cannot be nested inside another `:has()`, and
pseudo-elements are not allowed inside it.

## Example

```css
/* A card that contains an image */
/* highlight-next-line */
.card:has(img) {
  display: grid;
  grid-template-rows: 200px auto;
}

/* A form field label when its input is invalid after user interaction */
label:has(+ input:user-invalid) {
  color: crimson;
}

/* The page while a modal is open */
body:has(dialog:modal) {
  overflow: hidden;
}

/* Every second .item, ignoring other siblings */
.list > :nth-child(even of .item) {
  background: #f5f5f5;
}
```

## Follow-up Questions

- Pseudo-class vs pseudo-element? A pseudo-class (`:hover`, `:focus-visible`,
  `:nth-child()`) selects an element by its state or position, counts as a
  class. A pseudo-element (`::before`, `::placeholder`, `::marker`) styles a
  part of the element or creates a virtual one, counts as a type; double colon.
- Is `:has()` a parent selector? More than that: it can look at descendants,
  children and following siblings, so it also works as a "previous sibling"
  selector.
- How does the browser match selectors? Right to left, from the rightmost part:
  `.nav li a` first finds every `a`, then checks its ancestors. So the rightmost
  part should reject most elements: a single `.nav-link` is cheaper than
  `.nav li a`.
- `:is()` vs `:where()`? Both take a selector list and match any of it; they
  differ only in specificity, see [Specificity](./cascade.md#specificity).
  `:where()` is for resets and library styles that should be easy to override;
  `:is()` shortens long selector lists.

## Common Mistakes

- Expecting `.item:nth-of-type(2)` to count only `.item`s: it counts siblings
  with the same tag; use `:nth-child(2 of .item)`.
- Expecting `.item:last-child` to match the last `.item` when another element
  comes after it: it matches only the last child of the parent.
- Removing the focus outline with `:focus { outline: none }`: keyboard users
  lose track of the focus. Style `:focus-visible` instead.

## See Also

- [Specificity and the Cascade](./cascade.md)
- [Web Accessibility](../web-platform/accessibility/accessibility.md): focus and
  keyboard navigation
- [MDN: CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
