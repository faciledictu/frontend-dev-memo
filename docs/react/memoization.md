---
sidebar_position: 11
---

# Memoization

## Class Components

`PureComponent` is a base class in React that you can extend to create
components that implement a shallow comparison of props and state. If none of
the props or state objects have changed, the component will not re-render. This
can help improve the performance of your application by reducing unnecessary
re-renders.

:::tip

Use PureComponent just like Component, where `shouldComponentUpdate` has the
shallow props comparison logic by default.

It is not suitable for complex or nested data structures where a deep comparison
is necessary.

:::

```jsx
import { PureComponent } from 'react';

class MyComponent extends PureComponent {
  render() {
    return <div>{this.props.name}</div>;
  }
}
```

## Functional Components

`memo` is a higher-order component (HOC) provided by React for functional
components. It is similar to `PureComponent`, but it is used for optimizing
functional components by memoizing the output.

```jsx
import { memo } from 'react';

const MyFunctionalComponent = ({ name }) => {
  return <div>{name}</div>;
};

export default memo(MyFunctionalComponent);
```

You can also pass a custom comparison function to memo if you need more control
over the re-rendering behavior.

```jsx
const areEqual = (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.name === nextProps.name;
};

export default memo(MyFunctionalComponent, areEqual);
```
