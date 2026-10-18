---
sidebar_position: 2
description:
  Capturing and bubbling, target vs currentTarget, delegation, listener options
tags: [junior, middle]
---

# DOM Events

An **event** is an object that the browser dispatches to an element when
something happens: a click, a key press, a finished load. It travels in three
phases: **capturing** (from `window` down to the target), **target**, and
**bubbling** (back up to `window`). Handlers run in the bubbling phase by
default. **Event delegation** uses bubbling: one handler on an ancestor serves
all its descendants.

## Details

### Adding and Removing Handlers

```javascript
button.addEventListener('click', handleClick, options);
button.removeEventListener('click', handleClick, options);
```

- `removeEventListener` needs the **same function reference** and the same
  `capture` value. An inline arrow function or a new `handler.bind(this)` cannot
  be removed this way.
- `options` is an object, or a boolean that means `capture`:

| Option    | Meaning                                                                                |
| --------- | -------------------------------------------------------------------------------------- |
| `capture` | run the handler in the capturing phase                                                 |
| `once`    | remove the handler after the first call                                                |
| `passive` | the handler promises not to call `preventDefault()`, so scrolling does not wait for it |
| `signal`  | an `AbortSignal`; `controller.abort()` removes the handler                             |

`touchstart`, `touchmove` and `wheel` listeners on `window`, `document` and
`<body>` are passive by default; to call `preventDefault()` in them, pass
`{ passive: false }`.

### Propagation

- `event.target` is the element where the event happened; `event.currentTarget`
  is the element whose handler is running now.
- Order for a click on a nested element: capturing handlers from the outermost
  ancestor down, handlers of the target, bubbling handlers from the parent up.
- Some events **do not bubble**: `focus` / `blur` (the bubbling versions are
  `focusin` / `focusout`), `mouseenter` / `mouseleave` (`mouseover` /
  `mouseout`), `load` and `error` of resources. They can still be caught on an
  ancestor in the capturing phase.
- A **custom event** carries data in `detail`:
  `el.dispatchEvent(new CustomEvent('save', { detail, bubbles: true }))`. It is
  handled with `addEventListener` like a built-in event; without `bubbles: true`
  it does not bubble, so delegation does not see it.

### Stopping an Event

| Method                             | What it does                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `event.preventDefault()`           | cancels the default action (following a link, submitting a form); the event keeps propagating |
| `event.stopPropagation()`          | stops the event from reaching other elements; other handlers on the current element still run |
| `event.stopImmediatePropagation()` | the same, and also skips the remaining handlers on the current element                        |

### Common Events

| Group    | Events                                                                            |
| -------- | --------------------------------------------------------------------------------- |
| Mouse    | `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseover`, `mouseout` |
| Pointer  | `pointerdown`, `pointerup`, `pointermove`: one API for mouse, touch and pen       |
| Keyboard | `keydown`, `keyup`                                                                |
| Form     | `submit`, `input`, `change`, `focus`, `blur`                                      |
| Page     | `DOMContentLoaded`, `load`, `resize`, `scroll`, `visibilitychange`, `pagehide`    |

Deprecated: `keypress` (use `keydown`, or `input` for text) and `unload` (it is
unreliable on mobile, disables the back/forward cache, and Chrome no longer
fires it by default; use `visibilitychange` or `pagehide`). `beforeunload` is
only for warning about unsaved changes.

## Example

Delegation: one handler for all items, including those added later.

```html
<ul id="menu">
  <li data-action="save"><span>Save</span></li>
  <li data-action="delete"><span>Delete</span></li>
</ul>
```

```javascript
const menu = document.getElementById('menu');

menu.addEventListener('click', (event) => {
  // event.target can be the <span>, so matches('[data-action]') would fail.
  // closest() checks the element itself and then its ancestors.
  // highlight-next-line
  const item = event.target.closest('[data-action]');

  if (!item || !menu.contains(item)) return;

  console.log(item.dataset.action); // 'save' or 'delete'
});
```

## Follow-up Questions

- Why use delegation? There is one handler instead of many, and it works for
  elements added after the handler was attached.
- How do you remove several handlers at once? Pass the same `signal` to all of
  them and call `controller.abort()`.
- How does React attach handlers? It delegates: one listener per event type on
  the root container, not on every element.
- What if the same handler is added twice? `addEventListener` ignores the
  duplicate (same type, function and `capture`), so it runs once.
- `input` or `change`? `input` fires on every change of the value; `change` when
  the value is committed: on blur or Enter in a text field, right away for a
  `<select>` or a checkbox.
- What is `event.target` for a click inside a Shadow DOM? Outside the shadow
  tree it is retargeted to the host; `event.composedPath()` gives the full path
  (for a closed shadow root it stops at the host). See
  [Web Components and Shadow DOM](./web-components.md).

## Common Mistakes

- Mixing up `preventDefault()` and `stopPropagation()`: the first is about the
  browser's default action, the second is about other handlers.
- Trying to remove a handler by passing a new function that looks the same.
- Using `event.target.matches()` in delegation: it fails when the click lands on
  a nested element.
- "`return false` cancels the default action." Only in `on…` handlers
  (`onclick="…"` or `el.onclick`) and in jQuery, where it also stops
  propagation; with `addEventListener` call `preventDefault()`.

## See Also

- [Event Loop](../../javascript/event-loop.md)
- [HTML](../../html-css/html.md)
