---
sidebar_position: 1
description: createRoot, hydrateRoot, hydration, StrictMode and flushSync
---

# React in the Browser: `react-dom`

The `react` package describes the UI (components, elements, hooks) and knows
nothing about the platform. **`react-dom`** is the **renderer** that turns this
description into DOM nodes and keeps them up to date; React Native is another
renderer. An app starts with **`createRoot`** (render on the client) or
**`hydrateRoot`** (attach to HTML that was rendered on the server).

Applies to: React 19.

## Details

### Entry Points

| API                                           | Import from        | What it does                                                         |
| --------------------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `createRoot(container)`                       | `react-dom/client` | Creates a root. `root.render(<App />)` renders into an empty node    |
| `hydrateRoot(container, <App />)`             | `react-dom/client` | Attaches React to existing server HTML instead of creating the nodes |
| `root.unmount()`                              | —                  | Removes the tree and runs all cleanup functions                      |
| `createPortal(children, node)`                | `react-dom`        | Renders children into another DOM node, see [Portals](./portals.md)  |
| `flushSync(callback)`                         | `react-dom`        | Applies the state updates made in the callback synchronously         |
| `renderToPipeableStream`, `renderToString`, … | `react-dom/server` | Render components to HTML on the server                              |

`ReactDOM.render`, `ReactDOM.hydrate`, `unmountComponentAtNode` and
`findDOMNode` were removed in React 19.

### Hydration

- The server sends ready HTML: the page is visible but not interactive.
- `hydrateRoot` renders the components in the browser, matches the result
  against the existing DOM and attaches event handlers. It does not create the
  nodes again.
- The first client render must produce **the same output** as the server. Things
  that break it: `Date.now()`, `Math.random()`, `typeof window` checks,
  `localStorage`, locale-dependent formatting.
- On a **hydration mismatch** React logs an error with a diff and re-renders the
  nearest `Suspense` boundary (or the whole root) on the client.
- Fixes: read browser-only values in `useEffect`, generate IDs with `useId`, use
  `suppressHydrationWarning` on a single element for an unavoidable difference
  such as a timestamp.
- With `Suspense`, hydration is **selective**: each boundary hydrates
  independently, and the one the user interacts with goes first.

### `StrictMode`

`<StrictMode>` enables extra checks in development only; it renders nothing and
does nothing in production.

- Calls component functions, state initializers and updater functions **twice**
  to reveal impure rendering.
- On mount runs an extra **setup → cleanup → setup** cycle for every effect (and
  ref callback) to reveal a missing cleanup.
- Warns about deprecated APIs.

### `flushSync`

State updates are batched and applied later. `flushSync` forces React to update
the DOM before the next line runs. It is an escape hatch: it hurts performance
and is needed only when code must read the updated DOM immediately (scroll to a
new item, integrate with a browser API such as `onbeforeprint`).

## Example

The entry point of a client-rendered app:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

The same for server-rendered HTML:

```jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(document.getElementById('root'), <App />);
```

`flushSync` when the new DOM node is needed right away:

```jsx
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const listRef = useRef(null);

  const handleAdd = () => {
    flushSync(() => {
      setTodos((prev) => [...prev, `Todo ${prev.length + 1}`]);
    });
    // The new <li> is already in the DOM
    listRef.current.lastElementChild.scrollIntoView();
  };

  return (
    <>
      <button onClick={handleAdd}>Add</button>
      <ul ref={listRef}>
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ul>
    </>
  );
}
```

## Follow-up Questions

- Why are `react` and `react-dom` separate packages? The component model is the
  same for every platform, so only the renderer changes: `react-dom`, React
  Native, renderers for canvas or the terminal.
- What is the difference between `createRoot` and `hydrateRoot`? `createRoot`
  builds the DOM from scratch; `hydrateRoot` reuses server HTML and only
  attaches handlers.
- Why does an effect run twice in development? Because of `StrictMode`, see
  [Side Effects](../hooks/side-effects.md#strictmode).

## Common Mistakes

- Rendering different content on the server and on the client
  (`typeof window !== 'undefined' ? a : b`) and getting a hydration mismatch.
- Removing `StrictMode` to "fix" a double effect instead of adding a cleanup.
- Using `flushSync` as a regular way to update state.

## See Also

- [Rendering and Reconciliation](./rendering.md)
- [Portals](./portals.md)
