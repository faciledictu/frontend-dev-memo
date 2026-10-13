---
sidebar_position: 8
---

# Debugging of Web Applications

## Console Logging

Logging to web browser console isn’s a powerful tool, although it can be used
for debugging JavaScript code.

- `console.log()` is used to print messages to the web console

- `console.table()` displays tabular data as a table.

```javascript
console.table([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
]);
```

- `console.group()` / `console.groupEnd()` groups related log messages together.

- `console.count()` logs the number of times that this particular call to
  console.count() has been called.

- `console.time()` / `console.timeEnd()` starts a timer you can use to track how
  long an operation takes.

- `console.trace()` outputs a stack trace to the console.

## Working with Breakpoints

Breakpoints allow you to pause code execution at specific lines to inspect the
state of your application.

In most integrated development environments (IDEs) or browser Developer Tools,
you can set breakpoints by clicking on the line number next to the code.

:::tip

You can also set conditional breakpoints which pause execution only if a
specified condition is met.

1. Right-click on the blue breakpoint marker.
2. Select "Edit Breakpoint" from the context menu.
3. In the dialog that appears, enter your JavaScript expression as the
   condition. For example, `someVariable > 100`.

:::

## Types of Breakpoints

- **Line-of-code breakpoints**. Standard breakpoints set on specific lines.

- **Function Breakpoints**: Rather than breaking on a specific line, these
  breakpoints pause execution whenever a particular function is called.

- **Conditional breakpoints**. Breakpoints that activate when a specified
  condition is true. Reduces the need for manually stepping through irrelevant
  code.

- **DOM Event Breakpoints**. Breakpoints that pause execution when an event
  occurs, such as a mouse click or a keypress.

## DevTools and Extensions

### Network Tab

It helps monitoring network activity, including HTTP requests and responses,
WebSocket connections, and resource loading times. Provides details like status
codes, request/response headers, payload, and timing information.

### Lighthouse

An open-source tool for improving the quality of web pages. It provides audits
for performance, accessibility, progressive web apps, SEO, and more. Can be run
in Chrome DevTools, from the command line, or as a Node module.

Used for:

- Performance audits.
- Accessibility audits.
- Identifying best practice violations.

### React DevTools

React DevTools is a powerful browser extension that allows you to inspect the
React component hierarchy, check props and state, and debug performance issues.
Here’s how to use it effectively:

#### Inspecting Components

- Open the DevTools panel (F12 or Ctrl+Shift+I).
- Click on the "React" tab to see your app's component tree.
- Select a component to inspect its props, state, and hooks in the right-hand
  pane.

- Component Debugging

Use the "Highlight Updates" feature to see which components re-render. Check the
"Profiler" tab to record and analyze render performance. Use the "Context" panel
to inspect React Context values.

- Editing State and Props

Directly edit state and props from the DevTools panel to test different
scenarios. This can help you simulate different states and debug issues without
changing your code.

### Redux DevTools

Redux DevTools is essential for debugging Redux applications. It allows you to
inspect every action and state change.

#### Inspecting Actions and State

- Open the Redux DevTools from the browser’s extension icon.
- You will see a timeline of actions on the left, the state tree in the center,
  and the action details on the right.
- Click on an action to see the state before and after it was dispatched.

Used for:

- State Inspection
- Action History
- Time Travel Debugging
