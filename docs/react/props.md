---
sidbar_position: 6
---

# Props

Props (short for properties) are are used to pass data from from a parent
component to a child component. This makes components reusable and helps
maintain a clear data flow in your application.

```javascript
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Greeting name="Alice" />;
```

Props are read-only, meaning a child component cannot modify the props it
receives. This immutability ensures that data flows in one direction (from
parent to child), which simplifies understanding how data changes in the
application. If child components could modify props, it would be harder to track
the state and data flow.

## Default Props

You can define default values for your props if they are not provided by the
parent component by using `defaultProps` property.

```javascript
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

Greeting.defaultProps = {
  name: 'Guest',
};

// Usage
<Greeting />;
```

## Prop Typing

There are two ways to specify the expected types for the props a component
receives. This helps with type checking and ensures that the component is used
correctly.

### Runtime Typing

For runtime typing, React provides a library called `prop-types` to define these
types.

```javascript
import PropTypes from 'prop-types';

function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
};

// Usage
<Greeting name="Alice" />;
```

It helps catch errors during development by providing warnings in the console if
a prop doesn’t match the expected type. However, these checks happen at runtime,
which means they can’t prevent type errors during the build process or offer
full guarantees.

## Static Type Checkers

Flow and TypeScript are static type checkers that help catch errors during the
development process, before the code runs.

:::info

TypeScript's tooling is often considered more mature and better integrated with
modern development environments. While Flow is purely a type checker, TypeScript
is a superset of JavaScript and includes its own language features. TypeScript
has a larger community and broader support.

:::

TypeScript typing:

```typescript
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Greeting name="Alice" />;
```

## Reverse Data Flow

There are scenarios where child components need to communicate changes back to
their parent components. This is typically done using callback functions passed
via props.

1. Create a function in the parent component that will handle the data or event.
2. Pass the callback function to the child component as a prop.
3. In the child component, invoke the callback function (e.g., in response to
   user input or other events).

```javascript
function ParentComponent() {
  const [data, setData] = React.useState('');

  const handleDataChange = (newData) => {
    setData(newData);
  };

  return <ChildComponent onDataChange={handleDataChange} />;
}

function ChildComponent({ onDataChange }) {
  const handleInputChange = (event) => {
    onDataChange(event.target.value);
  };

  return <input type="text" onChange={handleInputChange} />;
}
```
