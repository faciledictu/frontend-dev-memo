---
sidebar_position: 17
description:
  Debounce vs throttle, where to use each, an implementation of both and how to
  use them in React
---

# Debounce and Throttle

Both limit how often a function runs when an event fires many times in a row.

- **Debounce** runs the function **once, after the events stop** for a given
  time. Every new event restarts the timer. Use it when only the final value
  matters: search input, autosave, form validation, `resize` that recalculates
  the layout.
- **Throttle** runs the function **at most once per interval** while the events
  keep coming. Use it for regular updates during a continuous action: `scroll`,
  `mousemove`, drag, progress reporting.

Both are **higher-order functions** built on a **closure** that keeps the timer
between calls.

## Details

### How They Differ

Ten events, one every 100 ms, with a 300 ms limit (each character in the diagram
is 100 ms):

```text
events:    ||||||||||
debounce:              *    once, 300 ms after the last event
throttle:  *  *  *  *       once per 300 ms while the events come
```

|                           | Debounce                    | Throttle                           |
| ------------------------- | --------------------------- | ---------------------------------- |
| Runs                      | after a pause in the events | regularly while events come        |
| During a continuous burst | never                       | once per interval                  |
| Typical delay             | 200–500 ms                  | 100–250 ms, or one animation frame |
| Typical use               | search, autosave, `resize`  | `scroll`, `mousemove`, drag        |

### Options

- **Trailing** (the default for debounce): run at the end of the burst.
- **Leading**: run on the first event, then ignore the rest of the burst. Good
  for buttons that must react immediately but not twice.
- **`cancel()`**: drop a pending call, for example when a component unmounts.
- **`flush()`**: run the pending call now, for example before the page is
  closed.
- In Lodash, `throttle(fn, ms)` is `debounce` with `leading: true` and
  `maxWait: ms`: a debounce that is forced to run at least once per interval.

### Alternatives

- **`requestAnimationFrame`** as a throttle for visual updates: at most once per
  frame, in sync with rendering.
- Passive listeners (`{ passive: true }`) and `IntersectionObserver` instead of
  heavy `scroll` handlers.
- In React, `useDeferredValue` and `startTransition` keep typing responsive
  without a fixed delay; they don't reduce the number of requests. See
  [Concurrent Rendering](../react/rendering/concurrent-rendering.md).

## Example

<details>
<summary>Implementation</summary>

```javascript
function debounce(fn, ms) {
  let timer;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  }

  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

function throttle(fn, ms) {
  let timer = null;
  let pendingArgs = null;
  let pendingThis;

  function tick() {
    if (pendingArgs) {
      fn.apply(pendingThis, pendingArgs);
      pendingArgs = null;
      timer = setTimeout(tick, ms);
    } else {
      timer = null;
    }
  }

  return function throttled(...args) {
    if (timer) {
      // Remember the latest call so the last event is not lost
      pendingArgs = args;
      pendingThis = this;
      return;
    }
    fn.apply(this, args); // leading call
    timer = setTimeout(tick, ms);
  };
}

const search = debounce((query) => console.log('search', query), 300);
search('r');
search('re');
search('react'); // only 'search react' is logged, 300 ms later
```

- `function debounced` (not an arrow function) receives the `this` of the call,
  and `fn.apply(this, args)` passes it on, so the wrapper works as a method.
- The arrow function inside `setTimeout` keeps that `this`.

</details>

<details>
<summary>In React</summary>

A new debounced function on every render would have its own timer, and nothing
would be debounced. Create it once and cancel it on unmount:

```jsx
function Search() {
  const [query, setQuery] = useState('');

  const fetchResults = useMemo(
    () => debounce((value) => searchApi(value), 300),
    []
  );

  useEffect(() => () => fetchResults.cancel(), [fetchResults]);

  return (
    <input
      value={query}
      onChange={(event) => {
        setQuery(event.target.value); // the input stays responsive
        fetchResults(event.target.value); // the request is debounced
      }}
    />
  );
}
```

`useMemo` is a performance hint, and React may discard its cache;
`useState(() => debounce(…))` or a ref guarantees a single instance. If the
debounced callback needs fresh props or state, read them through a ref updated
on every render, or use a hook such as `useDebouncedCallback` from
`use-debounce`.

</details>

## Follow-up Questions

- What happens if `this` is not passed through? A method wrapped in debounce
  runs with `this` equal to `undefined` (or the global object in sloppy mode).
- How do you make sure the last scroll position is handled by a throttle? Add a
  trailing call, as in the implementation above.
- Does debounce prevent responses from arriving out of order? No. A slow earlier
  request can still finish after a later one: cancel it with `AbortController`
  or ignore stale responses. See [Promises and async/await](./promises.mdx).

## Common Mistakes

- Mixing up the two: a debounced `scroll` handler does nothing while the user
  keeps scrolling.
- Creating the debounced function inside a render or inside the event handler:
  every call gets a new timer.
- Debouncing the state update of a controlled input: the typed characters appear
  with a delay. Debounce the expensive work, not the input.
- Not canceling a pending call on unmount: it runs later and works with a
  component that no longer exists.

## See Also

- [Closures](./closures.md)
- [Event Loop](./event-loop.md): timers
- [React Optimization](../react/performance/optimization.md)
