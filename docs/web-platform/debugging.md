---
sidebar_position: 9
description: Console, breakpoints, DevTools panels, React and Redux DevTools
---

# Debugging Web Applications

Debugging is choosing the right tool for the kind of problem:

- **Console** for a quick check of a value. It is the simplest tool, not the
  most powerful one.
- **Breakpoints** and `debugger` to stop the code and inspect its state.
- **Network** panel for requests; **Performance** and **Memory** panels for slow
  pages and leaks.
- **React DevTools** and **Redux DevTools** for components and store state.

## Details

### Console

| Method                               | What it does                            |
| ------------------------------------ | --------------------------------------- |
| `console.log()`, `warn()`, `error()` | prints a message with a level           |
| `console.table()`                    | shows an array of objects as a table    |
| `console.group()` / `groupEnd()`     | groups related messages                 |
| `console.count()`                    | counts how many times this call has run |
| `console.time()` / `timeEnd()`       | measures how long an operation takes    |
| `console.trace()`                    | prints the call stack                   |

The console shows a **live reference** to an object: when it is expanded, it
shows the current state, not the state at the time of logging.

### Breakpoints

| Type           | When it pauses                                                    |
| -------------- | ----------------------------------------------------------------- |
| `debugger`     | a statement in the code; works only while DevTools is open        |
| Line           | at a line; set by a click on the line number in the Sources panel |
| Conditional    | at a line, only if the expression is true                         |
| Logpoint       | does not pause: logs an expression without changing the code      |
| DOM            | when a node, its attributes or its subtree change                 |
| XHR / fetch    | when a request is sent to a URL that contains a given string      |
| Event listener | when an event of a given type is handled                          |
| Exceptions     | when an error is thrown, caught or uncaught                       |

- While paused, the debugger shows the **scope** variables, the **call stack**
  and watch expressions; execution continues with step over, step into and step
  out.
- **Source maps** connect the minified or compiled code to the original source,
  so breakpoints and stack traces work in TypeScript and JSX. For production
  they are usually uploaded to an error tracker instead of being public.

### DevTools Panels

| Panel       | What it is for                                                             |
| ----------- | -------------------------------------------------------------------------- |
| Elements    | the DOM tree, applied and computed styles, the box model                   |
| Network     | requests: status, headers, payload, timing; throttling and disabling cache |
| Performance | a recording of the main thread: long tasks, layout, paint, frames          |
| Memory      | heap snapshots; comparing two of them shows what leaks                     |
| Application | cookies, `localStorage`, IndexedDB, service workers                        |
| Lighthouse  | an audit of performance, accessibility, SEO and best practices             |

### React DevTools

A browser extension that adds two tabs to DevTools:

- **Components**: the component tree. For the selected component it shows props,
  state and hooks, including context values, and lets you edit them in place.
- **Profiler**: records renders and shows which components rendered in each
  commit, how long it took and why. The setting "Highlight updates when
  components render" outlines re-rendering components on the page.

### Redux DevTools

- A log of all dispatched actions with the state and its diff after each one.
- **Time travel**: jumping to the state after any action or skipping an action.
- With Redux Toolkit it works without setup: `configureStore` enables it.

## Example

```javascript
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
];

console.table(users);

console.time('sort');
users.sort((a, b) => a.age - b.age);
console.timeEnd('sort'); // sort: 0.05ms

function findUser(name) {
  debugger; // execution stops here when DevTools is open
  return users.find((user) => user.name === name);
}
```

## Follow-up Questions

- How do you find a memory leak? Take a heap snapshot, repeat the action, take
  another one and compare them. See
  [Garbage Collection](../javascript/garbage-collection.md).
- How do you find unnecessary re-renders? Record the interaction in the Profiler
  tab of React DevTools. See
  [Optimization](../react/performance/optimization.md).
- How do you debug an error that happens only in production? Use the stack trace
  from an error tracker with source maps, then reproduce it with the same data,
  network throttling and a production build.

## Common Mistakes

- Trusting an expanded object in the console: it shows the current state. Log a
  copy or a primitive value instead.
- Leaving `debugger` and `console.log` in the code; a linter rule catches both.

## See Also

- [Bundle Optimization](./bundle-optimization.md)
- [How the Browser Works](./browser-workflow.md)
