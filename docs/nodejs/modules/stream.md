---
sidebar_position: 4
description:
  Readable, Writable, Duplex and Transform streams, backpressure, pipeline vs
  pipe, async iteration, stream events
---

# Stream Module

A **stream** processes data **in chunks** as it arrives instead of loading all
of it into memory: a 10 GB file can be copied with a few dozen kilobytes of
memory. There are four types: **Readable** (source), **Writable** (destination),
**Duplex** (both, for example a TCP socket) and **Transform** (a duplex that
changes data on the way, for example gzip). Streams handle **backpressure**: a
fast source is paused when the destination cannot keep up. Connect streams with
**`pipeline()`** from `node:stream/promises`: unlike `.pipe()`, it forwards
errors and destroys all streams when one fails.

Applies to: Node.js 24 LTS.

## Details

### Types

| Type      | Role                             | Examples                                                           |
| --------- | -------------------------------- | ------------------------------------------------------------------ |
| Readable  | Produces data                    | `fs.createReadStream`, HTTP `req` on the server, `process.stdin`   |
| Writable  | Consumes data                    | `fs.createWriteStream`, HTTP `res` on the server, `process.stdout` |
| Duplex    | Independent read and write sides | `net.Socket`, WebSocket connections                                |
| Transform | Output is computed from input    | `zlib.createGzip()`, `crypto.createHash()`                         |

- Chunks are `Buffer`s (or strings with an encoding). In **object mode**
  (`objectMode: true`) a chunk can be any JavaScript value.
- `highWaterMark` is the size of the internal buffer: 64 KiB by default (16
  objects in object mode). It is a threshold, not a hard limit.

### Backpressure

- `writable.write(chunk)` returns `false` when the buffer is above
  `highWaterMark`. The producer should stop writing and wait for the
  **`'drain'`** event.
- Ignoring `false` does not lose data, but everything piles up in memory.
- `pipeline()`, `.pipe()` and `for await` handle backpressure for you.

### `pipeline` vs `pipe`

|                               | `readable.pipe(writable)`                                   | `await pipeline(a, b, c)` |
| ----------------------------- | ----------------------------------------------------------- | ------------------------- |
| Backpressure                  | Yes                                                         | Yes                       |
| Errors from any stream        | Not forwarded: each stream needs its own `'error'` listener | One rejection             |
| Cleanup when one stream fails | No: the others stay open (file descriptor leaks)            | All streams are destroyed |
| Async generators as steps     | No                                                          | Yes                       |

### Reading

- **Async iteration** is the simplest way:
  `for await (const chunk of readable)`. Errors become exceptions, and
  backpressure is respected.
- **Flowing mode:** a `'data'` listener or `.pipe()` makes the stream push
  chunks as fast as they come. **Paused mode:** chunks are pulled with `read()`
  on `'readable'`.
- Web Streams (`ReadableStream`, used by `fetch`) are a separate API; convert
  with `Readable.fromWeb()` and `Readable.toWeb()`.

### Events

| Stream   | Event      | When                                                             |
| -------- | ---------- | ---------------------------------------------------------------- |
| Readable | `data`     | A chunk is available (flowing mode)                              |
|          | `end`      | No more data                                                     |
|          | `readable` | Data can be pulled with `read()` (paused mode)                   |
| Writable | `drain`    | The buffer has emptied; writing can continue                     |
|          | `finish`   | `end()` was called and all data was flushed                      |
| Both     | `error`    | Something failed; without a listener it is thrown                |
|          | `close`    | The stream and its resource (file descriptor, socket) are closed |

## Example

Compress a file and count its lines, with a custom step as an async generator:

```javascript
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

let lines = 0;

await pipeline(
  createReadStream('access.log'),
  async function* (source) {
    for await (const chunk of source) {
      for (const byte of chunk) if (byte === 10) lines++; // '\n'
      yield chunk; // pass the chunk on unchanged
    }
  },
  createGzip(),
  createWriteStream('access.log.gz')
);

console.log(`Compressed ${lines} lines`);
```

Streaming a file to an HTTP response:

```javascript
import { createReadStream } from 'node:fs';
import http from 'node:http';
import { pipeline } from 'node:stream/promises';

http
  .createServer(async (req, res) => {
    // error-next-line
    createReadStream('big.txt').pipe(res); // a missing file crashes the process

    // correct-start
    try {
      await pipeline(createReadStream('big.txt'), res);
    } catch (err) {
      console.error(err); // ENOENT or a client disconnect; res is destroyed too
    }
    // correct-end
  })
  .listen(3000);
```

## Follow-up Questions

- Why use streams instead of `readFile`? Memory stays constant regardless of the
  data size, and processing starts with the first chunk.
- What is backpressure and what happens without it? The producer is faster than
  the consumer; without backpressure the unwritten data grows in memory until
  the process runs out of it.
- How do you write a Transform?
  `new Transform({ transform(chunk, encoding, callback) { callback(null, result) } })`,
  or an async generator in `pipeline`.
- What does `stream.finished()` do? Resolves when a stream has ended, failed or
  closed: a reliable way to know it is done.

## Common Mistakes

- Using `.pipe()` without `'error'` listeners on every stream.
- Ignoring the return value of `write()` in a loop.
- Mixing `'data'` listeners and `for await` on the same stream.
- Reading a whole file with `readFile` to send it in an HTTP response.

## See Also

- [File System Module](./filesystem.md)
- [HTTP Module](./http.md)
- [Events Module](./events.md)
