---
sidebar_position: 2
description:
  Selectors in brief, cascade order, specificity, :is() / :where() / :has(),
  nesting, @layer, inheritance and the inherit / initial / unset / revert
  keywords
tags: [junior, middle]
---

# Specificity and the Cascade

When several declarations set the same property on an element, the **cascade**
picks one. It compares, in this order:

1. **Origin and importance**: browser, user and author styles; `!important`
   reverses their order.
2. The **`style` attribute** beats any selector.
3. **Cascade layers** (`@layer`): later layers win; unlayered styles beat all
   layers (without `!important`).
4. **Specificity**: (id, class, type), compared left to right.
5. **Source order**: the last declaration wins.

A property that is not set at all is **inherited** from the parent (text
properties such as `color`, `font`) or takes its **initial value** (`margin`,
`border`).

## Details

### Selectors in Brief

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

- `:nth-child(2)` counts all siblings; `:nth-of-type(2)` counts only siblings
  with the same tag.
- `:focus-visible` matches focus the browser would show a ring for (keyboard
  navigation, text fields), not a mouse click on a button; `:focus-within`
  matches an element that has focus or contains the focused element.
- `::before` and `::after` render only with `content` (`content: ''` for a
  decorative box); they do not work on replaced elements (`<img>`, `<video>`,
  most `<input>`s).

### Specificity

Specificity is three numbers, **(A, B, C)**, compared left to right: one id
beats any number of classes.

| Counts as                                                          | Example                               | Specificity |
| ------------------------------------------------------------------ | ------------------------------------- | ----------- |
| **A**: id                                                          | `#header`                             | (1, 0, 0)   |
| **B**: class, attribute, pseudo-class                              | `.btn`, `[type='text']`, `:hover`     | (0, 1, 0)   |
| **C**: type, pseudo-element                                        | `p`, `::before`                       | (0, 0, 1)   |
| Nothing: `*`, combinators (`>`, `+`, `~`, space)                   | `ul > li`: only the two types count   | (0, 0, 2)   |
| `:is()`, `:not()`, `:has()`: their **most specific** argument      | `:is(#a, .b) p`                       | (1, 0, 1)   |
| `:where()`: always zero                                            | `:where(#a, .b) p`                    | (0, 0, 1)   |
| Nesting `&`: like `:is()` around the parent selector               | `#a, .b { & p {} }` = `:is(#a, .b) p` | (1, 0, 1)   |
| `:nth-child(… of S)`: the pseudo-class plus the most specific in S | `:nth-child(2 of .item)`              | (0, 2, 0)   |

- The **`style` attribute** is not specificity: it is a separate, earlier step
  of the cascade and beats any selector without `!important`.
- `:where()` is for library and reset styles that any user selector should be
  able to override.
- Because nesting works like `:is()`, `&` takes the specificity of the most
  specific selector in the parent list, even for elements matched by the less
  specific one.

### Origin and `!important`

From the weakest to the strongest:

1. Browser (user-agent) styles.
2. User styles (browser settings, a user stylesheet).
3. Author styles: the site's CSS.
4. CSS animations (`@keyframes`).
5. Author `!important`.
6. User `!important`.
7. Browser `!important`.
8. CSS transitions.

`!important` lifts a declaration into a separate, stronger group, and inside it
the order of origins is **reversed**: user `!important` beats author
`!important`, so the user's accessibility settings win.

### Cascade Layers

```css
@layer reset, base, components, utilities;
```

- Layers are ordered by first appearance; one `@layer a, b, c;` statement up
  front fixes the order. Later layers win, whatever the specificity inside them:
  `.btn` in `utilities` beats `#id .btn` in `components`.
- **Unlayered styles beat all layers.** Third-party CSS can be put into a low
  layer with `@import url(lib.css) layer(vendor);`.
- **`!important` reverses the order of layers**: an `!important` declaration in
  the earliest layer wins, and layered `!important` beats unlayered
  `!important`. This lets a reset protect a rule that must not be overridden.
- Nested layers (`@layer components.button`) and anonymous layers are possible.

