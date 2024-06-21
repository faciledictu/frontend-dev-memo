---
sidebar_position: 19
---

# Recompose

Recompose is a React utility belt for function components and higher-order
components. It provides a set of helper functions to manipulate and enhance
component logic, making your code cleaner and more reusable.

It promotes the use of functional programming techniques, making your React code
more declarative and concise.

## Commonly Used Functions

- `withState` adds state management to a functional component

```javascript
const enhance = withState('counter', 'setCounter', 0);
const Counter = enhance(({ counter, setCounter }) => (
  <div>
    <p>{counter}</p>
    <button onClick={() => setCounter(counter + 1)}>Increment</button>
  </div>
));
```

- `withHandlers` adds event handlers to a functional component

```javascript
const enhance = withHandlers({
  onClick:
    ({ counter, setCounter }) =>
    () =>
      setCounter(counter + 1),
});
const Button = enhance(({ counter, onClick }) => (
  <button onClick={onClick}>{counter}</button>
));
```

- `compose` composes multiple HOCs into a single higher-order function.

```javascript
const enhance = compose(
  withState('counter', 'setCounter', 0),
  withHandlers({
    onClick:
      ({ counter, setCounter }) =>
      () =>
        setCounter(counter + 1),
  })
);
const Button = enhance(({ counter, onClick }) => (
  <button onClick={onClick}>{counter}</button>
));
```

- `withProps` offers tools for managing props passed to a component

```javascript
const enhance = withProps({ additionalProp: 'I am a prop' });
const EnhancedComponent = enhance(({ additionalProp }) => (
  <div>{additionalProp}</div>
));
```

## Lifecycle Management

`lifecycle` HOC allows you to declare lifecycle methods directly within
functional components.

```javascript
const enhance = lifecycle({
  componentDidMount() {
    console.log('Component did mount');
  },
  componentDidUpdate(prevProps, prevState) {
    console.log('Component did update');
  },
  componentWillUnmount() {
    console.log('Component will unmount');
  },
});

const MyComponent = enhance(({ someProp }) => <div>{someProp}</div>);
```

## Memoization

`onlyUpdateForKeys` HOC enhances a component to only update when specific keys
in props change, optimizing rendering.

```javascript
const enhance = withPropsOnChange(['triggerProp'], ({ triggerProp }) => ({
  calculatedProp: triggerProp * 2,
}));
const EnhancedComponent = enhance(({ calculatedProp }) => (
  <div>{calculatedProp}</div>
));
```

:::tip

Recompose is particularly useful in larger applications where you need to manage
complex state and side effects. It helps in keeping the codebase maintainable
and easy to understand by breaking down functionalities into smaller, reusable
pieces.

:::
