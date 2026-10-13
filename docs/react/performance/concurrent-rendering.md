---
sidebar_position: 3
description: Transitions, useDeferredValue, Suspense and the use hook
---

# Concurrent Rendering

**Concurrent rendering** means that React can prepare a new version of the UI in
the background and **interrupt**, pause, resume or abandon that work. An urgent
update (typing, a click) is not blocked by a slow one. It is not parallelism:
everything still runs on one thread, React splits rendering into small chunks
and yields to the browser between them. It is not a mode either: it works in any
app created with `createRoot` and is used for updates marked as non-urgent with
**transitions**, **`useDeferredValue`** and **`Suspense`**.

Applies to: React 19.

## Details

### APIs

| API                               | What it does                                                           | Use it when                                                 |
| --------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| `useTransition`                   | Marks state updates as non-urgent, returns `isPending`                 | You own the state update that causes a slow render          |
| `startTransition` (import)        | The same without `isPending`, works outside components                 | The update happens in a library or a plain function         |
| `useDeferredValue(value)`         | Returns a copy of the value that lags behind during urgent updates     | The value comes from props or a hook you do not control     |
| `<Suspense fallback>`             | Shows a fallback while something inside is not ready                   | Lazy components, data read with `use`, framework data       |
| `use(promise)`                    | Suspends the component until the promise settles and returns its value | Reading a promise created outside the component             |
| `lazy(() => import('./Comp.js'))` | Loads the component code on first render                               | [Code splitting](../../web-platform/bundle-optimization.md) |

### Transitions

- Updates inside `startTransition` have low priority. React keeps the current UI
  on screen, renders the new one in the background and sets `isPending` to
  `true`.
- The background render is **interruptible**: a new urgent update or a newer
  transition makes React drop the unfinished work.
- React can only yield **between components**. One component with a slow body
  still blocks the thread; a slow tree of many components does not.
- A transition does not replace already visible content with a `Suspense`
  fallback: the old content stays until the new one is ready.
- The function can be async (React 19 calls it an **Action**): `isPending` stays
  `true` until it finishes. State updates after an `await` must be wrapped in
  another `startTransition`.
- A controlled input value can't be updated in a transition: typing must be
  synchronous.

### `Suspense`

- A component **suspends** when it renders a `lazy` component that is not loaded
  yet, calls `use` with a pending promise, or reads data through a
  Suspense-enabled library (Next.js, Relay, `useSuspenseQuery` in TanStack
  Query).
- Data fetched in `useEffect` or in an event handler **does not** trigger
  `Suspense`.
- The promise passed to `use` must be stable: created in a parent, a loader or a
  cache. A promise created during the render of the same component is new on
  every render.
- A rejected promise is handled by the nearest
  [Error Boundary](../basics/patterns.md#error-boundaries).

### `useDeferredValue`

- On the first render the deferred value equals the value.
- On an update React first re-renders with the **old** deferred value (fast,
  urgent), then tries to render with the new one in the background.
- The background render is interruptible: on the next keystroke React abandons
  it and starts again with the latest value.
- It does not delay or cancel network requests. It only delays rendering.
- The slow child must be wrapped in `memo`, otherwise it re-renders with the old
  value anyway.

## Example

`Suspense` with `use`: the fallback is shown until the promise resolves.

```jsx
import { Suspense, use } from 'react';

function fetchUser(id) {
  return fetch(`/api/users/${id}`).then((response) => response.json());
}

// Created once, outside of rendering
const userPromise = fetchUser(1);

function Profile({ userPromise }) {
  const user = use(userPromise); // suspends while the promise is pending
  return <h1>{user.name}</h1>;
}

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Profile userPromise={userPromise} />
    </Suspense>
  );
}
```

`useTransition`: switching to a slow tab does not freeze the UI. The buttons
stay responsive, and a click on another tab interrupts the unfinished render.

```jsx
import { useState, useTransition } from 'react';
import About from './About';
import Posts from './Posts'; // renders thousands of items

export default function Tabs() {
  const [tab, setTab] = useState('about');
  const [isPending, startTransition] = useTransition();

  const selectTab = (nextTab) => {
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <>
      <button onClick={() => selectTab('about')}>About</button>
      <button onClick={() => selectTab('posts')}>Posts</button>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        {tab === 'about' ? <About /> : <Posts />}
      </div>
    </>
  );
}
```

`useDeferredValue`: the input updates immediately, the results follow when they
are ready. While the user types "ab", the list still shows the results for "a"
instead of the fallback.

```jsx
import { Suspense, useDeferredValue, useState } from 'react';
import SearchResults from './SearchResults';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{ opacity: isStale ? 0.6 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

## Follow-up Questions

- Is concurrent rendering parallel? No. It is one thread with interruptible work
  split into chunks.
- How is a transition different from debounce or throttle? There is no fixed
  delay: the render starts immediately, adapts to the device speed and can be
  interrupted. It does not reduce the number of network requests.
- `useTransition` or `useDeferredValue`? `useTransition` wraps the state update
  itself; `useDeferredValue` is for a value you only receive.
- Why is the commit phase not interruptible? See
  [Rendering and Reconciliation](../basics/rendering.md#render-and-commit).

## Common Mistakes

- Calling it "Concurrent Mode": the mode was never released, since React 18 it
  is a set of features that are opted into per update.
- Expecting `Suspense` to show a fallback for a request made in `useEffect`.
- Creating the promise for `use` inside the same component on every render.
- Wrapping the update of a controlled input in `startTransition`.

## See Also

- [Optimization of React Components](./optimization.md)
- [Forms: Actions](../basics/forms.md#actions)
- [`useDeferredValue` reference](https://react.dev/reference/react/useDeferredValue)