### `@scope`

`@scope (.card) to (.card-content) { img { … } }` applies the rules only inside
`.card` but not inside `.card-content` (the limit itself is excluded too); when
specificity is equal, the rule from the closer scope root wins (this step comes
before source order). Browser support: Baseline 2026, newly available.

### Inheritance and the Global Keywords

- **Inherited** properties: mostly text — `color`, `font-*`, `line-height`,
  `text-align`, `visibility`, `cursor`, and all custom properties. **Not
  inherited**: box and layout — `margin`, `padding`, `border`, `width`,
  `background`, `display`, `position`.
- Form controls do not inherit `font` by default: the browser stylesheet sets
  it. A reset adds `font: inherit` to `button, input, select, textarea`.

| Keyword        | Value                                                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `inherit`      | the parent's computed value                                                                                                  |
| `initial`      | the initial value from the spec (`display: initial` is `inline`)                                                             |
| `unset`        | `inherit` for an inherited property, `initial` for the rest                                                                  |
| `revert`       | rolls back to the previous origin: usually the browser's default style                                                       |
| `revert-layer` | rolls back to the previous cascade layer (from unlayered styles, to the layered ones); with no layer left, works as `revert` |
| `all: …`       | sets every property except `direction`, `unicode-bidi` and custom ones                                                       |

## Example

```css
@layer base, components;

@layer components {
  /* (1, 1, 0), but loses to .btn below: unlayered styles beat layers */
  #app .btn {
    color: red;
  }
}

/* Unlayered: beats the layered rule despite lower specificity */
/* highlight-next-line */
.btn {
  color: green;
  padding: 4px;
}

/* (0, 1, 1): beats .btn (0, 1, 0), so the padding is 8px */
button.btn {
  padding: 8px;
}

/* (0, 0, 1): any class overrides it */
:where(.card, .panel) button {
  font-weight: bold;
}
```

<details>
<summary>`:has()` as a parent selector</summary>

```css
/* A card that contains an image */
.card:has(img) {
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
```

</details>

## Follow-up Questions

- Pseudo-class vs pseudo-element? A pseudo-class (`:hover`, `:focus-visible`,
  `:nth-child()`) selects an element in a state, counts as a class. A
  pseudo-element (`::before`, `::placeholder`, `::marker`) styles a part of the
  element or creates a virtual one, counts as a type; double colon.
- Is `:has()` a parent selector? More than that: it selects an element by
  anything relative to it — descendants, children (`:has(> img)`), following
  siblings (`:has(+ input)`). It cannot be nested inside another `:has()`, and
  pseudo-elements are not allowed inside it.
- Why avoid `!important`? Only another `!important` can beat it (more specific,
  later in the source or in an earlier layer), so it escalates. Layers and
  `:where()` solve the same problem; `!important` stays for utilities and
  overriding third-party inline styles.
- What is the specificity of `nav ul li a.active:hover`? (0, 2, 4). Of
  `#main :not(.x) p`? (1, 1, 1).
- How does the browser match selectors? Right to left, from the rightmost part:
  `.nav li a` first finds every `a`, then checks its ancestors. So the rightmost
  part should reject most elements: a single `.nav-link` is cheaper than
  `.nav li a`.

## Common Mistakes

- "Specificity is a single number: id 100, class 10." The columns never overflow
  into each other.
- "A higher layer loses to more specific selectors in a lower layer." Layer
  order is checked before specificity.
- "Inline styles have specificity (1, 0, 0, 0)." They are a separate step of the
  cascade; the result is the same, but it explains why layers do not affect
  them.
- Expecting `!important` in a later layer to win: with `!important` the earlier
  layer wins.
- Expecting `.item:nth-of-type(2)` to count only `.item`s: it counts siblings
  with the same tag; use `:nth-child(2 of .item)`.

## See Also

- [Box Model](./box-model.md)
- [CSS Custom Properties](./custom-properties.md)
- [Styling in React](../react/ecosystem/styling.md): CSS Modules, BEM, CSS-in-JS
- [MDN: Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade)
