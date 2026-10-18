---
sidebar_position: 3
description:
  When rAF and idle callbacks run in a frame, scheduler.yield() and postTask,
  which one to use for animation, background work and long tasks
tags: [middle, senior]
---

# requestAnimationFrame and requestIdleCallback

- **`requestAnimationFrame(cb)`** (rAF) runs `cb` **once, right before the next
  paint**, after the current task and its microtasks. It is for visual updates:
  one change per frame, in sync with the display, paused in background tabs.
- **`requestIdleCallback(cb)`** (rIC) runs `cb` when the browser is **idle**
  after a frame, with a `deadline` that says how much time is left. It is for
  low-priority background work: analytics, prefetching, cache warm-up.
- To **split a long task** so that input and rendering get through, yield to the
  browser between chunks: **`scheduler.yield()`**, or `setTimeout` as a
  fallback.

## Details

### One Frame

```text
task → microtasks → rAF callbacks → style, layout → ResizeObserver → paint → idle (rIC)
```

- The browser renders at most once per display refresh (about every 16.7 ms at
  60 Hz) and may skip a frame when nothing changed. Tasks and microtasks are
  described in [Event Loop](../../javascript/event-loop.md), the rendering
  pipeline in [How the Browser Works](./browser-workflow.md).
- A long task delays everything after it: the next frame and the response to
  input.

### Which to Use

| API                      | When the callback runs                                                          | Use for                                    |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------ |
| `setTimeout(fn, 0)`      | A new task, after other queued tasks; ≥ 4 ms when nested over 5 levels          | Deferring work; a fallback for yielding    |
| `requestAnimationFrame`  | Before the next paint, once per frame                                           | Animations, reading and writing layout     |
| `requestIdleCallback`    | In idle time after a frame, or after `timeout`                                  | Non-urgent background work                 |
| `scheduler.yield()`      | A promise; the continuation runs **ahead of** other tasks of its priority       | Splitting a long task without losing place |
| `scheduler.postTask(fn)` | A task with a priority: `user-blocking`, `user-visible` (default), `background` | Queues of work with different priorities   |

### requestAnimationFrame

- The callback gets a `DOMHighResTimeStamp`, the same for all callbacks of the
  frame: base the animation on elapsed time, not on the number of frames,
  because the refresh rate varies (60, 120, 144 Hz).
- It runs **once**: a loop calls rAF again inside the callback.
  `cancelAnimationFrame(id)` cancels it.
- Paused in background tabs and hidden iframes, so the loop costs nothing there.
- **Double rAF**: a callback scheduled inside a rAF callback runs in the next
  frame, after the current one is painted. Used to start a CSS transition after
  an element has been rendered with its initial styles.
- For simple animations, CSS or `element.animate()` (Web Animations API) is
  better: `transform` and `opacity` animate on the compositor even when the main
  thread is busy.
- rAF also serves as a throttle for `scroll` and `pointermove` handlers. See
  [Debounce and Throttle](../../javascript/debounce-throttle.md).

### requestIdleCallback

- `deadline.timeRemaining()` returns the milliseconds left, **at most 50**, so
  that input arriving meanwhile waits no longer than that. Do the work in small
  pieces while time remains, and schedule the rest with another rIC.
- On a busy page idle time may never come: `{ timeout: 2000 }` forces the call,
  and then `deadline.didTimeout` is `true`.
- No DOM changes inside: the frame is already painted, and they would force a
  new layout. Schedule them with rAF instead.
- Feature-detect it and fall back to `setTimeout`.

### scheduler.yield() and postTask()

- `await scheduler.yield()` ends the current task and lets the browser handle
  input and render. The rest of the function runs in a task queued **ahead of**
  other tasks of the same priority. After `await` on a `setTimeout` promise, it
  goes to the end of the task queue, behind everything already queued, including
  third-party scripts' tasks.
- `scheduler.postTask(fn, { priority, signal, delay })` returns a promise with
  the result; a `TaskController` changes the priority or aborts the task.
- The `yieldToMain` pattern with a fallback is shown in
  [Core Web Vitals](../performance/web-vitals.md#inp).
- If the work itself is heavy, splitting it only spreads the cost over time:
  move it to a [Web Worker](./web-workers.md). React's scheduler does the same
  splitting for rendering. See
  [Concurrent Rendering](../../react/rendering/concurrent-rendering.md).

Support: rAF is Baseline; `requestIdleCallback` and `scheduler` are not
supported in Safari.

## Example

A rAF loop that moves an element at a fixed speed, and a queue of background
tasks that runs in idle time:

```javascript
const box = document.querySelector('.box');
const speed = 0.1; // px per ms
let start;

function step(time) {
  start ??= time;
  const x = ((time - start) * speed) % 300;
  box.style.transform = `translateX(${x}px)`;
  // highlight-next-line
  requestAnimationFrame(step); // schedule the next frame
}
requestAnimationFrame(step);

const idle =
  window.requestIdleCallback ??
  ((cb) =>
    setTimeout(() => {
      const start = Date.now();
      cb({
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        didTimeout: false,
      });
    }));

const queue = [];

function enqueue(task) {
  queue.push(task);
  if (queue.length === 1) idle(runQueue, { timeout: 2000 });
}

function runQueue(deadline) {
  while (
    queue.length > 0 &&
    (deadline.timeRemaining() > 0 || deadline.didTimeout)
  ) {
    queue.shift()();
  }
  if (queue.length > 0) idle(runQueue, { timeout: 2000 });
}

enqueue(() => sendAnalytics('page-view'));
enqueue(() => prefetch('/next-page'));
```

## Follow-up Questions

- Why not animate with `setInterval(fn, 16)`? It is not aligned with the display
  refresh, so frames are skipped or drawn twice (jank); it keeps running
  (throttled) in background tabs and does not adapt to 120 Hz screens.
- Is a rAF callback a task or a microtask? Neither: it runs in the rendering
  step of the event loop. Microtasks queued inside it run right after it.
- How do you avoid layout thrashing? Read all the sizes first, then write all
  the styles, in one rAF callback. See
  [How the Browser Works](./browser-workflow.md#reflow-and-repaint).
- In what order do `setTimeout(fn, 0)`, `Promise.resolve().then(fn)`,
  `requestAnimationFrame(fn)` and `requestIdleCallback(fn)` fire? The microtask
  first, rIC last; the timer and rAF depend on how soon the next frame is due,
  so code must not rely on their order.
- Why not send analytics or a request from rAF? rAF is paused in background
  tabs, so the work may never run; that is a job for rIC or `postTask`.

## Common Mistakes

- "rAF runs 60 times per second." It follows the display refresh rate, and it
  stops in background tabs.
- Calling rAF once and expecting a loop: each frame needs a new call.
- Moving an element by a fixed step per frame: the speed then depends on the
  refresh rate. Use the timestamp.
- Changing the DOM in `requestIdleCallback`.
- Using rAF for non-visual work: in a background tab it never runs.
- Relying on `requestIdleCallback` without `timeout` for work that must happen:
  on a busy page it may wait for seconds.

## See Also

- [Event Loop](../../javascript/event-loop.md)
- [How the Browser Works](./browser-workflow.md)
- [Core Web Vitals](../performance/web-vitals.md)
- [Web Workers](./web-workers.md)
