---
sidebar_position: 3
description:
  What makes a component re-render, what does not, why children re-render and
  how to find the cause
---

# When Does a Component Re-render?

A component re-renders when **its state changes**, when **its parent
re-renders**, when a **context** it reads changes, or when an **external store**
it subscribes to changes (Redux and Zustand do it through
`useSyncExternalStore`). A change of props does not trigger a re-render by
itself: props change only because the parent re-rendered. A re-render means
calling the component function again; it does not mean that the DOM changes, see
[Rendering and Reconciliation](./reconciliation.md).

Applies to: React 19.3.

## Details

### Triggers

| Trigger                                   | Notes                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| `setState` or `dispatch` with a new value | The same value by `Object.is` is a bailout: no re-render of the children             |
| The parent re-rendered                    | All children re-render, whether or not their props changed, unless wrapped in `memo` |
| The value of a context it reads changed   | Every consumer re-renders; `memo` does not stop it                                   |
| The snapshot of an external store changed | With a selector, only when the selected value changed                                |
| A custom hook it calls updated its state  | A hook's state is the component's state                                              |

A changed `key` or element type is not a re-render: the component is
**remounted** and its state is lost.

### What Does Not Cause a Re-render

- **Mutation** of state or props: `user.name = 'Bob'; setUser(user)` passes the
  same reference, so React bails out.
- A change of a **ref** (`ref.current = …`).
- A change of a regular variable or a module variable.
- `setState` with the same value. React may still call the component once before
  it bails out, but it skips the children and effects.

### Why Children Re-render

- By default React does not compare props: most renders are cheap, and comparing
  every prop on every render costs time too. `memo` turns the comparison on.
- **Elements passed as `children`** (or other props) are created by the
  component that renders the wrapper. When the wrapper's own state changes,
  these elements are the same objects as before, so React skips them.
- **React Compiler** memoizes JSX in the parent: a child whose props didn't
  change gets the same element and is skipped, like with `memo`.

### `StrictMode`

In development `StrictMode` calls every component function **twice** per render
to reveal impure code: a `console.log` printed twice is not a bug. See
[`StrictMode`](./react-in-browser.md#strictmode).

### Finding the Cause

- **React DevTools → Profiler** with "Record why each component rendered while
  profiling" enabled shows the reason for every render: "The parent component
  rendered", "Props changed: (onSelect)", "Hook 2 changed".
- **Components → "Highlight updates when components render"** outlines each
  component as it renders.
- **React Performance Tracks** (React 19.2) show renders on the timeline of the
  browser's Performance panel.
- How to fix: [Optimizing React Components](../performance/optimization.md).

## Example

Elements passed as `children` are not re-rendered when the wrapper's state
changes:

```jsx
import { useState } from 'react';

function Child({ label }) {
  console.log('render', label);
  return <p>{label}</p>;
}

function Wrapper({ children }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child label="rendered by Wrapper" />
      {/* highlight-next-line */}
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Wrapper>
      <Child label="passed as children" />
    </Wrapper>
  );
}

// Click: "render rendered by Wrapper"
// "passed as children" is not logged: App created that element and did not
// re-render
```

## Follow-up Questions

- Does a component re-render when its props change? Props change only when the
  parent re-renders, and the child re-renders anyway, changed props or not.
- Does `memo` stop all re-renders? No: the component's own state and the
  contexts it reads still re-render it.
- Does a re-render update the DOM? Only if the output differs from the previous
  render.
- Why does the whole page re-render when I type in an input? The state lives too
  high: move it down into the component with the input.
- When does a component using Redux or Zustand re-render? When the value
  returned by its selector changes: by `===` in `useSelector`, by `Object.is` in
  Zustand.
- Is a re-render a problem? Usually not. It is worth fixing only when a slow
  subtree re-renders often, which the Profiler shows.

## Common Mistakes

- "A component re-renders when its props change."
- "Changing a ref re-renders the component."
- Expecting `memo` to stop updates from context.
- Fighting every re-render instead of the slow ones.

## See Also

- [Rendering and Reconciliation](./reconciliation.md)
- [Optimizing React Components](../performance/optimization.md)
- [React Context: Re-renders](../hooks/context.md#re-renders)
