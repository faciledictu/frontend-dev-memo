---
sidebar_position: 13
---

# React Context

React Context is a way to manage state globally in an application. It allows you
to share values between components without having to explicitly pass props
through every level of the component tree.

This can be very useful for managing things like user authentication status,
themes, or any other data that needs to be accessible throughout your app.

## How to Use

### Create Context

Use `React.createContext` API.

```javascript
import { createContext } from 'react';

export const MyContext = createContext();
```

### Provide Context

Wrap your component tree with the `MyContext.Provider` and pass the context
value.

```javascript
const MyProvider = ({ children }) => {
  const value = {
    /* your context value */
  };

  return <MyContext.Provider value={value}><{children}></MyContext.Provider>;
};
```

### Consume Context

There are a few ways to consume context: `useContext` hook (for functional
components), `Context.Consumer` high order component (for both functional and
class components), or `static contextType` (for class components).

```javascript
import { useContext } from 'react';

const MyComponent = () => {
  const context = useContext(MyContext);

  return <div>{/* Use context value */}</div>;
};
```

```javascript
const MyComponent = () => (
  <MyContext.Consumer>
    {(context) => <div>{/* Use context value */}</div>}
  </MyContext.Consumer>
);
```

```javascript
class MyComponent extends React.Component {
  static contextType = MyContext;

  render() {
    const context = this.context;
    return <div>{/* Use context value */}</div>;
  }
}
```

:::warning

If the context value updates frequently, it might cause performance issues
because any component that consumes the context will re-render whenever the
context value changes

:::

## Memoization

Use `useMemo` to memoize context values if they depend on expensive
computations.

```javascript
const MyProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      /* your context value */
    }),
    [
      /* dependencies */
    ]
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
```
