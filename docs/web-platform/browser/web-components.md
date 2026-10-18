---
sidebar_position: 6
description:
  Custom elements, Shadow DOM, templates and slots, what crosses the shadow
  boundary, Declarative Shadow DOM, forms, Web Components with frameworks
tags: [middle, senior]
---

# Web Components and Shadow DOM

**Web Components** are browser standards for creating your own HTML elements
without a framework:

- **Custom elements**: `customElements.define('my-counter', MyCounter)`
  registers a class that extends `HTMLElement`, with lifecycle callbacks.
- **Shadow DOM**: a hidden DOM tree attached to an element. Its markup and
  styles are **encapsulated**: page CSS does not reach inside, its CSS does not
  leak out.
- **`<template>` and `<slot>`**: inert markup to clone, and placeholders where
  the element's children (the light DOM) are shown.

They work in any framework or none, which makes them a fit for design systems
shared between teams and for widgets embedded in other sites.

## Details

### Custom Elements

- The name must contain a **hyphen** and start with a lowercase letter
  (`user-card`), so it never clashes with a future HTML element.
- Lifecycle: `constructor` (call `super()` first; no attributes or children
  yet), `connectedCallback` (inserted into the document; may run again after a
  move), `disconnectedCallback` (removed: clean up listeners and timers),
  `attributeChangedCallback(name, oldValue, newValue)` for the attributes listed
  in `static observedAttributes`, `adoptedCallback` (moved to another document).
- Elements in the HTML before `define()` are upgraded when it runs; until then
  they match `:not(:defined)`, which is used to hide them, and
  `customElements.whenDefined(name)` returns a promise.
- **Autonomous** elements extend `HTMLElement` (`<my-button>`). **Customized
  built-ins** extend a native element (`<button is="my-button">`), but Safari
  does not support them, so in practice only autonomous elements are used.
- Attributes are strings; rich data (objects, arrays) is passed through
  **properties**. A common pattern is to reflect simple properties to
  attributes.

### Shadow DOM

- `this.attachShadow({ mode: 'open' })` creates the shadow root. `open` exposes
  it as `element.shadowRoot`; `closed` returns `null` there. `closed` is not a
  security boundary: it only makes testing and styling harder.
- What crosses the boundary into the shadow tree:

| Gets through                                                                  | Does not get through                                       |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Inherited properties: `color`, `font`, `line-height`                          | Page selectors: `.button` does not match inside            |
| **CSS custom properties** (`--accent`): the main theming tool                 | Page `id`s: `getElementById`, `<label for>`                |
| Elements marked with `part="label"`, styled from outside with `::part(label)` | Shadow styles do not leak out to the page                  |
| Events, retargeted to the host                                                | ARIA ID references (`aria-labelledby`, `aria-describedby`) |

- Inside: `:host` styles the element itself (`:host([disabled])` by an
  attribute), `::slotted(p)` styles the slotted children (only top-level ones).
  Page styles for slotted children win, because those children stay in the light
  DOM.
- **Constructed stylesheets**: `new CSSStyleSheet()` + `replaceSync(css)`,
  assigned to `shadowRoot.adoptedStyleSheets`, are shared by all instances
  instead of a `<style>` copy in each.
- **Events** that come out of the shadow tree are retargeted to the host. A
  custom event crosses the boundary only with `composed: true` (and
  `bubbles: true` to bubble). See [DOM Events](./events.md).

### Declarative Shadow DOM

- `<template shadowrootmode="open">` inside an element makes the HTML parser
  attach the shadow root, without JavaScript. This is how Web Components are
  **server-rendered**: the content is visible before the script loads, and the
  class then hydrates it.
- It works only in parsed HTML: `innerHTML` ignores it, while `setHTMLUnsafe()`
  and `Document.parseHTMLUnsafe()` support it.

### Forms and Accessibility

- A custom input does not take part in a `<form>` by itself.
  `static formAssociated = true` and `this.internals = this.attachInternals()`
  make it one: `internals.setFormValue()`, `internals.setValidity()`, `<label>`
  and `form.reset()` work.
- `ElementInternals` also sets the default role and ARIA properties
  (`internals.role = 'button'`) without attributes on the host.
- ARIA references by `id` do not cross the shadow boundary in either direction.
  Keep the label and the control in the same tree, or use `aria-label`. See
  [Web Accessibility](../accessibility/accessibility.md).

### With Frameworks

- React 19 sets props on a custom element as **properties** when the element has
  such a property, and listens to custom events through `on` + the exact event
  name (`oncount-change` for `count-change`). See
  [What's New in React 19](../../react/react-19.md).
- Lit and Stencil are thin libraries that add reactive properties and templating
  on top of the standard.
- Scoped registries (`new CustomElementRegistry()`) let two versions of one
  element coexist on a page, so far not in Firefox.

Support: custom elements, Shadow DOM, `<template>`, `<slot>`, `::part`,
constructed stylesheets, form-associated elements and Declarative Shadow DOM are
Baseline.

## Example

A counter with a shadow root, a slot for the label and an observed attribute:

```javascript
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host { display: inline-flex; gap: 0.5em; align-items: center; }
  button { color: var(--counter-accent, royalblue); }
`);

class MyCounter extends HTMLElement {
  static observedAttributes = ['count'];

  constructor() {
    super();
    // highlight-next-line
    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [sheet];
    root.innerHTML = `
      <slot>Count</slot>: <output part="value"></output>
      <button type="button">+1</button>
    `;
    root.querySelector('button').addEventListener('click', () => {
      this.count += 1;
      // Dispatched on the host, so it needs no `composed: true`
      this.dispatchEvent(
        new CustomEvent('count-change', { detail: this.count, bubbles: true })
      );
    });
  }

  get count() {
    return Number(this.getAttribute('count') ?? 0);
  }

  set count(value) {
    this.setAttribute('count', String(value)); // reflects to the attribute
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.querySelector('output').textContent = newValue;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('output').textContent = this.count;
  }
}

customElements.define('my-counter', MyCounter);
```

```html
<style>
  my-counter {
    --counter-accent: crimson; /* custom properties get inside */
  }
  my-counter::part(value) {
    font-weight: bold;
  }
</style>

<my-counter count="3">Clicks</my-counter>
```

## Follow-up Questions

- Shadow DOM or CSS Modules for isolation? CSS Modules only rename classes at
  build time; Shadow DOM isolates in the browser in both directions, but makes
  theming harder: only custom properties and `::part` get in.
- Why can a custom element not read its attributes in the constructor? When it
  is created with `document.createElement`, it has none yet. Read them in
  `connectedCallback` or `attributeChangedCallback`.
- What happens to `document.querySelector` for elements inside a shadow root? It
  does not find them; query `element.shadowRoot` instead.
- Why do Web Components and SSR not mix well? Without Declarative Shadow DOM the
  shadow content exists only after the script runs, so the server HTML is empty.
- When are Web Components worse than React components? Inside a single React
  app: passing data, composing and server rendering are simpler with the
  framework's own components.

## Common Mistakes

- A name without a hyphen: `define()` throws `SyntaxError`.
- Passing objects through attributes: they become `"[object Object]"`.
- Not cleaning up in `disconnectedCallback`: listeners on `window` and timers
  keep working after the element is removed.
- Expecting page CSS classes to style the inside of the component.
- Dispatching a custom event without `composed: true` from inside the shadow
  tree and wondering why the page does not get it.

## See Also

- [DOM Events](./events.md)
- [Web Accessibility](../accessibility/accessibility.md)
- [What's New in React 19](../../react/react-19.md)
