---
sidebar_position: 17
---

# Optimisation of React Components

## The `key` Prop

Ensure that you provide a stable key for each item in a list. This helps React
identify which items have changed, added, or removed.

In React, "keys" are special attributes you need to include when creating lists
of elements. Each key must be unique among its siblings. Commonly, you can use
unique IDs from your data.

```javascript
const listItems = items.map((item) => <li key={item.id}>{item.name}</li>);
```

:::tip

Ensure that the key remains stable and unique over time. So using array indexes
as keys isn't a best practice, especially if the list can change. Using
non-unique keys or keys that change can lead to unpredictable behaviour.

:::

## Memoization for Functional Components

### `React.memo`

Wrap functional components with `React.memo` to prevent re-renders when props
remain unchanged.

```javascript
const MyComponent = React.memo((props) => {
  // Component code
});
```

### Hooks

Passing new anonymous functions or objects to a child component causes
re-rendering because they are generated each time the parent component renders.
Use `useCallback` for functions and `useMemo` for objects and pass an array of
dependencies as the second argument. These hooks don't create objects from
scratch on every re-render, but return the same refenrences when none of the
dependencies changes.

```javascript
const handleClick = useCallback(() => {
  // Handle click
}, []);

const memoizedValue = useMemo(() => ({ key: value }), [value]);

return <MyComponent onClick={handleClick} config={memoizedValue} />;
```

## Optimization of Class Components

Extend PureComponent instead of Component to automatically perform a shallow
comparison of props and state.

```javascript
class MyComponent extends React.PureComponent {
  // Component code
}
```

Alternatively, implement shouldComponentUpdate to manually control updates.

```javascript
class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // Return true or false based on comparison of nextProps and nextState
    // with current props and state
  }
  // Component code
}
```

## Avoiding Excessive Memoization

Memoization can be a powerful tool in React for optimizing performance by
preventing unnecessary re-renders. However, excessive memoization can lead to
complexity and performance issues of its own.

**Identify Performance Bottlenecks.** Only apply memoization to components that
are confirmed to cause performance issues.

**Measure Performance.** Use React's Profiler or other performance measurement
tools to identify components that benefit from memoization.

**Compute-Intensive Functions.** Wrap only those functions or values in useMemo
and useCallback that are computationally intensive or cause significant
re-renders.

**Avoid Premature Optimization.** Don’t memoize everything by default. Assess
the performance impact first.
