---
sidebar_posinion: 12
---

# Using Refs in React

Refs can be used to hold any mutable value that doesn't trigger a re-render when
it changes. This is useful for storing state that should not cause a re-render
when updated.

Although refs can keep any data, they are commonly used to directly access and
manipulate DOM nodes: for managing focus, text selection, triggering animations,
or integrating with third-party libraries. In this case you need to attach it to
React element via the `ref` attribute.

## Creating Refs

### Class Components

```javascript
import { Component } from 'react';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  render() {
    return <div ref={this.myRef}>Hello, world!</div>;
  }
}
```

Refs can also be created using callback functions.

```javascript
class MyComponent extends Component {
  setRef = (node) => {
    this.myRef = node;
  };

  render() {
    return <div ref={this.setRef}>Hello, world!</div>;
  }
}
```

### Functional Components

```javascript
import { useRef, useEffect } from 'react';

const MyFunctionalComponent = () => {
  const myRef = useRef(null);

  useEffect(() => {
    console.log(myRef.current); // Logs the DOM node
  }, []);

  return <div ref={myRef}>Hello, world!</div>;
};
```

## Forwarding Refs

In many scenarios, you may have a parent component that needs to interact with a
DOM element of a child component. But React components doesn't have the `ref`
prop by default. Refs can be forwarded to child components by wrapping your
functional component with `React.forwardRef`, and it returns a new component
that forwards the ref.

```javascript
import { forwardRef, useRef } from 'react';

const FancyButton = forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

const App = () => {
  const ref = useRef(null);

  return <FancyButton ref={ref}>Click me!</FancyButton>;
};
```

## Using Ref for Keeping Data

```javascript
import React, { useRef, useEffect, useState } from 'react';

const PreviousValue = () => {
  const [value, setValue] = useState('');
  const previousValueRef = useRef('');

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Current: {value}</p>
      <p>Previous: {previousValueRef.current}</p>
    </div>
  );
};
```

## `useImperativeHandle`

By default, refs point to a DOM node or a React element. However, sometimes you
need to expose certain functions or values from a child component to its parent.
useImperativeHandle allows you to define what the ref in the parent component
can access and interact with.

The useImperativeHandle hook takes three arguments:

1. `ref`: the ref object forwarded from the parent component.
2. `createHandle`: a function that returns the object to be exposed.
3. `[deps]`: an optional array of dependencies that, when changed, will re-create the handle.

```typescript
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// Define a functional component that uses useImperativeHandle
const MyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    blur: () => {
      inputRef.current.blur();
    },
    // Add any other methods or properties you want to expose
  }));

  return <input ref={inputRef} {...props} />;
});

function ParentComponent() {
  const inputRef = useRef();

  return (
    <div>
      <MyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus Input</button>
      <button onClick={() => inputRef.current.blur()}>Blur Input</button>
    </div>
  );
}

export default ParentComponent;
```
