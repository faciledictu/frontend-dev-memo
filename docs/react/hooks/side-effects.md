---
sidebar_position: 2
description:
  useEffect dependencies, cleanup order, StrictMode, race conditions and
  useLayoutEffect
tags: [junior, middle]
---

# Side Effects

A **side effect** is anything that reaches outside of rendering: a network
request, a subscription, a timer, a manual DOM change. Side effects caused by a
user action belong in **event handlers**. **`useEffect`** is for synchronizing a
component with an external system for as long as it is on screen. It runs
**after** React has updated the DOM, runs again when its **dependencies**
change, and its **cleanup** function runs before the next run and on unmount.

Applies to: React 19.3.

## Details

### Dependencies

| Call                    | The effect runs                                         |
| ----------------------- | ------------------------------------------------------- |
| `useEffect(fn)`         | After every render                                      |
| `useEffect(fn, [])`     | Once after mount; the cleanup runs on unmount           |
| `useEffect(fn, [a, b])` | After mount and after a render where `a` or `b` changed |

- Dependencies are compared with `Object.is`.
- The array is not a choice: it must list every **reactive value** (props, state
  and what is computed from them) that the effect reads. The lint rule
  `react-hooks/exhaustive-deps` checks it.
- An object or a function created during render is new every time, so the effect
  runs after every render. Create it inside the effect, move it out of the
  component or memoize it.
- To read the latest value **without** re-running the effect, wrap that part in
  **`useEffectEvent`** (React 19.2).

### Order

1. React renders the component and updates the DOM.
2. `useLayoutEffect` callbacks run; the browser paints.
3. `useEffect` callbacks run (usually after the paint; after a click or another
   discrete event React may run them before it).

- On an update, the **cleanup of the previous effect** runs first, with the
  props and state of the previous render, then the new setup.
- On unmount, only the cleanup runs.
- Effects of children run before the effects of the parent.

### `StrictMode`

In development `StrictMode` mounts every component, runs **setup → cleanup →
setup** and only then continues. A correct effect does not notice it: the
cleanup must undo everything the setup did. If something happens twice (two
connections, two listeners), the cleanup is missing. Removing `StrictMode` or
adding a "did run" ref hides the bug.

### Data Fetching and Race Conditions

- Responses can arrive in any order. If `userId` changes from 1 to 2 quickly,
  the response for 1 can come last and overwrite the correct data.
- Fix: ignore outdated responses with a flag set in the cleanup, or cancel the
  request with `AbortController`.
- An effect can't be `async`: it would return a promise instead of a cleanup.
  Declare an async function inside and call it.
- In real projects fetching is done by a library
  ([TanStack Query](../state-management/tanstack-query.md), RTK Query) or by the
  framework: they add caching, deduplication and race handling.

### `useLayoutEffect`

- The same API, but it runs synchronously after the DOM is updated and **before
  the browser paints**. Its timing matches `componentDidMount` and
  `componentDidUpdate`.
- Use it to measure layout and correct the DOM before the user sees it (position
  of a tooltip). It blocks painting, so `useEffect` is the default.

### You Might Not Need an Effect

| Task                             | Instead of an effect                          |
| -------------------------------- | --------------------------------------------- |
| Compute data from props or state | Compute during render, `useMemo` if expensive |
| Reset state when a prop changes  | Pass a different `key`                        |
| React to a click or a submit     | Do it in the event handler                    |
| Notify the parent about a change | Call the callback in the same event handler   |
| Subscribe to an external store   | `useSyncExternalStore`                        |

## Example

A subscription with a cleanup:

```jsx
import { useEffect, useState } from 'react';

export default function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <p>Width: {width}</p>;
}
```

Fetching without a race condition:

```jsx
import { useEffect, useState } from 'react';

export default function Profile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      // The cleanup has already run if `userId` changed or the component unmounted
      if (!ignore) {
        setUser(data);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [userId]);

  return <p>{user ? user.name : 'Loading...'}</p>;
}
```

## Follow-up Questions

- What is the difference between `useEffect` and `useLayoutEffect`?
  `useLayoutEffect` runs before the paint and blocks it; `useEffect` does not.
- Why does an effect run twice in development? `StrictMode` checks that the
  cleanup works.
- How to run code only on mount? `useEffect(fn, [])`, as long as the effect
  really reads no reactive values.
- When does the cleanup run? Before every re-run of the effect and on unmount.
- How to read the latest props in an effect without re-subscribing? Move that
  code into a **`useEffectEvent`** function and call it from the effect.
- In what order do the effects of a parent and a child run? Children first. On
  an update all cleanups run before all new setups.

## Common Mistakes

- Omitting a dependency to "run once": the effect works with stale values.
- Translating `componentDidMount` literally into `useEffect(fn, [])` while the
  effect reads props or state: a stale closure. An effect describes
  synchronization with the current values, not a lifecycle moment.
- No cleanup for a subscription, a timer or a connection.
- An `async` effect callback.
- Updating state in an effect to store what could be computed during render: an
  extra render and a flash of stale UI.
- An object or an inline function in the dependency array.

## See Also

- [React in the Browser: `StrictMode`](../rendering/react-in-browser.md#strictmode)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
