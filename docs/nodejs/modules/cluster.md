---
sidebar_position: 6
description:
  Using all CPU cores with cluster, how workers share a port, scaling with PM2
  or containers
---

# Cluster Module

One Node.js process runs its JavaScript on one thread, so that code uses one CPU
core. `node:cluster` starts several copies of the application: the **primary**
process forks **worker** processes (usually one per core), and all workers
**share the same server port**. By default the primary accepts connections and
hands them to workers in turn (round-robin; on Windows the OS distributes them).
Workers are separate processes with separate memory, so shared state (sessions,
caches) must live outside them, for example in Redis. For CPU-heavy tasks inside
one process, use [`worker_threads`](./worker-threads.md) instead.

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

`cluster` scales a server across cores with separate **processes**;
`worker_threads` runs CPU-heavy tasks in **threads** of one process. Neither
helps with I/O-bound work: a single process already handles thousands of
concurrent connections. See
[Worker Threads](./worker-threads.md#worker-threads-vs-cluster-vs-child-process).

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

## Follow-up Questions

- How do workers share one port? The primary owns the listening socket and
  passes connections to workers; workers do not bind the port themselves.
- Where do you keep sessions with several workers? Outside the process: Redis, a
  database, or stateless JWTs. A worker's memory is not visible to others.
- Should every Node.js app use `cluster`? Not when it runs in containers that
  are scaled horizontally; one process per container is simpler.

## Common Mistakes

- Using `cluster.isMaster`: deprecated, use `isPrimary`.
- Keeping in-memory state (sessions, rate limits, WebSocket rooms) and expecting
  every worker to see it.
- Forking more workers than cores: they compete for CPU and only add memory.

## See Also

- [Worker Threads](./worker-threads.md)
- [Child Process Module](./child-process.md)
- [What Is Node.js](../overview.md)
- [Event Loop in Node.js](../event-loop.md)
