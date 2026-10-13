---
sidebar_position: 3
description:
  useRef, DOM refs, callback refs, ref as a prop and useImperativeHandle
---

# Refs

A **ref** is a mutable object `{ current }` that lives as long as the component.
Changing `ref.current` **does not cause a re-render**. Refs have two uses:
access to a **DOM node** (focus, scroll, measuring) and storing a value that is
**not needed for rendering** (a timer ID, an instance of a third-party library).
`ref.current` should not be read or written during rendering, only in event
handlers and effects.

Applies to: React 19.

## Details

### Ref and State

|                    | Ref                                 | State                      |
| ------------------ | ----------------------------------- | -------------------------- |
| Change             | `ref.current = value`, mutable      | Setter, immutable          |
| Causes a re-render | No                                  | Yes                        |
| Update is visible  | Immediately                         | On the next render         |
| Use for            | DOM nodes, timers, external objects | Everything shown in the UI |

### DOM Refs

- `const inputRef = useRef(null)` and `<input ref={inputRef} />`.
- React sets `current` during the commit phase, so the node is available in
  effects and event handlers, not during the first render. On unmount it becomes
  `null` again.
- A ref is an escape hatch: use it for what React does not manage (focus,
  scroll, selection, measuring). Don't change the DOM structure that React
  renders.

### Callback Refs

- `ref` also accepts a function: `<div ref={(node) => { … }} />`. React calls it
  with the node when the element is attached.
- Since React 19 it can return a **cleanup function**, like an effect. Without
  one, React calls the callback again with `null` on detach.
- Use it to measure a node, to attach an observer or to keep refs for a list of
  items.
- An inline callback is a new function on every render, so it is called again
  every time. Wrap it in `useCallback` if that matters.

### `ref` as a Prop

- Since React 19 a function component receives `ref` as a **regular prop** and
  passes it to a DOM node.
- Before React 19 it had to be wrapped in **`forwardRef((props, ref) => …)`**.
  It still works but is no longer needed and will be deprecated.
- A ref to a **class component** points to its instance.

### `useImperativeHandle`

`useImperativeHandle(ref, createHandle, deps?)` replaces what the parent gets
through the ref: a small object with chosen methods instead of the whole DOM
node.

## Example

A ref passed as a prop, with a limited handle:

```jsx
import { useImperativeHandle, useRef } from 'react';

function SearchInput({ ref, ...props }) {
  const inputRef = useRef(null);

  // The parent gets only `focus`, not the DOM node
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));

  return <input ref={inputRef} {...props} />;
}

export default function Page() {
  const searchRef = useRef(null);

  return (
    <>
      <SearchInput ref={searchRef} placeholder="Search" />
      <button onClick={() => searchRef.current.focus()}>Focus</button>
    </>
  );
}
```

A value that is not rendered:

```jsx
import { useEffect, useRef, useState } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current !== null) {
      return;
    }

    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => stop, []);

  return (
    <>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

A callback ref with a cleanup:

```jsx
import { useCallback, useState } from 'react';

export default function Measured({ children }) {
  const [height, setHeight] = useState(0);

  const measureRef = useCallback((node) => {
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={measureRef}>
      {children}
      <p>Height: {height}px</p>
    </div>
  );
}
```

## Follow-up Questions

- Why not use a regular variable instead of a ref? A variable inside the
  component is recreated on every render; a variable outside is shared by all
  instances.
- How is `useRef` different from `createRef`? `createRef` creates a new object
  on every call and is meant for class components; `useRef` returns the same
  object on every render.
- When is `forwardRef` needed? Only before React 19.
- How to get refs for a list of items? A callback ref that stores nodes in a
  `Map` kept in a ref.

## Common Mistakes

- Reading or writing `ref.current` during render: the result depends on when the
  render happened.
- Expecting a re-render after changing `ref.current`.
- Using `ref.current` in a dependency array: its change does not trigger a
  render, so the effect does not run.
- Reaching for a ref where state or a prop does the job (showing or hiding an
  element, changing a class).

## See Also

- [Forms: uncontrolled inputs](../basics/forms.md#controlled-and-uncontrolled)
- [State](../basics/state.md)
