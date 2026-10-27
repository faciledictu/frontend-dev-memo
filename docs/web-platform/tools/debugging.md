---
sidebar_position: 1
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

Applies to: React DevTools 8.

## Details

### Console

| Method                               | What it does                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| `console.log()`, `warn()`, `error()` | prints a message with a level                                                  |
| `console.table()`                    | shows an array of objects as a table                                           |
| `console.group()` / `groupEnd()`     | groups related messages                                                        |
| `console.count()`                    | counts how many times this call has run                                        |
| `console.time()` / `timeEnd()`       | measures how long an operation takes                                           |
| `console.trace()`                    | prints the call stack                                                          |
| `console.dir()`                      | shows an object's properties; for a DOM node, the object instead of the markup |
| `console.assert(condition, …)`       | prints an error only if the condition is false                                 |

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

| Panel               | What it is for                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Elements            | the DOM tree, applied and computed styles, the box model                                    |
| Network             | requests: status, headers, payload, timing; throttling and disabling cache                  |
| Performance         | a recording of the main thread: long tasks, layout, paint, frames; React Performance Tracks |
| Memory              | heap snapshots; comparing two of them shows what leaks                                      |
| Application         | cookies, `localStorage`, IndexedDB, service workers                                         |
| Lighthouse          | an audit of performance, accessibility, SEO and best practices                              |
| Rendering (drawer)  | paint flashing, layout shift regions, an FPS meter                                          |
| Coverage (drawer)   | how much of each JS and CSS file was actually used                                          |
| Sources → Overrides | replace a production file with a local copy                                                 |

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

- A log of dispatched actions with the state diff after each one, and **time
  travel** to any of them.
- `configureStore` of Redux Toolkit enables it; the `devtools` middleware of
  Zustand uses the same extension.

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
- How do you debug on a phone? Remote debugging from the desktop:
  `chrome://inspect` for Android, the Develop menu of Safari for iOS.
- How do you find the code that changes an element? A DOM breakpoint on it
  (Break on → subtree or attribute modifications); its handlers are in the Event
  Listeners tab of Elements or in `getEventListeners($0)`.
- How do you read a Performance recording? Tasks over 50 ms are marked red on
  the Main track, the Summary splits the time into scripting, rendering and
  painting, and Bottom-Up finds the slowest functions. See
  [Core Web Vitals](../performance/web-vitals.md).

## Common Mistakes

- Trusting an expanded object in the console: it shows the current state. Log a
  copy or a primitive value instead.
- Leaving `debugger` and `console.log` in the code; linter rules catch both
  (`no-debugger`, `no-console`).
- Profiling a development build: development mode and `StrictMode` make React
  much slower. Profile a production build (for React's own tools, a profiling
  build) with CPU throttling.

## See Also

- [Bundle Optimization](../performance/bundle-optimization.md)
- [How the Browser Works](../browser/browser-workflow.md)
- [Debugging React Native](../../react-native/quality/debugging.md)
