---
sidebar_position: 16
---

# Common Patterns

## Conditional Rendering

Depending on the state of your application, you can render different components
or elements.

```javascript
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }

  return <h1>Please sign in.</h1>;
}
```

## Render Props

Render props is a technique for sharing code between React components using a
prop whose value is a function. This function returns a React element and allows
the parent component to control what is rendered by a child component.

```javascript
function MouseTracker({ render }) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div style={{ height: '100vh' }} onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <h1>
      The mouse position is ({x}, {y})
    </h1>
  )}
/>;
```

Some libraries provide components that using render props such as
[Controller](https://react-hook-form.com/docs/usecontroller/controller) from
react-hook-form.

## Higher-Order Components (HOCs)[^1]

A higher-order component is a function that takes a component and returns a new
component. HOCs are used to add additional functionality to existing components.

:::note

Higher-order components are not commonly used in modern React code.

:::

```javascript
function withAuthorization(WrappedComponent) {
  return class extends React.Component {
    render() {
      const { isAuthorized, ...rest } = this.props;
      if (!isAuthorized) {
        return <h1>Unauthorized</h1>;
      }
      return <WrappedComponent {...rest} />;
    }
  };
}

// Usage
const AuthorizedComponent = withAuthorization(SomeComponent);
```

:::info See aslo

[Custom hooks](./hooks.mdx#custom-hooks) can be considered as a common pattern
that can be used instead HOCs in functional components. They allow you to
extract component logic into reusable functions.

:::

## Error Boundaries

There is no option to catch errors using functional components. By wrapping your
functional components into one class component you can catch JavaScript errors
anywhere in their child component tree, log those errors, and display a
fallback.

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <ComponentThatMayThrowError />
    </ErrorBoundary>
  );
}
```

[^1]: https://legacy.reactjs.org/docs/higher-order-components.html
