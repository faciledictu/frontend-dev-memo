---
sidebar_position: 10
---

# State

In React, state refers to a built-in object that stores property values that
belong to a component. When the state object changes, the component re-renders.

## Working with State in Class Components

In class components, the state is typically initialized in the constructor
method as the `state` property and updated using the `this.setState` method.

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };
  }

  handleIncrement() => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  }

  render() {
    return (
      <div>
        <button onClick={increment}>+ 1</button>
        <p>Count: {this.state.count}</p>
      </div>
    );
  }
}
```

## `useState`

In functional components, the state should be initialized with `useState()`
hook. It returns a variable containing state and function to update it.

Setter function schedules an update to the component’s state and tells React
that this component and its children need to be re-rendered with the updated
state.

```javascript
const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1);
};

return (
  <div>
    <button onClick={increment}>+ 1</button>
    <p>Count: {count}</p>
  </div>
);
```

## Asynchornous nature of setting state

The `setState` function is asynchronous to optimize performance and ensure that
the UI is updated efficiently. When you call `setState`, React batches multiple
state updates and re-renders the component once, rather than re-rendering after
each individual state update.

```javascript
const [count, setCount] = useState(0);
setCount(count + 1);
console.log(count); // Will return the old state value
```

React batches state updates for performance optimization. When multiple setState
calls are made, React groups them together and performs a single re-render at
the end of the event loop, rather than after each individual state update.

```javascript
const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
  // After all 3 setCount calls, count is incremented only by 1 because each time setCount
  // recieves the old count value. Think about the count value as a closure:
  //   setCount(0 + 1);
  //   setCount(0 + 1);
  //   setCount(0 + 1);
};

return (
  <div>
    <button onClick={increment}>+ 3</button>
    <p>Count: {count}</p>
  </div>
);
```

### Functional Updates

To avoid this, setter function that can accept an updater function. This
function receives the previous state as an argument and returns the new state.

```javascript
const increment = () => {
  setCount((prevCount) => prevCount + 1);
  setCount((prevCount) => prevCount + 1);
  setCount((prevCount) => prevCount + 1);
  // After all 3 setCount calls, count is incremented by 3
};
```

### Batching

React groups multiple state updates into a single re-render for optimization
purposes.

When several state updates are triggered in a React component, React batches
them together. Instead of re-rendering the component after each individual state
update, React processes all updates in a batch and performs a single re-render.

It works in React event handler as well. The click on the button will trigger
only one re-render, not 3.

```javascript
const [count, setCount] = useState(0);

const increment = () => {
  setCount((prevCount) => prevCount + 1);
  setCount((prevCount) => prevCount + 1);
  setCount((prevCount) => prevCount + 1);
};

return (
  <div>
    <button onClick={increment}>+ 3</button>
    <p>Count: {count}</p>
  </div>
);
```

:::info Automatic Batching

In earlier versions of React, when `setState` is called inside an asynchronous
function (of promises, `setTimeout`, native event handlers), each call will
trigger a separate re-render.

With _Automatic Batching_ feature of React 18, batching extends to asynchronous
functions, making it more comprehensive.

:::

## `useReducer`

The `useReducer` hook is a built-in React hook that provides an alternative to
`useState` for managing state in functional components.

:::note When to Use

It's particularly useful By using useReducer, you can manage state in a more
declarative and predictable manner.

It can be useful when:

- you have complex state logic that involves multiple sub-values,
- the next state depends on the previous one,
- when multiple actions lead to the same state update.

:::

You start by defining a reducer function. This function takes the current state
and an action as arguments and returns a new state based on the action.

```javascript
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    default:
      throw new Error();
  }
};
```

You also need to define an initial state. This can be a single value, an object,
or an array.

```javascript
const initialState = { count: 0 };
```

You use the useReducer hook, passing in your reducer function and initial state.
It returns an array containing the current state and a dispatch function

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

To update the state, you call the dispatch function with an `action` argument
that describes what should happen.

```javascript
dispatch({ type: 'increment' });
```

:::tip

Conventionally, `action` argument is an object that has a `type` property that
indicates the type of action and can have additional data as needed

:::
