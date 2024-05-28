# Event Loop

## Related Concepts

**Call Stack** is a data structure that keeps track of the execution context of
your JavaScript code. When a function is invoked, it's pushed onto the stack,
and when the function execution is completed, it’s popped off the stack. The
pieces of stack are called _frames_.

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

## Prioritizing of Messages (Tasks)

JavaScript classifies tasks into two categories: microtasks and macrotasks.
Understanding the difference between these is crucial for understanding how
JavaScript handles asynchronous operations.

### Microtasks

Common sources of microtasks include:

- Promises (methods then, catch, finally, but Promise.constructor executes
  synchronously)
- MutationObserver

Microtasks are prioritized over macrotasks. After the execution of the current
task, all microtasks in the queue are executed before any macrotask.

### Macrotasks

They include:

- setTimeout
- setInterval
- I/O operations
- UI rendering

After the execution of all microtasks, one macrotask is picked from the
macrotask queue and executed.

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

:::caution Use with Caution

Avoid using setInterval for short intervals or operations that may take longer
than the interval to complete, as this can lead to overlapping executions and
unintended behavior.

:::

:::note Consider Alternatives

In modern JavaScript development, alternatives such as requestAnimationFrame or
asynchronous patterns using Promises or async/await may be more suitable for
certain use cases, offering better control and performance.

:::

##### Clearing Timers

Both `setTimeout` and setzInterval return a timer ID, which can be used to
cancel the scheduled execution using `clearTimeout` or `clearInterval`,
respectively. This is important for managing resource usage and preventing
memory leaks.

## Blocking Code

To ensure smooth performance and responsiveness, it's essential to avoid
long-running synchronous operations in JavaScript, especially within the main
thread. Instead, asynchronous operations should be used whenever possible to
delegate time-consuming tasks to background threads or offload them to the
browser's APIs.
