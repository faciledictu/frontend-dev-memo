---
sidebar_position: 3
description:
  useState and useReducer, state as a snapshot, batching, immutable updates
tags: [junior, middle]
---

# State

**State** is data that a component remembers between renders. Calling the setter
does not change the variable: it **schedules a re-render** with the new value,
and every render sees its own **snapshot** of the state. Updates made in one
event handler are **batched** into one re-render. State is treated as
**immutable**: objects and arrays are replaced, not mutated.

Applies to: React 19.3.

## Details

### `useState`

- `const [value, setValue] = useState(initialValue)`.
- **Snapshot.** Inside one render the state variable never changes. Reading it
  right after `setValue` gives the old value.
- **Updater function.** `setCount((c) => c + 1)` receives the latest pending
  state. Use it when the next state depends on the previous one.
- **Bailout.** If the new value is the same (`Object.is`), React bails out:
  children are not re-rendered and effects don't run.
- **Lazy initialization.** `useState(() => createInitialState())` calls the
  function only on the first render; `useState(createInitialState())` calls it
  on every render and throws the result away.
- State belongs to a position in the tree. A different
  [`key`](../rendering/reconciliation.md#diffing-heuristics) resets it.

### Batching

- React processes state updates after the event handler finishes, so several
  setters cause **one** re-render.
- Since React 18 batching is **automatic** everywhere: in promises, timeouts and
  native event handlers too. Before, it worked only in React event handlers.
- [`flushSync`](../rendering/react-in-browser.md#flushsync) opts out.

### Immutable Updates

React compares state by reference. A mutated object is the same reference, so
there is no re-render.

| Operation              | How                                                   |
| ---------------------- | ----------------------------------------------------- |
| Add to an array        | `[...items, item]`                                    |
| Remove from an array   | `items.filter((item) => item.id !== id)`              |
| Replace an array item  | `items.map((item) => (item.id === id ? next : item))` |
| Update an object field | `{ ...user, name }`                                   |
| Update a nested field  | `{ ...user, address: { ...user.address, city } }`     |

### Where State Lives

- **Lifting state up.** When two components need the same data, the state moves
  to their closest common parent and comes down through props.
- **Derived state.** What can be computed from props or other state is not
  stored: it is computed during render (`const total = price * count`), with
  `useMemo` if the computation is expensive.
- Data that does not affect rendering (a timer ID) belongs in a
  [ref](../hooks/refs.md).
- State shared across the app: see
  [Where to Keep State](../state-management/overview.md).

### `useReducer`

- `const [state, dispatch] = useReducer(reducer, initialState)`.
- The **reducer** is a pure function `(state, action) => newState`. An action is
  conventionally an object with a `type` field.
- Prefer it to `useState` when there are several related fields, when many
  handlers update the state in similar ways, or when the logic should be tested
  outside of the component.

## Example

A snapshot and an updater function:

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const addOne = () => {
    // `count` is 0 in this render, so this is setCount(1) three times
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count); // 0
  };

  const addThree = () => {
    // Each updater receives the result of the previous one
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={addOne}>+ 1</button>
      <button onClick={addThree}>+ 3</button>
    </>
  );
}
```

The same counter with `useReducer`:

```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented':
      return { ...state, count: state.count + action.step };
    case 'reset':
      return { ...state, count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'incremented', step: 1 })}>
        + 1
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  );
}
```

## Follow-up Questions

- Is `setState` asynchronous? It returns nothing and can't be awaited. The
  update is queued and applied on the next render; the current render keeps its
  snapshot.
- How to reset the state of a component? Render it with a different `key`.
- `useState` or `useReducer`? They are equivalent in power. A reducer keeps the
  update logic in one place and makes it testable.
- State or ref? State when the value is shown in the UI; a ref when it is not.
- Why must state be immutable? React compares the old and the new value with
  `Object.is`: a mutated object is the same reference, so React skips the
  re-render, and `memo` and effect dependencies see no change.
- What does the updater function receive and when does it run? The pending
  state: the result of the updaters queued before it. Updaters run in order
  during the next render, which is why three `setCount((c) => c + 1)` add three.

## Common Mistakes

- Mutating state: `user.name = 'Bob'; setUser(user)` does not re-render.
- Reading the state right after the setter and expecting the new value.
- Storing derived data in state and synchronizing it in an effect.
- `useState(expensiveFunction())` instead of `useState(expensiveFunction)`.
- Calling the setter unconditionally during render (`setCount(count + 1)` in the
  component body): every render queues another one, and React stops with "Too
  many re-renders".

## See Also

- [Where to Keep State](../state-management/overview.md)
- [Redux](../state-management/redux.md)
- [Class Components](./class-components.md) — `this.state` and `this.setState`.
