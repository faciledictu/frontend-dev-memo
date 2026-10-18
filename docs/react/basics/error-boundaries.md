---
sidebar_position: 6
description:
  What error boundaries catch and what they don't, where to place them, how to
  reset them and react-error-boundary
tags: [middle]
---

# Error Boundaries

An **error boundary** is a component that catches errors thrown while rendering
its subtree and shows a **fallback** instead of the broken part. Without one, a
rendering error unmounts the **whole app**. It is a **class component** with
`static getDerivedStateFromError` and/or `componentDidCatch`: there is no hook
for it, so projects write one class or use the **`react-error-boundary`**
package. Errors in **event handlers** and **async code** are not caught.

Applies to: React 19.3, react-error-boundary 6.

## Details

### What It Catches

| Caught                                                                               | Not caught                                                        |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Errors during rendering of any component below                                       | Event handlers (`onClick`, `onSubmit`)                            |
| Lifecycle methods and effects (`useEffect`, `useLayoutEffect`)                       | Async code: `setTimeout`, promise callbacks, `await` in a handler |
| A function passed to `startTransition` or `<form action>`, async ones too (React 19) | Server rendering                                                  |
| A rejected promise read with `use`                                                   | Errors in the boundary itself: they go to the next boundary up    |

- Errors that are not caught are handled with `try` / `catch` and state, or
  moved into the render: store the error in state and throw it there, or call
  `showBoundary` from `react-error-boundary`.
- The search goes **up the tree** from the component that threw: the nearest
  boundary shows its fallback, the rest of the app keeps working.

### The Two Methods

| Method                                   | Phase  | Job                                                                |
| ---------------------------------------- | ------ | ------------------------------------------------------------------ |
| `static getDerivedStateFromError(error)` | render | Return the state that switches to the fallback; must be pure       |
| `componentDidCatch(error, info)`         | commit | Side effects: log the error and `info.componentStack` to a service |

- In development a caught error also bubbles to `window` (`onerror`, the `error`
  event); in production it does not.
- React 19 logs a caught error once with `console.error` and does not re-throw
  it. `createRoot` takes `onCaughtError` (caught by a boundary) and
  `onUncaughtError` (unmounted the app) for app-wide reporting.

### Where to Place Them

- **Not one for the whole app**: any error would replace the entire page. A
  top-level boundary is the last resort, not the only one.
- Around parts that can fail independently: a route, a widget, a sidebar, a
  third-party component. The rest of the page stays usable.
- Next to `<Suspense>`: Suspense shows a fallback while data loads, the error
  boundary when loading fails. Data libraries rely on this pair
  (`useSuspenseQuery` in
  [TanStack Query](../state-management/tanstack-query.md)).
- In the Next.js App Router, `error.tsx` is an error boundary around a route
  segment; see [App Router](../../nextjs/app-router/overview.md).

### Recovery

- A boundary stays in the error state until its state is reset.
- **Change its `key`**: React remounts the boundary and the subtree, for example
  `key={pathname}` to reset on navigation.
- In `react-error-boundary`: `resetErrorBoundary()` from the fallback (a "Try
  again" button), `resetKeys` (reset when one of the values changes) and
  `onReset` to clear what caused the error.

### react-error-boundary

| API                                          | What it does                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| `<ErrorBoundary fallback={…}>`               | A static fallback element                                                 |
| `fallbackRender` / `FallbackComponent`       | A fallback that receives `{ error, resetErrorBoundary }`                  |
| `onError(error, info)`                       | Logging, like `componentDidCatch`                                         |
| `resetKeys`, `onReset`                       | Automatic and manual reset                                                |
| `useErrorBoundary()` → `showBoundary(error)` | Send an error from an event handler or async code to the nearest boundary |
| `withErrorBoundary(Component, props)`        | The same as a HOC                                                         |

The caught value is typed `unknown` (since version 6.1): anything can be thrown,
not only an `Error`.

## Example

A boundary written by hand:

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  // highlight-start
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  // highlight-end

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <Profile />
</ErrorBoundary>;
```

<details>
<summary>react-error-boundary: retry and an error from an event handler</summary>

```jsx
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function SaveButton() {
  const { showBoundary } = useErrorBoundary();

  async function handleClick() {
    try {
      await saveDraft();
    } catch (error) {
      // highlight-next-line
      showBoundary(error); // the boundary does not see this error on its own
    }
  }

  return <button onClick={handleClick}>Save</button>;
}

export default function Editor({ draftId }) {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      resetKeys={[draftId]} // another draft: reset automatically
      onError={(error, info) => report(error, info.componentStack)}
    >
      <SaveButton />
    </ErrorBoundary>
  );
}
```

</details>

## Follow-up Questions

- Why is there no hook for error boundaries? A boundary must catch an error
  thrown while its children render and render something else instead. Function
  components have no API for that yet; the class methods are the only one.
- How to show the fallback for an error in an event handler? `showBoundary` from
  `useErrorBoundary`, or run the work in `startTransition`: an error thrown in a
  transition reaches the boundary. Or store the error in state and throw it
  during render.
- What happens to the state of the components under the boundary? They are
  unmounted when the fallback is shown; after a reset they mount again with
  fresh state.
- How do error boundaries relate to Suspense? They are a pair: Suspense handles
  "still loading", the boundary handles "failed". Both are found by walking up
  the tree.
- How to report errors in production? `componentDidCatch` or `onError` with a
  service such as Sentry; the component stack is minified and decoded with
  source maps. `onCaughtError` and `onUncaughtError` of `createRoot` cover the
  whole app.

## Common Mistakes

- Expecting a boundary to catch errors from `onClick`, `setTimeout` or a `fetch`
  in a handler.
- One boundary for the whole app: any error replaces the entire page.
- A fallback without a way out: no retry and no reset on navigation, so the user
  has to reload the page.
- Side effects in `getDerivedStateFromError`: it runs during render; logging
  belongs in `componentDidCatch`.

## See Also

- [Class Components and Lifecycle Methods](./class-components.md)
- [Concurrent Rendering](../rendering/concurrent-rendering.md) — Suspense and
  transitions.
- [Error Handling](../../javascript/errors.md) — `try` / `catch` in JavaScript.
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)
