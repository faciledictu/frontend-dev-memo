---
sidebar_position: 9
description:
  Transitions vs keyframe animations, why to animate transform and opacity,
  will-change, CSS vs JavaScript animations, reduced motion
tags: [junior, middle]
---

# CSS Transitions and Animations

- A **transition** animates a property **between two states** when its value
  changes: on `:hover`, a class toggle, a new inline style.
- A **keyframe animation** (`@keyframes` + `animation`) runs **on its own**: it
  can have several steps, repeat, and start on page load without a state change.

Animate **`transform` and `opacity`**: the browser can change them on the
compositor, without layout and paint, so they stay smooth even when the main
thread is busy. Animating `width`, `top` or `margin` reruns layout every frame.
Respect **`prefers-reduced-motion`**.

## Details

### Transition vs Animation

|         | `transition`                                            | `animation`                                                               |
| ------- | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| Starts  | when the property value changes                         | when the `animation` property is applied                                  |
| Steps   | from the old value to the new one                       | any number of keyframes                                                   |
| Repeats | no                                                      | `animation-iteration-count: infinite`                                     |
| Reverse | by itself, when the state changes back                  | `animation-direction: reverse` or `alternate`                             |
| Control | duration, timing function, delay, `transition-behavior` | plus `animation-fill-mode`, `animation-play-state`                        |
| Events  | `transitionend`, `transitioncancel`                     | `animationstart`, `animationiteration`, `animationend`, `animationcancel` |

- `animation-fill-mode: forwards` keeps the values of the last keyframe played
  after the animation ends; otherwise the element jumps back to its own styles.
- Timing functions: `ease` (the default in CSS; `element.animate()` defaults to
  `linear`), `linear`, `ease-out` (good for elements that appear),
  `cubic-bezier()`, `steps()` for frame-by-frame animation.

### What to Animate

- **`transform`** (`translate`, `scale`, `rotate`) and **`opacity`** only need
  compositing; colors and shadows need paint; sizes and positions need layout.
  See
  [Reflow and Repaint](../web-platform/browser/browser-workflow.md#reflow-and-repaint).
- **`will-change: transform`** hints that the element is about to change, so the
  browser can prepare a separate layer; it also creates a stacking context. Each
  layer costs memory: use it for a measured problem on the few elements about to
  animate (often set from JS right before and removed after), never on
  everything.
- `display` and other discrete properties are not interpolated. To animate an
  element appearing from `display: none`, use `@starting-style` (the values to
  start from) and the `allow-discrete` keyword in `transition`. Browser support:
  Baseline 2024.
- `height: auto` cannot be transitioned directly. A common workaround is a grid
  wrapper animated from `grid-template-rows: 0fr` to `1fr`, with
  `overflow: hidden` on its only child.
- A custom property that is not registered jumps to the new value at 50% instead
  of interpolating; register it with `@property`, see
  [CSS Custom Properties](./custom-properties.md#property).

### CSS vs JavaScript

- **CSS** for state changes and simple loops: declarative, can run on the
  compositor, needs no code.
- **JavaScript** when an animation depends on input or other animations:
  sequencing, scrubbing, physics, gestures, values computed at runtime; a
  per-frame loop uses `requestAnimationFrame`, not `setTimeout`, see
  [requestAnimationFrame](../web-platform/browser/scheduling.md#requestanimationframe).
- The **Web Animations API** (`element.animate(keyframes, options)`) is the same
  engine as CSS animations, controlled from JavaScript: it returns an
  `Animation` with `pause()`, `reverse()` and a `finished` promise. Motion
  (formerly Framer Motion) is built on it. CSS transitions and animations are
  `Animation` objects too: `element.getAnimations()`.

## Example

```css
.button {
  /* highlight-next-line */
  transition:
    transform 150ms ease-out,
    background-color 150ms;
}
.button:hover {
  transform: translateY(-2px);
  background-color: #004fd1;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.toast {
  animation: fade-in 200ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .button,
  .toast {
    transition: none;
    animation: none;
  }
}
```

Shortening durations to `0.01ms` instead of `none` keeps end states and
`animationend` listeners working; a global version is in
[Responsive Design](./responsive-design.md#user-preferences-and-input).

<details>
<summary>Animating an element that appears from `display: none`</summary>

```css
.popup {
  display: none;
  opacity: 0;
  transition:
    opacity 200ms,
    display 200ms allow-discrete;
}
.popup.open {
  display: block;
  opacity: 1;

  /* Starting values when the element appears */
  /* highlight-start */
  @starting-style {
    opacity: 0;
  }
  /* highlight-end */
}
```

Without `@starting-style` the popup appears at once: an element that was not
rendered has no previous value to transition from. `allow-discrete` keeps
`display: block` until the fade-out ends.

</details>

## Follow-up Questions

- How do you animate a layout change (an item moving in a list) smoothly?
  **FLIP**: measure the First position, apply the change, measure the Last,
  Invert with a `transform` back to the first position, then Play by removing
  the `transform` with a transition. View Transitions do this natively.
- Why avoid `transition: all`? It animates every property that changes,
  including ones that should not move and ones that trigger layout.
- How do you wait for an animation to finish in JavaScript? The `transitionend`
  or `animationend` event, or `element.animate(…).finished`. `transitionend`
  fires once per longhand (`transition: padding` gives four events), not at all
  if the transition is cancelled, and bubbles: a listener on the parent also
  fires for children's transitions, so check `event.target` and
  `event.propertyName`.
- Why does a transition not run when an element is inserted and the class is
  added in the same task? The browser never computed the starting style. Use
  `@starting-style`, force a style flush (`element.offsetWidth`) or a
  [double rAF](../web-platform/browser/scheduling.md#requestanimationframe).
- How do you find out why an animation is janky? DevTools Performance panel:
  Layout or Recalculate Style entries during the animation mean a property that
  is not compositor-only; Rendering tab: paint flashing; Layers panel: whether
  the element has its own layer.
- What are View Transitions? `document.startViewTransition(update)` snapshots
  the old and new DOM states and cross-fades them; the parts are styled with
  `::view-transition-*` pseudo-elements. See
  [MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API).
- How is animation done in React Native? Off the JS thread: Reanimated (worklets
  on the UI thread, CSS-like transitions in v4) or the built-in Animated with
  `useNativeDriver`. See [Reanimated](../react-native/animations/reanimated.md).

## Common Mistakes

- Animating `top`, `left`, `width` or `margin` instead of `transform`.
- Expecting a transition from `display: none` to work without `@starting-style`.
- Ignoring `prefers-reduced-motion`: large movement can cause nausea for some
  users. See
  [Web Accessibility](../web-platform/accessibility/accessibility.md).

## See Also

- [How the Browser Works](../web-platform/browser/browser-workflow.md)
- [Responsive Design](./responsive-design.md#user-preferences-and-input):
  `prefers-reduced-motion`
- [Positioning and z-index](./positioning.md): `transform` creates a stacking
  context
- [MDN: Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions)
- [MDN: Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
