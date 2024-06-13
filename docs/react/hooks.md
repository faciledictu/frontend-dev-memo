---
sidebar_position: 6
---

# Hooks

Hooks are functions that allow you to use additional React features in
functional components. They were introduced in React 16.8 to provide a way to
use stateful logic and side effects (like fetching data or subscribing to
events) in functional components, which were previously only possible in class
components.

Using hooks makes it easier to reuse stateful logic without changing component
hierarchy (unlike higher-order components or render props). They also promote
cleaner and more readable code in functional components.

## Rules of Hooks

**Consistent Call Order.** Hooks should always be called in the same order each
time a component renders. This allows React to correctly preserve the state of
hooks between multiple calls and ensures predictable behavior.

**Top-Level Only.** Hooks must be called at the top level of a React functional
component or in custom hooks (which are functions that use hooks). This ensures
that React can maintain the order of hooks calls between renders.

These rules mean that you can't use hooks in conditions. Here is a bad example

```javascript
function InvalidComponent() {
  if (condition) {
    useEffect(() => {
      // This is a violation of the rules of hooks
    }, []);
  }
  return <div>Invalid Component</div>;
}
```

However, there are ways to achieve similar effect. Here are an example where the
component state updates conditionally.

```javascript
function ValidComponent() {
  useEffect(() => {
    if (condition) {
      // Properly condition the effect inside useEffect
    }
  }, [condition]);

  return <div>Valid Component</div>;
}
```

```javascript
import React, { useState, useEffect } from 'react';

function ConditionalEffectComponent() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (shouldFetch) {
      setIsLoading(true);
      // Simulate fetching data
      setTimeout(() => {
        setData({ message: 'Data fetched successfully' });
        setIsLoading(false);
      }, 2000);
    }
  }, [shouldFetch]);

  const handleFetchData = () => {
    setShouldFetch(true);
  };

  return (
    <div>
      <button onClick={handleFetchData}>Fetch Data</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {data.message}</p>}
    </div>
  );
}

export default ConditionalEffectComponent;
```

## Custom Hooks

Custom hooks allow you to extract reusable logic from components into reusable
functions. They follow the same rules as standard hooks but encapsulate more
complex stateful logic or side effects that can be reused across multiple
components.

```javascript title="useToggle.js"
import { useState } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => {
    setValue(!value);
  };

  return [value, toggle];
}
```

:::info

When you create custom hooks, their names must start with the prefix "use". This
convention helps distinguish hooks from regular functions and indicates that
they may use React state or effects

:::

Once you have defined a custom hook, you can use it in any functional component

```javascript title="ToggleComponent.jsx"
import React from 'react';
import useToggle from './useToggle'; // Assume useToggle is defined in a separate file

function ToggleComponent() {
  const [isOn, toggleIsOn] = useToggle(false);

  return (
    <div>
      <button onClick={toggleIsOn}>{isOn ? 'ON' : 'OFF'}</button>
      <p>Current state: {isOn ? 'ON' : 'OFF'}</p>
    </div>
  );
}

export default ToggleComponent;
```

### Benefits

**Code Reusability.** Custom hooks allow you to encapsulate complex logic into a
single function that can be reused across multiple components. This promotes
cleaner and more modular code.

**Separation of Concerns.** By extracting logic into custom hooks, you can
separate concerns between UI components and business logic, making your
components more focused and easier to maintain.

**Simplifies Testing.** Logic encapsulated in custom hooks can be tested
independently, improving the testability of your React applications.
