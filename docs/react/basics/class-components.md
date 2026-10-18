---
sidebar_position: 9
description:
  Legacy class components, lifecycle methods and their hook equivalents
tags: [junior, middle]
---

# Class Components and Lifecycle Methods

A **class component** is a class that extends `Component` and has a `render()`
method. State is kept in `this.state` and updated with `this.setState()`, and
**lifecycle methods** are used instead of hooks. It is a **legacy** API: new
code uses function components. The only common feature that still needs a class
is an [error boundary](./patterns.md#error-boundaries).

Applies to: React 19.3.

## Details

### Lifecycle Methods

| Phase   | Method                                               | Purpose                                          | With hooks                          |
| ------- | ---------------------------------------------------- | ------------------------------------------------ | ----------------------------------- |
| Mount   | `constructor(props)`                                 | Initialize state                                 | `useState(initialValue)`            |
| Mount   | `componentDidMount()`                                | Subscribe, fetch, read the DOM                   | `useEffect(fn, [])`                 |
| Update  | `shouldComponentUpdate(nextProps, nextState)`        | Skip a re-render                                 | `memo`                              |
| Update  | `getSnapshotBeforeUpdate(prevProps, prevState)`      | Read the DOM before it changes (scroll position) | No equivalent                       |
| Update  | `componentDidUpdate(prevProps, prevState, snapshot)` | React to changed props or state                  | `useEffect(fn, [deps])`             |
| Unmount | `componentWillUnmount()`                             | Unsubscribe, clear timers                        | The cleanup function of `useEffect` |
| Any     | `static getDerivedStateFromProps(props, state)`      | Derive state from props (rarely needed)          | Compute during render               |
| Error   | `static getDerivedStateFromError(error)`             | Switch to a fallback UI                          | No equivalent                       |
| Error   | `componentDidCatch(error, info)`                     | Log the error                                    | No equivalent                       |

- `render()` runs on mount and on every update, between the methods above. It
  must be pure.
- Methods before `render` belong to the **render phase**, `componentDid…` and
  `componentWillUnmount` to the **commit phase**, see
  [Rendering](../rendering/reconciliation.md#render-and-commit).
- `componentWillMount`, `componentWillReceiveProps` and `componentWillUpdate`
  are deprecated and renamed to `UNSAFE_…`; the old names still work with a
  warning.

### Differences from Function Components

- `this.setState` **merges** the object into the state; a `useState` setter
  replaces the value.
- Methods passed as handlers lose `this`, so they are declared as arrow class
  fields or bound in the constructor.
- `this.props` and `this.state` are mutable and always the latest; a function
  component captures the values of its render.
- Classes can't use hooks. Logic was shared with
  [HOCs and render props](./patterns.md).
- `PureComponent` adds a shallow comparison of props and state, like `memo`.

A function component has no lifecycle methods. It goes through the same stages
with [effects](../hooks/side-effects.md): the setup runs after mount and after
every update with changed dependencies, the cleanup runs before the next setup
and on unmount.

## Example

```jsx
import { Component } from 'react';

export default class Timer extends Component {
  state = { seconds: 0 };

  componentDidMount() {
    this.intervalId = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  tick = () => {
    this.setState((prevState) => ({ seconds: prevState.seconds + 1 }));
  };

  render() {
    return <p>Seconds: {this.state.seconds}</p>;
  }
}
```

## Follow-up Questions

- Where is data fetched in a class? In `componentDidMount`, not in the
  constructor: the constructor is part of the render phase and must be pure.
- Is `this.setState` synchronous? No, updates are batched as with hooks. The
  second argument is a callback that runs after the update is committed.
- Why were `componentWillMount` and `componentWillReceiveProps` deprecated? They
  run in the render phase, which may run several times or be thrown away under
  [concurrent rendering](../rendering/concurrent-rendering.md); side effects in
  them were unsafe.
- `PureComponent` or `Component`? `PureComponent` skips the re-render when props
  and state are shallowly equal.
- Are class components removed in React 19? No, they are still supported, but
  hooks (including `useActionState` and `useOptimistic`) and `use` are not
  available in them.

## Common Mistakes

- Mutating `this.state` directly instead of calling `setState`: there is no
  re-render.
- Calling `setState` in `render`: an infinite loop.
- Passing a method as a handler without binding `this`.
- Copying props into state with `getDerivedStateFromProps` instead of computing
  the value during render.

## See Also

- [Lifecycle methods diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
- [State](./state.md)
