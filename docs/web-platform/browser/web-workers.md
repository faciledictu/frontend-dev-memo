---
sidebar_position: 3
description:
  Dedicated and shared workers, postMessage and structured clone, transferable
  objects, SharedArrayBuffer, when a worker helps
tags: [middle]
---

# Web Workers

A **Web Worker** runs a script in a **background thread** with its own global
scope (`self`) and its own event loop. It has **no access to the DOM**, `window`
or `localStorage`; the page and the worker exchange **messages** with
`postMessage`, and the data is **copied** (structured clone) or **transferred**.
Workers are for **CPU-heavy** work (parsing large files, image processing,
compression) that would otherwise block the main thread and make the page
freeze. Types: **dedicated** (one page), **shared** (`SharedWorker`, shared by
the tabs of one origin) and [service workers](./service-workers.md), which are a
separate topic.

## Details

### What a Worker Can Use

| Available                                                       | Not available                    |
| --------------------------------------------------------------- | -------------------------------- |
| `fetch`, WebSocket, IndexedDB, Cache Storage                    | the DOM, `document`, `window`    |
| timers, `crypto`, `TextEncoder`, `OffscreenCanvas`, WebAssembly | `localStorage`, `sessionStorage` |
| `import` in module workers, `importScripts()` in classic ones   | `alert`, `confirm`               |

- `new Worker(url, { type: 'module' })` creates a **module worker** with
  `import` / `export`. Bundlers (Vite, webpack 5) recognize
  `new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })` and
  bundle the worker file.
- The worker script must have the same origin as the page.

### Messages

- `postMessage(value)` copies the value with the **structured clone** algorithm:
  objects, arrays, `Map`, `Set`, `Date`, typed arrays, `Blob` work; functions
  and DOM nodes throw `DataCloneError`; class instances arrive as plain objects
  without their prototype.
- `postMessage(value, [buffer])` **transfers** the listed objects
  (`ArrayBuffer`, `MessagePort`, `OffscreenCanvas`, `ImageBitmap`) instead of
  copying them: it is instant, and the sender loses access to them.
- `SharedArrayBuffer` gives both sides the same memory, with `Atomics` for
  synchronization. It is available only on **cross-origin isolated** pages
  (`Cross-Origin-Opener-Policy: same-origin` and
  `Cross-Origin-Embedder-Policy: require-corp` or `credentialless`).
- Errors inside the worker fire the `error` event on the `Worker` object.
- `worker.terminate()` stops the worker from the page, `self.close()` from
  inside.

### When It Helps

- **Helps**: long synchronous computation, from tens of milliseconds up. The
  main thread stays free for input and rendering, which improves
  [INP](../performance/web-vitals.md#inp).
- **Does not help**: network requests and other I/O (already asynchronous), DOM
  updates (only the main thread can do them), tiny tasks (starting a worker and
  copying the data cost more than the work).
- For many tasks, a pool of workers, one per core
  (`navigator.hardwareConcurrency`).
- **Comlink** wraps `postMessage` so that worker functions are called like async
  functions.

## Example

```javascript title="main.js"
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});

worker.addEventListener('message', (event) => {
  console.log('Primes below 10 million:', event.data); // 664579
});

// highlight-next-line
worker.postMessage(10_000_000); // the page stays responsive meanwhile

// Transfer instead of copy
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage(buffer, [buffer]);
console.log(buffer.byteLength); // 0: the buffer now belongs to the worker
```

```javascript title="worker.js"
function countPrimes(limit) {
  const composite = new Uint8Array(limit);
  let count = 0;

  for (let i = 2; i < limit; i++) {
    if (composite[i]) continue;
    count++;
    for (let j = i * i; j < limit; j += i) composite[j] = 1;
  }

  return count;
}

self.addEventListener('message', (event) => {
  if (typeof event.data === 'number') {
    self.postMessage(countPrimes(event.data));
  }
});
```

## Follow-up Questions

- How is a worker different from `async` code? Async code still runs on the main
  thread, between tasks; a worker runs in parallel, on another thread.
- Why can a worker not change the DOM? The DOM is not thread-safe, so only the
  main thread owns it. The worker sends the result, and the page updates the
  DOM.
- How do you draw from a worker? Transfer an `OffscreenCanvas` to it with
  `canvas.transferControlToOffscreen()`.
- When would you use a `SharedWorker`? To share one WebSocket connection or one
  cache between all tabs of the app, instead of one per tab.
- How do you get a result back as a promise? Give each message an ID and resolve
  the matching promise in the `message` handler; Comlink does this for you.

## Common Mistakes

- Expecting the worker to see the page's variables or imports: it has its own
  global scope, and data crosses only through messages.

- "A worker makes `fetch` faster." Requests do not block the main thread anyway;
  only parsing a huge response might.
- Sending functions or class instances in messages.
- Starting a new worker for every small task instead of reusing one.
- "Web Workers and service workers are the same." A service worker is a proxy
  between the page and the network, with its own lifecycle.

## See Also

- [Service Workers](./service-workers.md)
- [Event Loop](../../javascript/event-loop.md)
- [Worker Threads in Node.js](../../nodejs/modules/worker-threads.md)
- [Core Web Vitals](../performance/web-vitals.md)
