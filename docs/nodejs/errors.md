---
sidebar_position: 5
description:
  Operational vs programmer errors, system errors and codes, error handling in
  callbacks, promises and EventEmitter, unhandled errors, Express middleware
---

# Error Handling in Node.js

Errors fall into two groups. **Operational errors** are expected failures of a
correct program: a file is missing, a connection is refused, the input is
invalid. They are handled: retry, return a 4xx/5xx response, show a message.
**Programmer errors** are bugs: reading a property of `undefined`, passing a
wrong argument. They are fixed in code; at run time the safe reaction is to log
and restart the process. How an error arrives depends on the API: thrown
synchronously, passed as the first callback argument, a rejected promise, or an
`'error'` event. An unhandled exception or promise rejection **terminates the
process**.

Applies to: Node.js 24 LTS, Express 5.

## Details

### Error Objects in Node.js

| Kind               | Examples                                         | How to recognize                                            |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------- |
| JavaScript errors  | `TypeError`, `RangeError`, `SyntaxError`         | `instanceof`; see [Error Handling](../javascript/errors.md) |
| System errors      | `ENOENT`, `EACCES`, `ECONNREFUSED`, `EADDRINUSE` | `err.code`, plus `err.syscall`, `err.path`, `err.errno`     |
| Node.js API errors | `ERR_INVALID_ARG_TYPE`, `ERR_HTTP_HEADERS_SENT`  | `err.code` starting with `ERR_`                             |
| Your own errors    | `NotFoundError extends Error`                    | `instanceof`, `name`, custom fields                         |

- Check `err.code`, not `err.message`: messages may change between versions,
  codes do not.
- Wrap a low-level error with context instead of losing it:
  `throw new Error('Cannot load config', { cause: err })`.
- Operational errors and programmer errors can look alike (`TypeError` from bad
  input vs from a bug); the difference is whether the program expected it.

### How Errors Arrive

| API style                                  | How the error arrives                 | How to handle                                  |
| ------------------------------------------ | ------------------------------------- | ---------------------------------------------- |
| Synchronous (`readFileSync`, `JSON.parse`) | Thrown                                | `try...catch`                                  |
| Callback (`fs.readFile`)                   | First argument: `(err, result) => {}` | `if (err) return …` at the top of the callback |
| Promise (`fs/promises`, `fetch`)           | Rejected promise                      | `await` inside `try...catch`, or `.catch()`    |
| `EventEmitter`, streams                    | `'error'` event                       | `emitter.on('error', …)`                       |

- `try...catch` around a function that takes a callback does **not** catch the
  callback's error: the callback runs later, on another call stack.
- An `EventEmitter` that emits `'error'` with no listener **throws** it, which
  usually crashes the process. Every stream, socket and server needs an
  `'error'` listener, or use `pipeline()` / `await` APIs that turn it into a
  rejection.
- A forgotten `await` lets the error escape: the rejection is not caught by the
  surrounding `try` and becomes an unhandled rejection, which terminates the
  process.

### Unhandled Errors

- `uncaughtException`: a thrown error nobody caught. The process prints it and
  exits with code 1.
- `unhandledRejection`: a rejected promise without a handler. Since Node.js 15
  the default mode is `throw`: it is raised as an uncaught exception and also
  terminates the process.
- `process.on('uncaughtException', …)` is a last resort for **logging and
  exiting**, not for continuing: after an unknown exception the state of the
  program is undefined (half-written data, unreleased locks). Let a process
  manager (systemd, Kubernetes, PM2) start a new process.

### Express

- Error-handling middleware has **four** parameters `(err, req, res, next)` and
  is registered after the routes.
- Express 5 passes rejected promises from `async` handlers to `next(err)`
  automatically; in Express 4 you had to wrap the handler or call `next(err)`
  yourself.
- Do not send stack traces or internal messages to the client in production.

## Example

Last-resort handler:

```javascript
// error-start
process.on('uncaughtException', (error) => {
  console.error(error); // the process keeps running in an unknown state
});
// error-end

// correct-start
process.on('uncaughtException', (error) => {
  console.error(error);
  process.exit(1); // a process manager starts a new one
});
// correct-end
```

Express 5 with a custom error class:

```typescript
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

const users = new Map([['1', { id: '1', name: 'Ada' }]]);
const findUser = async (id: string) => users.get(id);

const app = express();

app.get('/users/:id', async (req, res) => {
  const user = await findUser(req.params.id); // a rejection goes to next(err)
  if (!user) throw new HttpError(404, 'User not found');
  res.json(user);
});

// Registered last; four parameters make it an error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000);
```

- `err` is typed as `unknown`: anything can be thrown, so the handler narrows it
  with `instanceof` before reading `statusCode`.

## Follow-up Questions

- Why restart the process after an uncaught exception instead of continuing? The
  exception may have interrupted code halfway, leaving shared state broken; a
  new process starts clean.
- How do you shut down gracefully? On `SIGTERM`, stop accepting connections
  (`server.close()`), finish in-flight requests, close database pools, then
  exit.
- How do you add context to an error without losing the original? The `cause`
  option: `new Error('message', { cause: err })`.
- How do you cancel a slow operation? Pass an `AbortSignal`, for example
  `fetch(url, { signal: AbortSignal.timeout(5000) })`; it rejects with an
  `AbortError` or `TimeoutError`.

## Common Mistakes

- Catching an error and only logging it, so the caller thinks the operation
  succeeded.
- Wrapping a callback API in `try...catch` and expecting it to catch the
  asynchronous error.
- Emitting `'error'` or creating a stream without an `'error'` listener.
- Keeping the process running in `uncaughtException`.
- Comparing `err.message` instead of `err.code` or `instanceof`.

## See Also

- [Error Handling in JavaScript](../javascript/errors.md)
- [Events Module](./modules/events.md)
- [Stream Module](./modules/stream.md)
