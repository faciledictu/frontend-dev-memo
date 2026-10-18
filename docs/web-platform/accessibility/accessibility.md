---
sidebar_position: 1
description:
  WCAG and its levels, semantic HTML, accessible names, keyboard and focus, ARIA
  rules, contrast, testing
tags: [junior, middle]
---

# Web Accessibility

**Accessibility** (a11y) means that people with disabilities can use the site:
with a **screen reader**, with the **keyboard only**, with low vision or color
blindness, with motor or cognitive impairments. The standard is **WCAG** (Web
Content Accessibility Guidelines) 2.2; the usual target, and what laws such as
the European Accessibility Act and the ADA require, is level **AA**. The basics:

- **Semantic HTML** first: a `<button>` for actions, `<a href>` for links,
  headings, landmarks, `<label>` for fields.
- Everything works **from the keyboard**, with a **visible focus**.
- **Text alternatives** for images and icons, enough **color contrast**.
- **ARIA** only where HTML has no suitable element.

## Details

### WCAG

- Four principles, **POUR**: Perceivable, Operable, Understandable, Robust.
- Three levels: **A** (the minimum), **AA** (the usual target), **AAA** (not
  required for whole sites).
- Laws currently point at WCAG 2.1 AA: the European Accessibility Act (in force
  since June 2025, through the EN 301 549 standard) and the ADA rules in the US.

### Semantics and Accessible Names

- Native elements bring the **role**, the keyboard behavior and the focus with
  them: a `<button>` is focusable and reacts to Enter and Space, a `<div>` is
  not. See [HTML](../../html-css/html.md#semantic-markup).
- Landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) and a heading outline
  let screen reader users jump through the page.
- Every interactive element needs an **accessible name**: the text of a button,
  a `<label>` of an input, `aria-label` or `aria-labelledby` for an icon button.
  A `placeholder` is not a label: it disappears while typing.
- `<html lang="…">`, so that the screen reader picks the right language.
- Images: `alt` with the meaning of the image; `alt=""` for decorative ones.
- Errors in forms: linked to the field with `aria-describedby`, the field marked
  with `aria-invalid="true"`, not shown by color alone.

### Keyboard and Focus

- Tab order follows the DOM order. Do not rearrange it visually with CSS
  (`order`, absolute positioning) so that it no longer matches, see
  [Flexbox](../../html-css/flexbox.md#order-and-accessibility).
- `tabindex="0"` adds a custom element to the Tab order; `tabindex="-1"` makes
  it focusable only from code. A positive `tabindex` breaks the order.
- Never remove the outline without a replacement: style `:focus-visible`
  instead, see
  [CSS Selectors](../../html-css/selectors.md#state-pseudo-classes).
- **Modals**: trap the focus, close on Esc, return the focus; `<dialog>` with
  `showModal()` does most of it. See [Portals](../../react/basics/portals.md).
- **SPA navigation**: after a route change, move the focus to the new heading or
  announce the new page; otherwise a screen reader user does not notice the
  change.
- A **skip link** ("Skip to content") as the first focusable element.

### ARIA

ARIA attributes change only what assistive technology is told, not how the
element behaves: `role="button"` on a `<div>` does not make it focusable or
clickable from the keyboard.

- **The first rule of ARIA**: do not use it if a native element or attribute
  does the job. No ARIA is better than wrong ARIA.
- **States**: `aria-expanded`, `aria-pressed`, `aria-checked`, `aria-selected`,
  `aria-current="page"`. They must be updated together with the UI.
- **Relations**: `aria-labelledby`, `aria-describedby`, `aria-controls`.
- **Live regions**: `aria-live="polite"` or `role="status"` for messages that
  appear without a focus change ("Saved"); `role="alert"` for urgent ones. The
  region must exist in the DOM before its text changes.
- `aria-hidden="true"` hides decorative content from screen readers. Never put
  it on a focusable element.
- For custom widgets (tabs, combobox, menu), follow the patterns of the **ARIA
  Authoring Practices Guide**, including the keyboard behavior.

### Visual

| Requirement (AA) | Value                                                          |
| ---------------- | -------------------------------------------------------------- |
| Text contrast    | **4.5:1**, large text (24 px, or 18.66 px bold) **3:1**        |
| UI components    | 3:1 for borders of fields, icons, focus indicators             |
| Color            | not the only way to convey information (errors, links, charts) |
| Zoom and reflow  | usable at 200% zoom and at a width of 320 CSS px               |
| Target size      | at least 24 × 24 CSS px (new in WCAG 2.2)                      |

Respect user settings: `prefers-reduced-motion` for
[animations](../../html-css/animations.md), sizes in `rem` so that the font size
set in the browser is applied.

### Testing

- Automated: **axe** (browser extension, `@axe-core/playwright`), Lighthouse,
  `eslint-plugin-jsx-a11y`. They find only part of the problems.
- Manual: go through the page with **Tab only**; check with a screen reader
  (VoiceOver on macOS and iOS, NVDA on Windows, TalkBack on Android).
- In tests, query by role (`getByRole('button', { name: 'Save' })`): the test
  fails if the element loses its role or its name. See
  [Testing React](../../react/ecosystem/testing.md).

## Example

```jsx
function Toolbar({ onSave, onClose }) {
  return (
    <>
      {/* error-start */}
      {/* Not focusable, no role, does not react to Enter or Space */}
      <div className="button" onClick={onSave}>
        Save
      </div>
      {/* error-end */}
      {/* correct-next-line */}
      <button onClick={onSave}>Save</button>

      {/* error-start */}
      {/* Announced as just "button" */}
      <button onClick={onClose}>
        <CloseIcon />
      </button>
      {/* error-end */}
      {/* correct-start */}
      <button onClick={onClose} aria-label="Close">
        <CloseIcon aria-hidden="true" />
      </button>
      {/* correct-end */}
    </>
  );
}
```

A field with a label and an error message linked to it:

```html
<label for="email">Email</label>
<input
  id="email"
  type="email"
  autocomplete="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<!-- highlight-next-line -->
<p id="email-error">Enter an email like name@example.com</p>
```

## Follow-up Questions

- Why not `<div role="button">`? The role only names it for screen readers;
  focus (`tabindex="0"`) and the Enter and Space keys have to be added by hand.
  A `<button>` has it all.
- What is the difference between `aria-label` and `aria-labelledby`? The first
  is a string; the second points to the IDs of elements whose text is the name.
  Both override the visible text, so the visible label should be part of the
  name.
- `display: none`, `visibility: hidden`, `aria-hidden`, a visually hidden class:
  what is hidden from whom? The first two hide from everyone; the third hides
  only from assistive technology; the `sr-only` class hides only visually, the
  text is still read.
- What is the accessibility tree? A tree of roles, names and states that the
  browser builds from the DOM and ARIA. Assistive technology reads it, not the
  DOM; DevTools shows it in the Accessibility pane.
- How do you announce "Item added to cart" without moving the focus? A live
  region: `role="status"`.

## Common Mistakes

- "Accessibility is for screen readers." It also covers the keyboard, contrast,
  zoom, motion and clear language.
- `outline: none` without a replacement focus style.
- Adding ARIA to fix a `<div>` instead of using the native element.
- "Lighthouse shows 100, so the site is accessible." Automated checks find only
  part of the problems; keyboard and screen reader testing are needed.
- Images with `alt="image"` or with the file name.
- `aria-label` on a `<div>` or `<span>` without a role: generic elements cannot
  be named, so screen readers ignore it.

## See Also

- [HTML](../../html-css/html.md)
- [Portals](../../react/basics/portals.md)
- [DOM Events](../browser/events.md)
