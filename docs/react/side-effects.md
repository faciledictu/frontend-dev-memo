---
sidebar_position: 8
---

# Side Effects in React Components

Side effects can include data fetching, subscriptions, or manually changing the
DOM in React components.

To perform side effects in class components you can use such methods as
`componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

To perform side effects in functional components the hook 'useEffect' is used.

## `useEffect`

This hook runs asynchronously after rendering.

The first argument to useEffect is a function that contains the code for the
side effect.

The return value of the effect function can optionally be a cleanup function.
This cleanup function runs when the component unmounts or before running the
effect next time.

The second argument is an optional array of dependencies. If provided, the
effect will only re-run if any of the dependencies change between renders.

```javascript
useEffect(() => {
  // Side effect code here
  return () => {
    // Cleanup code here
  };
}, [dependencies]);
```

## `useLayoutEffect`

`useLayoutEffect` has the same signature as useEffect, but it fires
synchronously immediately after DOM mutations. This can be useful in situations
where you need to read layout from the DOM and then immediately set some state
or trigger another effect that depends on that layout.

It can be considered as an replacement to
`static getSnapshotBeforeUpdate(prevProps, prevState)` lifecycle method

:::tip When to Use

Use `useEffect` for most side effects that don't need to block the browser
painting. Use `useLayoutEffect` if you need to make changes that impact layout,
such as measuring DOM nodes or modifying the DOM directly after a render.

:::
