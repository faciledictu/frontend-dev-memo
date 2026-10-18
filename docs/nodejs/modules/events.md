---
sidebar_position: 3
description:
  EventEmitter, synchronous listeners, the special error event, once and
  promises, listener leaks, EventEmitter vs EventTarget
tags: [junior, middle]
---

# Events Module

`EventEmitter` from `node:events` implements the **observer pattern**: an object
emits named events, and listeners subscribed with `on()` react to them. Streams,
HTTP servers, sockets and child processes are all emitters. `emit()` calls the
listeners **synchronously**, in the order they were added, and returns only
after all of them have run; the asynchrony comes from the code that calls
`emit()` (for example, an I/O callback), not from the emitter. The **`'error'`**
event is special: if it is emitted and there is no listener, the error is
**thrown**.

Applies to: Node.js 24 LTS.

## Details

### Methods

| Method                                | What it does                                                        |
| ------------------------------------- | ------------------------------------------------------------------- |
| `on(name, fn)` / `addListener`        | Adds a listener to the end of the list                              |
| `once(name, fn)`                      | Adds a listener that is removed after the first call                |
| `prependListener(name, fn)`           | Adds a listener to the beginning of the list                        |
| `off(name, fn)` / `removeListener`    | Removes one listener (the same function reference)                  |
| `removeAllListeners([name])`          | Removes all listeners of an event or of all events                  |
| `emit(name, ...args)`                 | Calls the listeners synchronously; returns `true` if there were any |
| `listenerCount(name)`, `eventNames()` | Introspection                                                       |
| `setMaxListeners(n)`                  | Changes the leak warning threshold (10 by default)                  |

Static helpers:

- `await events.once(emitter, 'ready')`: a promise of the next event; rejects if
  `'error'` is emitted first.
- `for await (const [data] of events.on(emitter, 'data'))`: events as an async
  iterator.

### The `'error'` Event

- An emitter reports failures with `emit('error', err)`.
- No `'error'` listener → `emit` **throws** the error. In an I/O callback this
  is an uncaught exception, and the process exits.
- So every stream, socket, server or child process needs an `'error'` listener,
  or it must be used through an API that turns errors into rejections
  (`pipeline`, `events.once`).

### Listener Leaks

- More than 10 listeners for one event prints `MaxListenersExceededWarning`.
  Usually it means a listener is added on every request and never removed.
- Fix the leak (`off`, `once`, or an `AbortSignal`) rather than raising the
  limit.

### `EventEmitter` vs `EventTarget`

|                   | `EventEmitter` (`node:events`) | `EventTarget` (Web API, global in Node.js) |
| ----------------- | ------------------------------ | ------------------------------------------ |
| Subscribe         | `on(name, fn)`                 | `addEventListener(type, fn)`               |
| Listener receives | Any arguments of `emit`        | One `Event` object                         |
| `'error'`         | Throws if nobody listens       | No special handling                        |
| Used by           | Node.js core APIs              | `AbortSignal`, browser-compatible code     |

## Example

```javascript
import { EventEmitter, once } from 'node:events';

class Chat extends EventEmitter {
  send(user, text) {
    if (!text) {
      this.emit('error', new Error('Empty message'));
      return;
    }
    this.emit('message', { user, text });
  }
}

const chat = new Chat();

chat.on('message', ({ user, text }) => console.log(`${user}: ${text}`));
chat.on('error', (err) => console.error('Chat error:', err.message));

console.log('before');
// highlight-next-line
chat.send('Ada', 'Hello'); // the listener runs right here, synchronously
console.log('after');
chat.send('Ada', ''); // without the 'error' listener this line would throw

setTimeout(() => chat.emit('ready'), 10);
await once(chat, 'ready');
console.log('ready');

// before
// Ada: Hello
// after
// Chat error: Empty message
// ready
```

## Follow-up Questions

- Can a listener be `async`? `emit` ignores the returned promise, so a rejection
  is unhandled and by default exits the process. With `captureRejections: true`
  (per emitter or `EventEmitter.captureRejections`) it is routed to `'error'`.
- Are listeners called asynchronously? No, `emit` calls them one by one before
  it returns. Use `setImmediate` or `queueMicrotask` inside a listener to defer
  work.
- What happens if a listener throws? The exception propagates out of `emit`, and
  the remaining listeners are not called.
- How do you remove a listener added with an arrow function? Keep a reference to
  the function, or pass `{ signal }` from an `AbortController` to `events.on` /
  `addEventListener`.

## Common Mistakes

- "Events are processed asynchronously." `emit` is synchronous.
- Not listening for `'error'`: one failed connection crashes the process.
- Adding listeners inside a request handler without removing them: memory leak
  and `MaxListenersExceededWarning`.
- `off(name, () => …)` with a new function: it removes nothing, the reference
  must be the same.

## See Also

- [Stream Module](./stream.md)
- [Error Handling in Node.js](../errors.md)
- [Event Loop in Node.js](../event-loop.md)
