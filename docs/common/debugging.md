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

### React and Redux debugging tools

See [here](/docs/react/devtools.md)
