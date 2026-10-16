---
sidebar_position: 5
description:
  Event handlers, SyntheticEvent, event delegation on the root and differences
  from DOM events
---

# Synthetic Events

An event handler is a prop in camelCase that takes a function:
`onClick={handleClick}`. It receives a **`SyntheticEvent`**: a cross-browser
wrapper with the interface of the native event (`target`, `preventDefault()`,
`stopPropagation()`); the native event is in `e.nativeEvent`. React does not
attach a listener to every element: it uses **event delegation**, one listener
per event type on the **root container** (since React 17; on `document` before).
Events propagate through the **React tree**, so an event inside a portal reaches
its React parents.

Applies to: React 19.3.

## Details

### Handlers

- Pass a function, don't call it: `onClick={handleClick}`, not
  `onClick={handleClick()}`. With an argument: `onClick={() => remove(id)}`.
- `return false` does not prevent the default action: call `e.preventDefault()`.
- Capture phase: add `Capture` to the name, `onClickCapture`.
- `e.currentTarget` is the element whose handler is running, `e.target` is where
  the event happened.
- Handlers are the place for side effects caused by the user: they don't run
  during render, see
  [You Might Not Need an Effect](../hooks/side-effects.md#you-might-not-need-an-effect).

### Differences from DOM Events

| React                                                             | DOM                                               |
| ----------------------------------------------------------------- | ------------------------------------------------- |
| `onChange` fires on every input, like `input`                     | `change` fires when the value is committed (blur) |
| `onFocus`, `onBlur` bubble (`focusin`, `focusout` under the hood) | `focus`, `blur` don't bubble                      |
| `onScroll` does not bubble (since React 17)                       | `scroll` does not bubble                          |
| `onMouseEnter`, `onMouseLeave` don't bubble                       | The same                                          |
| `onDoubleClick`                                                   | `dblclick`                                        |
| Propagates through the React tree (portals)                       | Propagates through the DOM tree                   |

- **No event pooling** since React 17: the event object can be read in a timeout
  or after `await`; `e.persist()` does nothing.
- `onTouchStart`, `onTouchMove` and `onWheel` are **passive**:
  `e.preventDefault()` in them is ignored. To block scrolling, add a listener
  with `{ passive: false }` in an effect.

### Delegation

- `createRoot` attaches listeners for all supported events to the root container
  in both phases. When an event reaches the root, React finds the fiber of the
  target and calls the handlers along the React tree.
- Why the root and not `document` (React 17): several React apps and versions on
  one page don't interfere, and `e.stopPropagation()` in React really stops the
  event before it reaches `document`.
- **Mixing with `addEventListener`.** A native listener on an element runs
  **before** the React handlers in the bubble phase, because React handles the
  event only when it reaches the root:
  - `e.stopPropagation()` in a React handler stops other React handlers and
    native listeners on `document` and `window`, but not native listeners inside
    the root;
  - `e.stopPropagation()` in a native listener inside the root stops the event
    before the root, so the React handlers in the bubble phase don't run.
- Events of `window` and `document` (`resize`, `keydown` on the whole page) are
  subscribed to with `addEventListener` in an effect, with cleanup.

## Example

The order of native and React handlers:

```jsx
import { useEffect, useRef } from 'react';

export default function App() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const onButtonClick = () => console.log('native: button');
    const onDocumentClick = () => console.log('native: document');

    button.addEventListener('click', onButtonClick);
    document.addEventListener('click', onDocumentClick);
    return () => {
      button.removeEventListener('click', onButtonClick);
      document.removeEventListener('click', onDocumentClick);
    };
  }, []);

  return (
    <div onClick={() => console.log('react: div')}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          console.log('react: button');
          // highlight-next-line
          e.stopPropagation();
        }}
      >
        Click
      </button>
    </div>
  );
}

// Click:
// native: button
// react: button
// "react: div" and "native: document" are not logged
```

## Follow-up Questions

- What is a synthetic event? A React wrapper over the native event with the same
  interface and consistent behavior across browsers.
- How to get the native event? `e.nativeEvent`.
- Does a click inside a portal reach the `onClick` of a React parent? Yes:
  events follow the React tree, even though the portal's DOM is elsewhere.
- Why did React 17 move delegation from `document` to the root? To allow several
  React versions on a page and to make `stopPropagation` work with listeners on
  `document`.
- Why does `e.preventDefault()` in `onWheel` not block scrolling? The listener
  is passive.

## Common Mistakes

- `onClick={handleClick()}`: the function is called during render.
- `return false` to prevent the default action.
- Expecting `onChange` to fire on blur, as in the DOM.
- "React attaches a listener to every element."
- Expecting `e.stopPropagation()` in a React handler to stop a native listener
  on a parent element inside the app.

## See Also

- [Portals](./portals.md)
- [Events in the Browser](../../web-platform/browser/events.md)
