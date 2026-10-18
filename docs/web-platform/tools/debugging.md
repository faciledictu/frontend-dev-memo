---
sidebar_position: 2
description: Console, breakpoints, DevTools panels, React and Redux DevTools
tags: [junior, middle]
---

# Debugging Web Applications

Debugging is choosing the right tool for the kind of problem:

- **Console** for a quick check of a value. It is the simplest tool, not the
  most powerful one.
- **Breakpoints** and `debugger` to stop the code and inspect its state.
- **Network** panel for requests; **Performance** and **Memory** panels for slow
  pages and leaks.
- **React DevTools** and **Redux DevTools** for components and store state.

Applies to: Chrome DevTools, React DevTools 8.

## Details

### Console

| Method                               | What it does                                   |
| ------------------------------------ | ---------------------------------------------- |
| `console.log()`, `warn()`, `error()` | prints a message with a level                  |
| `console.table()`                    | shows an array of objects as a table           |
| `console.group()` / `groupEnd()`     | groups related messages                        |
| `console.count()`                    | counts how many times this call has run        |
| `console.time()` / `timeEnd()`       | measures how long an operation takes           |
| `console.trace()`                    | prints the call stack                          |
| `console.dir()`                      | prints an object or a node as an object        |
| `console.assert(condition, …)`       | prints an error only if the condition is false |

The console shows a **live reference** to an object: when it is expanded, it
shows the current state, not the state at the time of logging.

Console utilities: `$0` is the element selected in Elements, `copy(value)`
copies to the clipboard, `getEventListeners($0)` lists the element's handlers,
`monitorEvents($0, 'click')` logs its events.

### Breakpoints

| Type           | When it pauses                                                    |
| -------------- | ----------------------------------------------------------------- |
| `debugger`     | a statement in the code; works only while DevTools is open        |
| Line           | at a line; set by a click on the line number in the Sources panel |
| Conditional    | at a line, only if the expression is true                         |
| Logpoint       | does not pause: logs an expression without changing the code      |
| DOM            | when a node is removed, or its attributes or subtree change       |
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

| Panel               | What it is for                                                                  |
| ------------------- | ------------------------------------------------------------------------------- |
| Elements            | the DOM tree, applied and computed styles, the box model                        |
| Network             | requests: status, headers, payload, timing; throttling and disabling cache      |
| Performance         | a recording of the main thread: long tasks, layout, paint, frames; React tracks |
| Memory              | heap snapshots; comparing two of them shows what leaks                          |
| Application         | cookies, `localStorage`, IndexedDB, service workers                             |
| Lighthouse          | an audit of performance, accessibility, SEO and best practices                  |
| Rendering           | paint flashing, layout shift regions, an FPS meter                              |
| Coverage            | how much of each JS and CSS file was actually used                              |
| Sources → Overrides | replace a production file with a local copy                                     |

### React DevTools

A browser extension that adds its own tabs to DevTools:

- **Components**: the component tree. For the selected component it shows props,
  state and hooks, including context values, and lets you edit them in place.
- **Profiler**: records renders and shows which components rendered in each
  commit and how long it took; with the setting "Record why each component
  rendered while profiling", also why.
- **Suspense** (on by default since version 8): the Suspense boundaries and what
  made a component suspend.

The general setting "Highlight updates when components render" outlines
re-rendering components on the page.

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
  // highlight-next-line
  debugger; // execution stops here when DevTools is open
  return users.find((user) => user.name === name);
}
```

## Follow-up Questions

- How do you find a memory leak? Take a heap snapshot, repeat the action, take
  another one and compare them. See
  [Garbage Collection](../../javascript/garbage-collection.md).
- How do you find unnecessary re-renders? Record the interaction in the Profiler
  tab of React DevTools. See
  [Optimization](../../react/performance/optimization.md).
- How do you debug an error that happens only in production? Use the stack trace
  from an error tracker with source maps, then reproduce it with the same data,
  network throttling and a production build.
- How do you debug on a phone? Android: `chrome://inspect` with the device
  connected over USB. iOS: Safari → Develop → the device.
- Which code changed this element? A DOM breakpoint on the node; for the
  handler, `getEventListeners($0)` or the Event Listeners tab in Elements.
- How do you read a Performance recording? Long tasks are flagged on the main
  thread, the Summary splits the time into scripting, rendering and painting,
  and Bottom-Up finds the slowest functions. See
  [Core Web Vitals](../performance/web-vitals.md).

## Common Mistakes

- Trusting an expanded object in the console: it shows the current state. Log a
  copy or a primitive value instead.
- Leaving `debugger` and `console.log` in the code; linter rules catch both
  (`no-debugger`, `no-console`).
- Profiling a development build: development mode and `StrictMode` make React
  much slower. Profile a production build with CPU throttling.

## See Also

- [Bundle Optimization](./bundle-optimization.md)
- [How the Browser Works](../browser/browser-workflow.md)
