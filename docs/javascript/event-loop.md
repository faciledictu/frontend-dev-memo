---
sidebar_position: 15
description: Call stack, tasks and microtasks, and the order of execution
tags: [middle]
---

# Event Loop

JavaScript runs on **one thread**. The **event loop** is what lets it handle
asynchronous work. It repeats the same cycle:

1. take **one task** from the task queue and run it until the call stack is
   empty;
2. run **all microtasks**, including those added along the way;
3. let the browser **render** if needed;
4. take the next task.

So the order is: synchronous code → microtasks → rendering → the next task.

## Details

### Parts of the Model

- **Call stack**: the functions that are being executed right now. See
  [Execution Context](./execution-context.md).
- **Web APIs**: timers, network, DOM events. They are provided by the browser
  and work outside the JavaScript thread. When an operation completes, its
  callback is put into a queue.
- **Task queue** (macrotasks) and **microtask queue**: callbacks waiting for the
  call stack to become empty.

### Microtasks

- Promise callbacks (`then`, `catch`, `finally`); the `Promise` constructor
  itself executes synchronously. See [Promises and async/await](./promises.mdx).
- Code after `await` in async functions
- `queueMicrotask()`
- `MutationObserver` callbacks (see
  [Intersection, Resize and Mutation Observers](../web-platform/browser/observers.md))

### Tasks (Macrotasks)

- `setTimeout`, `setInterval`
- DOM events (clicks, key presses, etc.)
- I/O and network callbacks
- `MessageChannel`, `postMessage`

### Rendering

Rendering is not a task. After a task and all its microtasks are done, the
browser may update the rendering (style, layout, paint) and only then takes the
next task. `requestAnimationFrame` callbacks run in this step, right before the
paint. See
[requestAnimationFrame and requestIdleCallback](../web-platform/browser/scheduling.md).

That's why a long task or an endless chain of microtasks freezes the page. Heavy
work should be split into several tasks or moved to a Web Worker.

### Timers

- The delay of `setTimeout` is the **minimum** time, not a guarantee: the
  callback waits until the stack and the microtask queue are empty.
- `setInterval` schedules calls regardless of how long the callback takes, so
  slow callbacks run back to back. For work that may take longer than the
  interval, use a recursive `setTimeout`.
- Both return an ID for `clearTimeout` / `clearInterval`. An interval that is
  never cleared keeps its callback, and everything the callback references, in
  memory.

## Example

```javascript
console.log(1);

setTimeout(() => console.log(2), 0);

Promise.resolve().then(() => console.log(3));

queueMicrotask(() => console.log(4));

(async () => {
  console.log(5);
  await null;
  console.log(6);
})();

console.log(7);

// 1 5 7 3 4 6 2
```

- `1`, `5`, `7`: synchronous code, including the async function up to the first
  `await`.
- `3`, `4`, `6`: microtasks in the order they were queued.
- `2`: a task, so it runs after all microtasks.

## Follow-up Questions

- Is the event loop the same in Node.js? No, it has phases and
  `process.nextTick`. See [Event Loop in Node.js](../nodejs/event-loop.md).
- What happens if a microtask keeps scheduling new microtasks? The loop never
  reaches rendering and the next task: the page freezes.
- How do you run heavy calculations without blocking the page? Split them into
  chunks with `scheduler.yield()` or `setTimeout`, or move them to a Web Worker.
  See
  [requestAnimationFrame and requestIdleCallback](../web-platform/browser/scheduling.md).

## Common Mistakes

- "`setTimeout(fn, 0)` runs immediately." It runs after the current code and all
  microtasks.
- "Promises are executed in parallel." Their callbacks run on the same thread,
  one by one.
- "`async` functions run asynchronously from the first line." The code before
  the first `await` is synchronous.
- "Rendering is a macrotask." It is a separate step of the loop.
