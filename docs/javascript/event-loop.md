---
sidebar_position: 12
---

# Event Loop

## Related Concepts

**Call Stack** is a data structure that keeps track of the execution context of
your JavaScript code. When a function is invoked, it's pushed onto the stack,
and when the function execution is completed, it’s popped off the stack. The
entries of the stack are called _frames_.

**Callback Queue**. This queue holds _messages_ (tasks) that are ready to be
processed. These tasks are added from asynchronous events like timers, network
requests, or DOM events.

**Web APIs**. These are browser-provided APIs (like setTimeout, fetch, DOM
events) that handle asynchronous operations. When these operations complete,
they push their callbacks to the appropriate queue (microtask or macrotask).

## Event Loop Model

The event loop is a process that continuously monitors the call stack and the
callback queue. Its primary role is to execute tasks from the call stack and
manage asynchronous events.

The event loop constantly checks the call stack to see if it's empty. If the
call stack is empty, the event loop checks the callback queue and pushes the
first callback onto the call stack for execution.

## Prioritizing Messages (Tasks)

JavaScript classifies tasks into two categories: microtasks and macrotasks.
Understanding the difference between these is crucial for understanding how
JavaScript handles asynchronous operations.

### Microtasks

Common sources of microtasks include:

- Promise callbacks (`then`, `catch`, `finally`); the `Promise` constructor
  itself executes synchronously
- Code after `await` in async functions
- `queueMicrotask()`
- MutationObserver

Microtasks are prioritized over macrotasks. After the execution of the current
task, all microtasks in the queue are executed before any macrotask.

### Macrotasks

They include:

- setTimeout
- setInterval
- I/O operations
- DOM events (clicks, key presses, etc.)

After the execution of all microtasks, one macrotask is picked from the
macrotask queue and executed.

:::note

Rendering is not a task. After a task and all its microtasks are done, the
browser may update the rendering (style, layout, paint) and only then takes the
next task. That's why a long task or an endless chain of microtasks freezes the
page.

:::

#### `setTimeout()` and `setInterval()`

The `setTimeout` function is used to schedule the execution of a callback after
a specified delay (in milliseconds). It takes two parameters: a function to
execute and a delay time.

```javascript
setTimeout(() => {
  console.log('Delayed execution after 2000 milliseconds');
}, 2000);
```

The `setInterval` function is used to repeatedly execute a function or a piece
of code at specified intervals (in milliseconds). It takes two parameters: a
function to execute and the interval time.

```javascript
setInterval(() => {
  console.log('Repeated execution every 1000 milliseconds');
}, 1000);
```

:::caution[Use with Caution]

Avoid using setInterval for short intervals or operations that may take longer
than the interval to complete, as this can lead to overlapping executions and
unintended behavior.

:::

:::note[Consider Alternatives]

In modern JavaScript development, alternatives such as requestAnimationFrame or
asynchronous patterns using Promises or async/await may be more suitable for
certain use cases, offering better control and performance.

:::

##### Clearing Timers

Both `setTimeout` and `setInterval` return a timer ID, which can be used to
cancel the scheduled execution using `clearTimeout` or `clearInterval`,
respectively. This is important for managing resource usage and preventing
memory leaks.

## Blocking Code

To ensure smooth performance and responsiveness, it's essential to avoid
long-running synchronous operations in JavaScript, especially within the main
thread. Instead, asynchronous operations should be used whenever possible to
delegate time-consuming tasks to background threads (Web Workers) or offload
them to the browser's APIs.
