---
sidebar_position: 21
---

# Concurrent Mode

:::info

Concurrency is a way of using multiple tasks at once to make software run
faster. It uses system resources more efficiently, which can improve how well an
application works.

:::

Concurrent mode was introduced in React 18. It lets developers build components
that render at the same time, without blocking the user interface. This means
users can interact with your page without noticing a re-render.

Concurrency isn’t a new feature. It’s rather an internal technique and related
public API that allows React to render multiple versions of the UI
simultaneously. React uses priority queues and multiple buffering to implement
concurrency.

To get the benefits of Concurrency mode, you need to use some related public
APIs.

## Suspense

Suspense is a React feature that lets components "wait" for something before
they render. It’s typically used to handle asynchronous operations like data
fetching or
[loading code-split components](./bundle-optimization.md#splitting-code-into-chunks).

```javascript
import React, { useState, Suspense } from 'react';

const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data loaded successfully');
    }, 2000); // Simulating a delay in data fetching
  });
};

const DataComponent = () => {
  const [data, setData] = useState(null);

  const loadData = async () => {
    const result = await fetchData();
    setData(result);
  };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {data ? <p>{data}</p> : <button onClick={loadData}>Load Data</button>}
      </Suspense>
    </div>
  );
};

export default DataComponent;
```

## Transitions

`useTransition` is a React hook that helps you manage state transitions in your
application, particularly for transitions that might take a noticeable amount of
time, like data fetching or complex calculations. It allows you to provide
feedback to users during these transitions, improving the overall user
experience.

- The hook returns a boolean value indicating if a transition is pending, and a
  function to start the transition.
- Use the startTransition function to wrap the state updates that you want to
  defer.

```javascript
import React, { useState, useTransition } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      setCount((prevCount) => prevCount + 1);
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Increment</button>
      {isPending ? <p>Loading...</p> : <p>Count: {count}</p>}
    </div>
  );
}

export default MyComponent;
```

## useDeferredValue

During the initial render, the `deferredValue` matches the provided `value`. On
updates, React first re-renders with the old value, then re-renders in the
background with the new value.

```javascript
const deferredValue = useDeferredValue(value);
```

Consider this example from the official documentation[^1]

```javascript
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

If we type _"a"_ in the input, we will see "Loading..." fallback before the data
will be returned from `SearchResults` component

**Initial Render.** When you type _"ab"_, React re-renders with the new query
("ab") but the old deferredQuery ("a").

**Background Update.** React then tries to re-render with both query and
deferredQuery set to "ab". If this succeeds, it updates the screen. If the data
isn't ready, React waits and retries, showing the old deferredQuery until then.

:::note

This deferred rendering is interruptible. If you keep typing, React abandons the
current attempt and restarts with the latest value. Each keystroke still
triggers a network request, but responses are cached, making actions like
pressing Backspace instantaneous.

:::

[^1]: https://react.dev/reference/react/useDeferredValue
