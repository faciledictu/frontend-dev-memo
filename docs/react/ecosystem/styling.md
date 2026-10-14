---
sidebar_position: 4
description: CSS Modules, Tailwind, CSS-in-JS and Sass - how they differ
---

# Styling Approaches

The approaches differ in two things: how styles are **scoped** to a component
and whether they cost anything at **runtime**.

| Approach                                            | Scoping                               | Runtime cost | Styles depend on props through |
| --------------------------------------------------- | ------------------------------------- | ------------ | ------------------------------ |
| Plain CSS or Sass with a naming convention (BEM)    | none, only the convention             | none         | class names                    |
| **CSS Modules**                                     | class names made unique at build time | none         | class names, CSS variables     |
| **Utility classes** (Tailwind CSS)                  | no custom class names at all          | none         | class names                    |
| **Runtime CSS-in-JS** (styled-components, Emotion)  | generated class names                 | yes          | JavaScript in the styles       |
| Zero-runtime CSS-in-JS (vanilla-extract, Panda CSS) | generated class names                 | none         | variants, CSS variables        |

A safe default is CSS Modules or Tailwind: both produce plain CSS files and work
with Server Components.

## Details

### CSS Modules

- A file named `*.module.css` is imported as an object; every class name in it
  is replaced with a unique one, so styles of two components cannot clash.
- It is a feature of the bundler, not of the browser. Vite and Next.js support
  it out of the box.
- Dynamic styles: switch class names, or pass a value through a CSS variable in
  the `style` prop.

### Tailwind CSS

- Styles are composed in the markup from utility classes: `flex`, `px-4`,
  `hover:bg-blue-600`, `md:hidden`.
- The CSS file is generated at build time and contains only the classes found in
  the source code.
- Pros: no naming, values come from one design scale, the CSS stays small.
- Cons: long class lists in the markup; repeated sets of classes have to be
  moved into components.
- Since version 4 the configuration is written in CSS (`@theme`); a
  `tailwind.config.js` file is not required.

### Runtime CSS-in-JS

- Styles are written in JavaScript next to the component and can use props and a
  theme directly.
- Cons: the styles are computed and inserted while the component renders, the
  library adds to the bundle, and server rendering needs extra setup.
- It does **not work in Server Components**: such components must be marked
  `'use client'`.
- Zero-runtime libraries keep the syntax in TypeScript but extract the styles
  into CSS files at build time.

### Sass

- A preprocessor: variables, nesting, mixins and functions that compile to plain
  CSS.
- It is not an alternative to the approaches above: it is combined with them,
  for example `*.module.scss`.
- Native CSS now has custom properties and nesting, so a preprocessor is needed
  less often.

### React Native

There is no CSS in React Native: styles are JavaScript objects. See
[StyleSheet](../../react-native/stylesheet.md). `styled-components/native` and
NativeWind bring CSS-in-JS and Tailwind syntax on top of it.

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

```jsx title="Button.jsx"
import styles from './Button.module.css';

function Button({ primary, children }) {
  const className = primary
    ? `${styles.button} ${styles.primary}`
    : styles.button;

  return <button className={className}>{children}</button>;
}
```

And with styled-components:

```jsx title="Button.jsx"
import styled from 'styled-components';

// The $ prefix keeps the prop from being passed to the DOM element
const Button = styled.button`
  padding: 8px 16px;
  background: ${({ $primary }) => ($primary ? 'royalblue' : 'gray')};
`;

// <Button $primary>Save</Button>
```

## Follow-up Questions

- How do you choose? By the constraints of the project: Server Components rule
  out runtime CSS-in-JS; a design system with fixed tokens fits Tailwind; a team
  that prefers regular CSS takes CSS Modules.
- How do you make a dark theme without CSS-in-JS? With CSS custom properties:
  the variables are redefined under a selector such as `[data-theme='dark']`.
- Why is runtime CSS-in-JS slower? The styles are serialized and inserted into
  the document during rendering, on every change of the props they depend on.

## Common Mistakes

- Building Tailwind class names dynamically, such as `` `bg-${color}-500` ``:
  Tailwind looks for complete class names in the source and will not generate
  this one.
- "Tailwind is the same as inline styles." Utility classes support hover, media
  queries and a shared scale of values; the `style` attribute does not.
- "CSS Modules are a browser feature." The class names are rewritten by the
  bundler.

## See Also

- [HTML](../../html-css/html.md)
- [Bundle Optimization](../../web-platform/tools/bundle-optimization.md)
