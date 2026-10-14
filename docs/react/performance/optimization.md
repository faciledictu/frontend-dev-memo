---
sidebar_position: 1
description:
  When to optimize, component structure, memo, useMemo, useCallback and React
  Compiler
---

# Optimizing React Components

React is fast by default, and a re-render is usually cheap. Optimization starts
with **measuring** (the Profiler) and goes in this order: fix the **structure**
(keep state close to where it is used, pass `children`), then **memoize**
(`memo`, `useMemo`, `useCallback`, or **React Compiler**, which does it
automatically at build time), then **do less work** (virtualization,
transitions, code splitting).

Applies to: React 19, React Compiler 1.0.

## Details

### Structure First

- **Move state down.** State that only an input uses should live in the
  component with that input, not in the page: then only it re-renders.
- **Pass content as `children`.** Elements created by the parent keep the same
  reference when the wrapper's own state changes, so React skips them.
- **Don't define components inside components**: a new type on every render
  remounts the subtree.
- **Use stable keys** in lists, see
  [Diffing Heuristics](../basics/rendering.md#diffing-heuristics).

### Memoization

| API                                      | What it does                                     | When it helps                                                          |
| ---------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| `memo(Component)`                        | Skips the re-render if props are shallowly equal | A slow component that often re-renders with the same props             |
| `useMemo(fn, deps)`                      | Caches the result of a calculation               | An expensive calculation, or a stable reference for an object or array |
| `useCallback(fn, deps)`                  | Caches the function itself                       | The function is a prop of a `memo` component or a dependency of a hook |
| `PureComponent`, `shouldComponentUpdate` | The same as `memo` for class components          | Legacy code                                                            |

- `useCallback` is **not about expensive functions**. Creating a function is
  cheap; the point is the same reference between renders.
  `useCallback(fn, deps)` equals `useMemo(() => fn, deps)`.
- `memo` works only if **every** prop keeps its reference. One inline object,
  arrow function or JSX `children` makes it useless.
- `memo` does not block updates from the component's own state or from context.
- Memoization has a price: memory, comparisons on every render, more code and
  bugs from wrong dependencies. Applied everywhere, it mostly adds noise.

### React Compiler

- A build-time tool (a Babel plugin, stable since October 2025) that memoizes
  components, values and functions automatically, more precisely than manual
  code.
- With it, `memo`, `useMemo` and `useCallback` are rarely written by hand. They
  remain an escape hatch for precise control, for example over an effect
  dependency.
- It relies on the **Rules of React**: pure components, immutable props and
  state, the [Rules of Hooks](../hooks/hooks.mdx#rules-of-hooks). A component
  where the compiler detects a violation is skipped.
- So the answer to "when to memoize": with the compiler, almost never by hand;
  without it, after profiling, where a slow subtree re-renders with unchanged
  props.

### Measuring

- **React DevTools Profiler**: which components rendered, how long it took and
  why.
- The browser's Performance panel for everything outside React.
- Measure a **production build** (a profiling build for the React Profiler):
  development mode is several times slower.

### Doing Less Work

- [Virtualization](./virtualization.md) for long lists.
- [Transitions and `useDeferredValue`](./concurrent-rendering.md) to keep the UI
  responsive during a slow render.
- [Code splitting](../../web-platform/tools/bundle-optimization.md) with `lazy`.
- Debounce or throttle for frequent events.

## Example

Moving state down instead of memoizing:

```jsx
import { useState } from 'react';
import ExpensiveTree from './ExpensiveTree';

// Before: every keystroke re-renders <ExpensiveTree />
function PageBefore() {
  const [text, setText] = useState('');

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <ExpensiveTree />
    </>
  );
}

// After: the state lives in SearchInput, the page does not re-render
function SearchInput() {
  const [text, setText] = useState('');
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}

function PageAfter() {
  return (
    <>
      <SearchInput />
      <ExpensiveTree />
    </>
  );
}
```

Manual memoization: `memo` needs stable props, so the callback and the derived
array are cached too.

```jsx
import { memo, useCallback, useMemo, useState } from 'react';

const ProductList = memo(function ProductList({ products, onSelect }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id} onClick={() => onSelect(product.id)}>
          {product.name}
        </li>
      ))}
    </ul>
  );
});

export default function Catalog({ products }) {
  const [selectedId, setSelectedId] = useState(null);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const visibleProducts = useMemo(
    () => (onlyInStock ? products.filter((p) => p.inStock) : products),
    [products, onlyInStock]
  );

  const handleSelect = useCallback((id) => setSelectedId(id), []);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={onlyInStock}
          onChange={(e) => setOnlyInStock(e.target.checked)}
        />
        In stock only
      </label>
      <p>Selected: {selectedId}</p>
      {/* Selecting a product does not re-render the list */}
      <ProductList products={visibleProducts} onSelect={handleSelect} />
    </>
  );
}
```

## Follow-up Questions

- What is the difference between `useMemo` and `useCallback`? `useMemo` caches
  the value returned by a function; `useCallback` caches the function.
- Why not wrap everything in `memo`? It costs comparisons and memory, breaks
  silently on one unstable prop, and hides structural problems.
- What does `memo` compare? Each prop with `Object.is` (a shallow comparison). A
  custom comparison function can be passed as the second argument.
- Does `key` improve performance? It is about identity: a stable key lets React
  move an item instead of recreating it. It is not a general optimization tool.

## Common Mistakes

- Wrapping "heavy" functions in `useCallback`.
- `memo` on a component that receives an inline object or callback.
- Optimizing without profiling, or profiling a development build.
- `useMemo` for a trivial calculation.
- Deep comparison in a custom `memo` comparator: it can cost more than the
  render.

## See Also

- [Rendering and Reconciliation](../basics/rendering.md)
- [Bundle Optimization](../../web-platform/tools/bundle-optimization.md)
