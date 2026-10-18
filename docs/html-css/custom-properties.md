---
sidebar_position: 8
description:
  CSS variables, var() with a fallback, cascade and inheritance, invalid at
  computed-value time, @property, theming with light-dark() and color-mix(), vs
  Sass variables
tags: [junior, middle]
---

# CSS Custom Properties

**Custom properties** (CSS variables) are properties whose names start with
`--`; their value is read with **`var(--name, fallback)`**. Unlike Sass
variables, they are **live**: they take part in the **cascade and inheritance**,
can be redefined for any element, inside media queries or from JavaScript, and
the browser substitutes them when it computes styles. That makes them the basis
for themes and component variants.

## Details

### How They Work

- Declared like any property, usually on `:root` for global values:
  `:root { --brand: #0062ff; }`. Names are case-sensitive.
- **Inherited** by default: a value set on a container applies to everything
  inside, and a nested element can override it.
- The value is a raw token sequence with no type; it is substituted into the
  property that uses it when the computed value is calculated.
- `var()` works only in property values: not in selectors, property names or
  media query conditions (`@media (width > var(--bp))` does not work).
- The fallback is used only when the variable is **not defined** (or set to
  `initial`), not when its value is wrong for the property. Fallbacks can nest:
  `var(--button-bg, var(--brand, blue))`.

### Invalid at Computed-Value Time

At parse time the browser cannot know what a variable will contain, so a
declaration with `var()` is always accepted. If the substituted value is invalid
(`color: var(--size)` with `--size: 20px`), the property becomes **`unset`**: it
inherits or takes its initial value. The earlier valid declaration in the
cascade is **not** used as a fallback.

### From JavaScript

```javascript
const root = document.documentElement;
root.style.setProperty('--sidebar-width', '320px');
getComputedStyle(root).getPropertyValue('--sidebar-width'); // '320px'
```

Changing one variable restyles every element that uses it: no class toggling on
many nodes. Frequent updates on `:root` (for example, the mouse position) make
the browser recalculate styles for the whole page; set them on the element that
needs them.

### `@property`

```css
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
```

Registers a variable with a **type**, an **initial value** and whether it
**inherits**:

- A registered variable can be **animated and transitioned**: the browser knows
  how to interpolate an `<angle>` or a `<color>`. An unregistered one flips at
  50% in an animation and changes at once in a transition, so a gradient angle
  cannot be animated without it.
- A value of the wrong type is replaced with `initial-value` (or the inherited
  value when `inherits: true`), so the properties that use it still get a valid
  value.
- `inherits: false`: the value exists only on the element where it is set;
  children get `initial-value`. It suits per-element values such as an animated
  angle, not scoping a component's tokens.
- JavaScript equivalent: `CSS.registerProperty()`. Browser support:
  Baseline 2024.

### Theming

- **Variables per theme**: define colors as variables on `:root` and redefine
  them under `[data-theme='dark']` or in `@media (prefers-color-scheme: dark)`.
  Components use only the variables.
- **`light-dark(light, dark)`** picks one of two colors depending on the
  element's **`color-scheme`**; it needs `color-scheme: light dark` (follow the
  system) or a fixed `light` / `dark`. Switching a theme is then one property.
- `color-scheme` also switches the browser's own UI: scrollbars, form controls,
  the default background.
- **`color-mix(in oklch, var(--brand) 80%, black)`** mixes two colors in a color
  space: hover and disabled shades from one brand color, without hand-picked hex
  values. `oklch` gives evenly perceived results; `srgb` can look gray in the
  middle.

### Custom Properties vs Sass Variables

|                                      | CSS custom properties      | Sass variables `$x`                 |
| ------------------------------------ | -------------------------- | ----------------------------------- |
| When resolved                        | in the browser, at runtime | at build time; gone from the output |
| Cascade and inheritance              | yes, per element           | no; scoped by Sass blocks           |
| Change in a media query              | yes                        | no: the value is already in the CSS |
| Change from JavaScript               | yes                        | no                                  |
| In selectors, media query conditions | no                         | yes                                 |
| Math and functions                   | `calc()`, `color-mix()`    | Sass functions, loops, maps         |

They combine: Sass for build-time logic, custom properties for anything that
changes at runtime (themes, component variants).

## Example

```css
:root {
  color-scheme: light dark; /* follows the system */
  --brand: #0062ff;
  --surface: light-dark(#ffffff, #121212);
  --text: light-dark(#1a1a1a, #eeeeee);
}
/* A user choice overrides the system */
:root[data-theme='dark'] {
  color-scheme: dark;
}
:root[data-theme='light'] {
  color-scheme: light;
}

.button {
  /* highlight-next-line */
  --button-bg: var(--brand);
  background: var(--button-bg);
  color: white;
}
.button:hover {
  background: color-mix(in oklch, var(--button-bg) 85%, black);
}
/* A variant changes the variable, not the rules */
.button.danger {
  --button-bg: crimson;
}

body {
  background: var(--surface);
  color: var(--text);
}
```

<details>
<summary>Animating a gradient with `@property`</summary>

```css
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.spinner-border {
  background: conic-gradient(from var(--angle), #0062ff, transparent);
  animation: spin 2s linear infinite;
}

@keyframes spin {
  to {
    --angle: 360deg;
  }
}
```

Without the `@property` rule, `--angle` jumps from `0deg` to `360deg` once in
the middle of the animation, and the gradient does not rotate.

</details>

## Follow-up Questions

- Can a variable hold a plain number? Yes; multiply to get a length:
  `--n: 10; width: calc(var(--n) * 1px)`.
- Why `:root` and not `html`? It is the same element, but `:root` has class
  specificity (0, 1, 0), so its values survive an `html { … }` rule.

- How do you make a variable available only inside a component? Declare it on
  the component's root class instead of `:root`; it is inherited only by that
  component's subtree.
- How do you avoid the dark theme flash on page load? Set `data-theme` (or
  `color-scheme`) before the first paint: an inline script in `<head>` that
  reads the saved choice, or a server-rendered attribute from a cookie.
- Can a variable hold part of a value? Yes, any tokens: `--shadow-color: 0 0 0`
  and then `rgb(var(--shadow-color) / 0.2)`.

## Common Mistakes

- Expecting the fallback in `var()` to protect against a value of the wrong
  type.
- `light-dark()` without `color-scheme`: the light value is always used.
- Trying to use a variable in a media query condition.
- Animating an unregistered variable and expecting a smooth transition.
- "CSS variables are just Sass variables in the browser": they cascade, inherit
  and change at runtime.

## See Also

- [Specificity and the Cascade](./cascade.md)
- [Responsive Design](./responsive-design.md): `prefers-color-scheme`
- [CSS Transitions and Animations](./animations.md)
- [Styling in React](../react/ecosystem/styling.md): Sass, CSS Modules,
  CSS-in-JS
- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
