---
sidebar_position: 3
---

# Event Loop

The event loop is a core concept in Node.js and JavaScript environments that
enables asynchronous programming. It allows Node.js to perform non-blocking I/O
operations, even though JavaScript itself is single-threaded.

When Node.js starts, it initializes the event loop and begins executing the code
in the main module.

1. As asynchronous operations are encountered, such as file reads, network
   requests, or timers, these tasks are _delegated to the system kernel_.
2. Once the kernel completes a task, it signals Node.js to add the corresponding
   _callback_ to the appropriate phase of the event loop.

## Event Loop Phases

The event loop runs continuously, processing tasks in a loop. It consists of
several phases, each responsible for specific types of operations.

```mermaid
flowchart LR;
   A(Timers)-->B(Pending Callbacks)-->C(Idle, Prepare)-->D(Poll)-->E(Check)-->F(Close Callbacks)-->A;
```

1. **Timers**
   - Executes callbacks scheduled by `setTimeout()` and `setInterval()`.
   - These callbacks are executed only after the specified delay has elapsed.

2. **Pending Callbacks**
   - Handles almost all callbacks except for close callbacks, timers, and
     setImmediate() callbacks.
   - Executes I/O operations like reading and writing to files.

3. **Idle, Prepare**
   - Internal use only.

4. **Poll**
   - Retrieves new I/O events.
   - Executes I/O-related callbacks immediately if there are any.
   - If no I/O events are pending, it will wait for callbacks to be added to the
     queue.

5. **Check**
   - Executes callbacks scheduled by `setImmediate()`.

6. **Close Callbacks**

   - Executes close callbacks, such as `socket.on('close', ...)`.

## Timers

In JavaScript, timers are used to schedule functions to be executed either once
after a delay or repeatedly at specified intervals. The primary timer functions
are

`setTimeout`<br/> Executes a function once after a specified delay.

`setInterval`<br/> Repeatedly executes a function at specified intervals.

`clearTimeout`<br/> Cancels a `setTimeout` timer.

`clearInterval`<br/> Cancels a `setInterval` timer.

While the basic functionality is the same, there are some differences in how
timers are implemented and used in the browser and Node.js environments.

### Differences Between Browser and Node.js

#### Module Scope

In Node.js, the Timers API is part of the built-in timers module. While you can
use `setTimeout` or `setInterval` globally, you can also import them from the
timers module for clarity.

```typescript
import { setTimeout } from 'timers';
```

#### Event Loop

In browser, they run on the main thread, which means long-running timer
callbacks can block the UI. Node.js uses its event loop to handle timers,
allowing for non-blocking operations. This is more efficient for server-side
applications.

#### Additional Methods

- Node.js provides the additional method `setImmediate` to execute a callback
  immediately after the current event loop cycle.

```typescript
setImmediate(() => {
  console.log('This runs immediately after the current event loop cycle');
});
```

- Another Node.js-specific method is `process.nextTick`, which schedules a
  callback to be executed at the end of the current operation, before the event
  loop continues.

```typescript
process.nextTick(() => {
  console.log('This runs before the next event loop iteration');
});
```
