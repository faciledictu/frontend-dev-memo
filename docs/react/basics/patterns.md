---
sidebar_position: 7
description:
  Composition, conditional rendering, compound components, render props and HOCs
tags: [middle]
---

# Composition Patterns

React code is reused through **composition**, not inheritance. UI is composed
with `children` and **compound components**; logic is shared with **custom
hooks**, which replaced **render props** and **higher-order components** in most
cases.

Applies to: React 19.3.

## Details

| Pattern                | Idea                                                                    | Today                                    |
| ---------------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| Composition            | Pass JSX as `children` or other props instead of configuring with flags | The default                              |
| Conditional rendering  | `if`, a ternary or `&&` decides what to return                          | The default                              |
| Custom hook            | A `use…` function that shares stateful logic                            | The default for logic                    |
| Compound components    | Several components share implicit state through context                 | UI libraries: tabs, selects, accordions  |
| Render prop            | A prop that is a function returning JSX                                 | When the child decides what to pass back |
| Higher-order component | A function that takes a component and returns a new one                 | Legacy; replaced by hooks                |

### Conditional Rendering

- `if` with an early return, a ternary `a ? <A /> : <B />`, or `a && <A />`.
- **`&&` with a number.** `{count && <List />}` renders `0` when `count` is `0`:
  React skips `false`, `null` and `undefined`, but renders numbers. Write
  `count > 0 && …` or use a ternary.

### Composition

- A component that accepts `children` does not need to know what is inside:
  `<Card><Avatar user={user} /></Card>`.
- It removes [prop drilling](./props.md#prop-drilling): the data is used where
  the element is created.
- "Slots" are ordinary props with JSX: `<Layout sidebar={<Menu />} />`.

### Compound Components

The parent keeps the state and provides it through
[context](../hooks/context.md); the children read it. The user of the component
controls the markup and the order, the state stays hidden.

### Render Props and HOCs

- A **render prop** lets a component delegate rendering:
  `<MouseTracker render={(position) => …} />`. `children` can be such a function
  too.
- A **higher-order component** wraps a component to add props or behavior:
  `withRouter(Component)`, `connect(mapState)(Component)`.
- HOC problems: "wrapper hell" in DevTools, prop name collisions, unclear origin
  of props. A [custom hook](../hooks/hooks.mdx#custom-hooks) solves the same
  task without them.

## Example

Compound components:

```jsx
import { createContext, use, useState } from 'react';

const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);

  return <TabsContext value={{ value, setValue }}>{children}</TabsContext>;
}

function Tab({ value, children }) {
  const tabs = use(TabsContext);

  return (
    <button
      role="tab"
      aria-selected={tabs.value === value}
      onClick={() => tabs.setValue(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const tabs = use(TabsContext);
  return tabs.value === value ? <div role="tabpanel">{children}</div> : null;
}

export default function App() {
  return (
    <Tabs defaultValue="about">
      <Tab value="about">About</Tab>
      <Tab value="posts">Posts</Tab>
      <TabPanel value="about">About me</TabPanel>
      <TabPanel value="posts">My posts</TabPanel>
    </Tabs>
  );
}
```

<details>
<summary>Render prop and HOC</summary>

```jsx
import { useState } from 'react';

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      style={{ height: '100vh' }}
      onMouseMove={(event) =>
        setPosition({ x: event.clientX, y: event.clientY })
      }
    >
      {render(position)}
    </div>
  );
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <p>
      The mouse position is ({x}, {y})
    </p>
  )}
/>;
```

```jsx
function withAuthorization(WrappedComponent) {
  return function Authorized({ isAuthorized, ...rest }) {
    if (!isAuthorized) {
      return <h1>Unauthorized</h1>;
    }

    return <WrappedComponent {...rest} />;
  };
}

// Usage
const ProtectedSettings = withAuthorization(Settings);
```

</details>

## Follow-up Questions

- Why did hooks replace HOCs and render props? The same logic is shared without
  extra components in the tree and with explicit inputs and outputs.
- Composition or inheritance? Composition: React components are not extended
  from one another.
- What is a controlled compound component? The root component (`<Tabs>`) takes
  the value and a change callback like an input (`value` / `onValueChange` in
  Radix, `selectedIndex` / `onChange` in Headless UI), so its owner keeps the
  state; the uncontrolled one takes `defaultValue`.

## Common Mistakes

- `{items.length && <List />}` rendering `0`.
- Creating a HOC inside a component: a new component type on every render
  remounts the subtree.

## See Also

- [Error Boundaries](./error-boundaries.md)
- [Hooks](../hooks/hooks.mdx)
- [Design Patterns](../../programming/patterns.md) — GoF patterns in JavaScript.
- [Higher-Order Components (legacy docs)](https://legacy.reactjs.org/docs/higher-order-components.html)
