---
sidebar_position: 2
description: CSS Modules, Tailwind, CSS-in-JS and Sass compared
tags: [middle]
---

# Styling Approaches

The main approaches are **CSS Modules**, **utility classes** (Tailwind),
**runtime CSS-in-JS** (styled-components, Emotion) and zero-runtime CSS-in-JS.
They differ in two things: how styles are **scoped** to a component and whether
they cost anything at **runtime**. A safe default is CSS Modules or Tailwind:
both produce static CSS files and have no runtime. Runtime CSS-in-JS is chosen
when styles depend heavily on props or a theme.

Applies to: Tailwind CSS 4, styled-components 6.

## Details

### Comparison

| Approach                                           | Scoping                               | Runtime cost | How props change styles                              |
| -------------------------------------------------- | ------------------------------------- | ------------ | ---------------------------------------------------- |
| Plain CSS or Sass with a naming convention (BEM)   | none, only the convention             | none         | class names                                          |
| **CSS Modules**                                    | class names made unique at build time | none         | class names, CSS variables                           |
| **Utility classes** (Tailwind CSS)                 | no custom class names at all          | none         | class names                                          |
| **Runtime CSS-in-JS** (styled-components, Emotion) | generated class names                 | yes          | JavaScript in the styles                             |
| Zero-runtime CSS-in-JS (vanilla-extract)           | generated class names                 | none         | variants, CSS variables                              |
| Inline `style`                                     | one element                           | none         | the style object; no pseudo-classes or media queries |

### CSS Modules

- A file named `*.module.css` is imported as an object; every class name in it
  is replaced with a unique one, so the styles of two components cannot clash.
- It is a feature of the bundler, not of the browser. Vite and Next.js support
  it out of the box.
- Dynamic styles: switch class names, or pass a value through a CSS variable in
  the `style` prop.

### Tailwind CSS

- Styles are composed in the markup from utility classes: `flex`, `px-4`,
  `hover:bg-blue-600`, `md:hidden`.
- The CSS file is generated at build time: Tailwind scans the source files as
  plain text and emits only the classes it finds.
- Pros: no naming, values come from one design scale, the CSS stays small.
- Cons: long class lists in the markup; repeated sets of classes have to be
  extracted into components.
- Since version 4 the configuration is written in CSS (`@theme`). A
  `tailwind.config.js` still works, but only when loaded with `@config`.

### Runtime CSS-in-JS

- Styles are written in JavaScript next to the component and can use props and a
  theme directly.
- Cons: the styles are computed and inserted while the component renders, the
  library adds to the bundle, and server rendering needs extra setup.
- **Server Components** are a poor fit, because these libraries rely on React
  context. Emotion works only in Client Components (`'use client'`);
  styled-components 6.3+ renders in Server Components, but without
  `ThemeProvider`.
- styled-components has been in maintenance mode since 2025: it still gets
  releases, but is rarely chosen for new projects.
- Zero-runtime libraries keep the styles in TypeScript but extract them into CSS
  files at build time.

### Sass

- A preprocessor: variables, nesting, mixins and functions that compile to plain
  CSS.
- It is a layer on top of plain CSS or CSS Modules (`*.module.scss`), not a way
  of scoping. Tailwind 4 is not designed to be used with it.
- Native CSS now has custom properties and nesting, so a preprocessor is needed
  less often. See
  [Custom Properties vs Sass Variables](../../html-css/custom-properties.md#custom-properties-vs-sass-variables).

### React Native

There is no CSS in React Native: styles are JavaScript objects. See
[StyleSheet](../../react-native/stylesheet.md). `styled-components/native` and
NativeWind add CSS-in-JS and Tailwind syntax on top of it.

## Example

The same button with CSS Modules:

```css title="Button.module.css"
.button {
  padding: 8px 16px;
  background: gray;
}

.primary {
  background: royalblue;
}
```

```jsx title="Button.jsx (CSS Modules)"
import styles from './Button.module.css';

function Button({ primary, children }) {
  const className = primary
    ? `${styles.button} ${styles.primary}`
    : styles.button;

  return <button className={className}>{children}</button>;
}
```

And with styled-components:

```jsx title="Button.jsx (styled-components)"
import styled from 'styled-components';

// The $ prefix keeps the prop from being passed to the DOM element
const Button = styled.button`
  padding: 8px 16px;
  background: ${({ $primary }) => ($primary ? 'royalblue' : 'gray')};
`;

// <Button $primary>Save</Button>
```

## Follow-up Questions

- How do you choose? By the constraints of the project: Server Components make
  runtime CSS-in-JS a poor fit; a design system with fixed tokens fits Tailwind;
  a team that prefers regular CSS picks CSS Modules.
- How do you make a dark theme without CSS-in-JS? With CSS custom properties:
  the variables are redefined under a selector such as `[data-theme='dark']`.
  See [Theming](../../html-css/custom-properties.md#theming).
- Why is runtime CSS-in-JS slower? The styles are serialized and inserted into
  the document during rendering, whenever the props they depend on change.

## Common Mistakes

- Building Tailwind class names dynamically, such as `` `bg-${color}-500` ``:
  Tailwind scans the source as plain text and never runs it, so this class is
  not generated. Map values to complete class names instead.
- "Tailwind is the same as inline styles." Utility classes support hover, media
  queries and a shared scale of values; the `style` attribute does not.
- "CSS Modules are a browser feature." The class names are rewritten by the
  bundler.

## See Also

- [StyleSheet in React Native](../../react-native/stylesheet.md)
- [Bundle Optimization](../../web-platform/performance/bundle-optimization.md)
