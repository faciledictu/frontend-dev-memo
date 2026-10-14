---
sidebar_position: 6
description:
  Using all CPU cores with cluster, how workers share a port, cluster vs
  worker_threads vs child_process
---

# Cluster Module

One Node.js process runs its JavaScript on one thread, so that code uses one CPU
core. `node:cluster` starts several copies of the application: the **primary**
process forks **worker** processes (usually one per core), and all workers
**share the same server port**. By default the primary accepts connections and
hands them to workers in turn (round-robin; on Windows the OS distributes them).
Workers are separate processes with separate memory, so shared state (sessions,
caches) must live outside them, for example in Redis. For CPU-heavy tasks inside
one process, use **`worker_threads`** instead.

Applies to: Node.js 24 LTS.

## Details

- `cluster.isPrimary` tells whether the code runs in the primary process.
  `isMaster` is a deprecated alias from before Node.js 16.
- `cluster.fork()` starts a worker with `child_process.fork()`: the same script
  runs again, now with `isPrimary === false`.
- The primary and workers talk over IPC: `worker.send()` and
  `process.on('message')`.
- If a worker crashes, the others keep serving. The primary should listen for
  `'exit'` and fork a replacement.
- In production, the same job is often done by **PM2**
  (`pm2 start app.js -i max`) or by running one process per container and
  scaling containers (Kubernetes, ECS); then `cluster` is not needed.

### Cluster vs Worker Threads

|         | `cluster` / `child_process`                    | `worker_threads`                                                                       |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| Unit    | A separate **process**                         | A **thread** inside the same process                                                   |
| Memory  | Separate; messages are copied over IPC         | Separate V8 heap, but `SharedArrayBuffer` can be shared and `ArrayBuffer`s transferred |
| Cost    | Tens of MB and slower start per worker         | Lighter, still a full V8 instance per thread                                           |
| A crash | Kills one worker                               | An uncaught error ends the thread and emits `'error'` on the `Worker`                  |
| Use for | Scaling an HTTP server across cores, isolation | CPU-heavy work: image processing, parsing, hashing                                     |

Neither helps with I/O-bound work: a single process already handles thousands of
concurrent connections.

## Example

```javascript
// server.mjs
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < availableParallelism(); i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.process.pid} exited with code ${code}`);
    cluster.fork(); // replace it
  });
} else {
  http
    .createServer((req, res) => res.end(`Handled by ${process.pid}\n`))
    .listen(8000); // every worker listens on the same port

  console.log(`Worker ${process.pid} started`);
}
```

CPU work in a worker thread:

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

- How do workers share one port? The primary owns the listening socket and
  passes connections to workers; workers do not bind the port themselves.
- Where do you keep sessions with several workers? Outside the process: Redis, a
  database, or stateless JWTs. A worker's memory is not visible to others.
- Should every Node.js app use `cluster`? Not when it runs in containers that
  are scaled horizontally; one process per container is simpler.
- Why not create a new worker thread per request? Starting a thread is costly;
  use a pool (for example Piscina) and only for CPU-heavy tasks.

## Common Mistakes

- Using `cluster.isMaster`: deprecated, use `isPrimary`.
- Keeping in-memory state (sessions, rate limits, WebSocket rooms) and expecting
  every worker to see it.
- Using `worker_threads` for database or HTTP calls: they are already
  non-blocking.
- Forking more workers than cores: they compete for CPU and only add memory.

## See Also

- [Child Process Module](./child-process.md)
- [What Is Node.js](../overview.md)
- [Event Loop in Node.js](../event-loop.md)
