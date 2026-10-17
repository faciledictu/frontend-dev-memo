---
sidebar_position: 7
description:
  Worker threads for CPU-heavy work, messaging and shared memory, thread pools,
  worker_threads vs cluster and child_process
---

# Worker Threads

`node:worker_threads` runs JavaScript in **additional threads** of the same
process. Each worker has its own V8 isolate, event loop and memory; the main
thread and workers communicate by **messages** (`postMessage`, values are copied
with the structured clone algorithm), and can share memory explicitly through
`SharedArrayBuffer`. Workers are meant for **CPU-heavy** work (image processing,
parsing, hashing, compression) that would otherwise block the event loop. They
do not help with I/O: the event loop already handles it without blocking.
Node.js workers are the server-side counterpart of the browser's Web Workers.

Applies to: Node.js 24 LTS.

## Details

| API                                         | What it does                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `new Worker(file, { workerData })`          | Starts a worker from a file; `workerData` is a copy passed at start                 |
| `isMainThread`                              | `true` in the main thread, `false` in a worker                                      |
| `parentPort.postMessage(value)`             | Sends a message from the worker to the main thread                                  |
| `worker.postMessage(value, [transferList])` | Sends a message to the worker; `ArrayBuffer`s in the list are **moved**, not copied |
| `worker.on('message' / 'error' / 'exit')`   | Results, an uncaught error in the worker, the end of the worker                     |
| `worker.terminate()`                        | Stops the worker                                                                    |
| `SharedArrayBuffer` + `Atomics`             | Memory visible to several threads; `Atomics` for safe access                        |

- Starting a worker takes time and memory (a separate V8 isolate and Node.js
  environment), so do not create one per request: keep a **pool** of workers and
  send them tasks. Libraries such as Piscina do this.
- An uncaught error ends the worker and emits `'error'` on the `Worker` object.
  With an `'error'` listener the main thread keeps running; without one, the
  error is rethrown in the main thread and the whole process crashes.
- Functions and sockets cannot be sent in a message (`DataCloneError`); class
  instances arrive as plain objects without their methods.

### Worker Threads vs Cluster vs Child Process

|         | `worker_threads`                                                                         | `cluster` / `child_process`                                      |
| ------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Unit    | A **thread** inside the same process                                                     | A separate **process**                                           |
| Memory  | Own heap; `SharedArrayBuffer` can be shared, `ArrayBuffer`s transferred                  | Fully separate; messages are copied over IPC                     |
| Cost    | Lighter, still a separate V8 isolate per thread                                          | Tens of MB per Node.js process, slower start                     |
| A crash | Ends the thread, emits `'error'` on the `Worker` (crashes the process if nobody listens) | Ends one process                                                 |
| Use for | CPU-heavy tasks                                                                          | Scaling a server across cores, isolation, running other programs |

## Example

```javascript
// hash.mjs
import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from 'node:worker_threads';
import { pbkdf2Sync } from 'node:crypto';

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), { workerData: 'secret' });
  worker.on('message', (hash) => console.log('Hash:', hash));
  worker.on('error', (err) => console.error(err));
} else {
  // Blocks only this thread; the main event loop stays responsive
  const hash = pbkdf2Sync(workerData, 'salt', 500_000, 32, 'sha256');
  parentPort.postMessage(hash.toString('hex'));
}
```

## Follow-up Questions

- Is Node.js multithreaded then? Your JavaScript runs on one thread unless you
  start workers; each worker is another single-threaded JavaScript environment
  with its own event loop.
- Why not use workers for database queries? They are I/O: the main thread
  already waits for them without blocking, and a worker only adds overhead.
- How is this different from the libuv thread pool? The pool runs built-in
  native operations (`fs`, `crypto`, `zlib`); workers run your JavaScript.

## Common Mistakes

- Creating a new worker for every request instead of using a pool.
- No `'error'` listener on a `Worker`: one failed task crashes the process.
- Using workers for I/O-bound work.
- Sending large data back and forth by copying instead of transferring an
  `ArrayBuffer`.
- Expecting a variable changed in a worker to change in the main thread: only
  messages and `SharedArrayBuffer` cross the boundary.

## See Also

- [Web Workers](../../web-platform/browser/web-workers.md)
- [Cluster Module](./cluster.md)
- [Child Process Module](./child-process.md)
- [Event Loop in Node.js](../event-loop.md)
