---
sidebar_position: 7
description:
  Actions, use, ref as a prop and other changes of React 19 and its minor
  versions; removed APIs and migration
---

# What's New in React 19

React 19 (December 2024) is about **async UI and less boilerplate**: **Actions**
(async functions in transitions, with `useActionState`, `useOptimistic`,
`useFormStatus` and `<form action>`), the **`use`** API for promises and
context, **`ref` as a regular prop** instead of `forwardRef`, **`<Context>` as a
provider**, document metadata rendered from components, and stable **Server
Components**. Minor versions added `<Activity>` and `useEffectEvent` (19.2),
`<ViewTransition>` and Fragment refs (19.3). **React Compiler** is a separate
build tool, stable since October 2025.

Applies to: React 19.3.

## Details

### React 19.0

| Feature                                | What it does                                                                                                     | Page                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Actions                                | An async function in `startTransition` or `<form action>`: React tracks the pending state, errors and form reset | [Forms](./basics/forms.md#actions)                                           |
| `useActionState`                       | The result and the pending flag of an Action                                                                     | [Forms](./basics/forms.md#actions)                                           |
| `useOptimistic`                        | Shows the expected result while an Action is pending                                                             | [Forms](./basics/forms.md#actions)                                           |
| `useFormStatus` (`react-dom`)          | The status of the parent `<form>`                                                                                | [Forms](./basics/forms.md#actions)                                           |
| `use(promise)`, `use(context)`         | Reads a promise (suspends until it settles) or a context; can be called in a condition                           | [Concurrent Rendering](./rendering/concurrent-rendering.md#suspense)         |
| `ref` as a prop                        | A function component receives `ref` in its props; `forwardRef` is not needed                                     | [Refs](./hooks/refs.md#ref-as-a-prop)                                        |
| Ref callback cleanup                   | A ref callback can return a cleanup function                                                                     | [Refs](./hooks/refs.md#callback-refs)                                        |
| `<Context>` as a provider              | `<ThemeContext value="dark">` instead of `<ThemeContext.Provider>`                                               | [Context](./hooks/context.md)                                                |
| `useDeferredValue` initial value       | `useDeferredValue(value, initialValue)` for the first render                                                     | [Concurrent Rendering](./rendering/concurrent-rendering.md#usedeferredvalue) |
| Document metadata                      | `<title>`, `<meta>`, `<link>` rendered anywhere are hoisted to `<head>`                                          | —                                                                            |
| Stylesheets and scripts                | `<link rel="stylesheet" precedence>` and `<script async>` are deduplicated; `Suspense` waits for stylesheets     | —                                                                            |
| Preloading                             | `preload`, `preinit`, `preconnect`, `prefetchDNS` from `react-dom`                                               | —                                                                            |
| Server Components and Server Functions | Stable in React; the bundler integration is done by a framework                                                  | [Server Components](../nextjs/app-router/server-components.mdx)              |
| Hydration errors                       | One error with a diff of the mismatch instead of several warnings                                                | [Hydration](./rendering/react-in-browser.md#hydration)                       |
| Error reporting                        | `onCaughtError` and `onUncaughtError` options of `createRoot`; a caught error is logged once and not re-thrown   | [Error Boundaries](./basics/patterns.md#error-boundaries)                    |
| Custom elements                        | Props are set as properties of a custom element, not only as attributes                                          | —                                                                            |

### Minor Versions

| Version               | What was added                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 19.1 (March 2025)     | Owner Stack: `captureOwnerStack()` in development shows which components rendered the one that failed                                                                                                                                                                                                                                                  |
| 19.2 (October 2025)   | `<Activity mode="hidden">` hides a subtree but keeps its state; [`useEffectEvent`](./hooks/side-effects.md#dependencies); React Performance Tracks; `cacheSignal` and partial pre-rendering for the server                                                                                                                                             |
| 19.3 (September 2026) | `<ViewTransition>` and `addTransitionType`: animations through the View Transition API; Fragment refs; `use(browser())` from `react-dom` inside `<Suspense>` renders a subtree only in the browser; Trusted Types; transitions render independently instead of being entangled into one render, so a slow transition no longer holds up unrelated ones |

### React Compiler

- A Babel plugin, version 1.0 in October 2025, released separately from React.
  Works with React 17 and 18 through the `react-compiler-runtime` package.
- Memoizes components and values at build time, so `memo`, `useMemo` and
  `useCallback` are rarely written by hand. See
  [React Compiler](./performance/optimization.md#react-compiler).

### Removed and Deprecated

| Removed in 19                                      | Instead                                            |
| -------------------------------------------------- | -------------------------------------------------- |
| `propTypes` (silently ignored)                     | TypeScript                                         |
| `defaultProps` for function components             | Default parameter values                           |
| String refs (`ref="input"`)                        | `useRef` or a callback ref                         |
| Legacy context (`contextTypes`, `getChildContext`) | `createContext` with `contextType` or `useContext` |
| `ReactDOM.render`, `ReactDOM.hydrate`              | `createRoot`, `hydrateRoot`                        |
| `unmountComponentAtNode`, `findDOMNode`            | `root.unmount()`, refs                             |
| `react-dom/test-utils`                             | `act` from `react`, React Testing Library          |
| UMD builds                                         | An ESM CDN such as esm.sh                          |

- No longer needed and planned for deprecation: `forwardRef`,
  `<Context.Provider>`.
- Deprecated: `react-test-renderer`, reading `element.ref` (the ref is now
  `element.props.ref`), `useFormState` from `react-dom` (renamed to
  `useActionState` in `react`).
- The new JSX transform is required.
- Type changes (`useRef` needs an argument, no implicit `children`) are in
  [Typing React](../typescript/react.md).

### Migration

1. Upgrade to React 18.3 first: it is 18.2 plus warnings for everything removed
   in 19.
2. Run the codemods: `npx codemod@latest react/19/migration-recipe`, and for
   types `npx types-react-codemod@latest preset-19 ./src`.
3. Upgrade to 19 and fix the remaining warnings.

## Example

`ref` as a prop and `<Context>` as a provider:

```jsx
import { createContext, forwardRef } from 'react';

const ThemeContext = createContext('light');

// React 18
const OldInput = forwardRef(function OldInput(props, ref) {
  return <input ref={ref} {...props} />;
});

// React 19
// highlight-next-line
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

export function App() {
  return (
    // React 18: <ThemeContext.Provider value="dark">
    <ThemeContext value="dark">
      <Input placeholder="Name" />
    </ThemeContext>
  );
}
```

Document metadata from a component:

```jsx
function BlogPost({ post }) {
  return (
    <article>
      {/* React moves these tags to <head> */}
      {/* highlight-next-line */}
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

## Follow-up Questions

- What is an Action? A function called inside a transition. It can be async;
  React sets the pending state, shows errors through an error boundary and
  resets the form after a form Action.
- Is `use` a hook? It is called like a hook, only in components and hooks, but
  it can be called in a condition or a loop.
- Do I still need `useMemo` and `useCallback`? With React Compiler, rarely.
- Are Server Components part of React 19? The React APIs are stable; bundling
  and routing are done by a framework such as Next.js.
- What breaks when upgrading from 18? The removed APIs above, the type changes,
  and error reporting that relied on render errors being re-thrown.

## Common Mistakes

- "React Compiler is part of React 19": it is a separate package and works with
  React 17 and 18 too.
- Writing `forwardRef` in new code.
- Creating the promise for `use` in the same component on every render.
- "Server Components are SSR": SSR renders any component to HTML; Server
  Components run only on the server and never ship their code to the client.

## See Also

- [React 19 release post](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
