---
sidebar_position: 1
description:
  What Node.js is, V8 and libuv, the thread pool, non-blocking I/O, when Node
  fits and when it does not, release lines
---

# What Is Node.js

**Node.js** is a JavaScript runtime for running code outside the browser: on
servers, in CLI tools and in build scripts. It is built from the **V8** engine
(the one in Chrome), which executes JavaScript, and **libuv**, a C library that
provides the **event loop**, asynchronous I/O and a **thread pool**. JavaScript
runs on one thread, and I/O does not block it. Network operations use the
operating system's non-blocking mechanisms, while file system, DNS lookup and
some crypto and compression operations run in the libuv thread pool (4 threads
by default). That makes Node.js good at many concurrent I/O-bound connections
and bad at long CPU-bound work on the main thread.

Applies to: Node.js 24 LTS.

## Details

### Architecture

| Part                          | What it does                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| V8                            | Compiles and runs JavaScript, manages memory (garbage collector)                               |
| libuv                         | Event loop, non-blocking network I/O through the OS (epoll, kqueue, IOCP), thread pool         |
| Thread pool                   | `fs`, `dns.lookup`, `crypto.pbkdf2`, `zlib` and similar; size set by `UV_THREADPOOL_SIZE`      |
| Built-in modules              | `node:fs`, `node:http`, `node:stream`, `node:events` and others: JavaScript APIs over C++ code |
| Globals from the Web Platform | `fetch`, `URL`, `AbortController`, `EventTarget`, `structuredClone`, Web Streams               |

There is no DOM, `window` or `document`. The global object is `globalThis` (also
available as `global`), and process information is in `process`.

### Where It Fits

- **Good fit:** HTTP APIs, real-time servers (WebSocket, chat), proxies and BFF
  layers, streaming, CLI tools and frontend tooling (bundlers, linters, test
  runners).
- **Poor fit:** CPU-bound work (image processing, heavy calculations) on the
  main thread: while it runs, no other request is served. Move it to
  [`worker_threads`](./modules/worker-threads.md), a child process or another
  service.

### Built-in Tooling

| Feature                          | Command or API                                                |
| -------------------------------- | ------------------------------------------------------------- |
| Test runner                      | `node --test`, `node:test`, `node:assert`                     |
| Restart on file changes          | `node --watch app.js`                                         |
| Load a `.env` file               | `node --env-file=.env app.js`                                 |
| Run TypeScript                   | `node app.ts` (type stripping: types are erased, not checked) |
| Restrict file and process access | `node --permission --allow-fs-read=./data app.js`             |

### Versions

- Up to Node.js 26, even-numbered majors become **LTS** (long-term support, 30
  months) in October; odd-numbered ones are supported for about 8 months (6 as
  Current) and never become LTS. Production uses LTS.
- Starting with Node.js 27 (2027) there is one major release a year, and every
  release becomes LTS.

## Follow-up Questions

- If JavaScript is single-threaded, how does Node.js handle thousands of
  connections? The thread only runs callbacks; waiting for the network is done
  by the operating system, and blocking file operations by the thread pool. See
  [Event Loop](./event-loop.md).
- Is Node.js single-threaded? Your JavaScript is (unless you use
  `worker_threads`); the process itself has several threads: the libuv pool, V8
  garbage collection and compilation threads.
- How do you use all CPU cores? Run several processes (`cluster`, PM2,
  containers) or move CPU work to `worker_threads`. See
  [Cluster](./modules/cluster.md) and
  [Worker Threads](./modules/worker-threads.md).

## Common Mistakes

- "Node.js is a language" or "a framework." It is a runtime; Express and NestJS
  are frameworks on top of it.
- "Everything asynchronous goes to the thread pool." Network I/O does not use
  the pool: it uses the operating system's non-blocking sockets.
- "Async code makes CPU work non-blocking." An `async` function that calculates
  for 5 seconds still blocks the thread for 5 seconds.

## See Also

- [Event Loop in Node.js](./event-loop.md)
- [Event Loop in the browser](../javascript/event-loop.md)
- [Module System](./module-system.md)
