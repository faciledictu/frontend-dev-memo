---
sidebar_position: 1
description:
  Creating an HTTP server with node:http, request and response as streams,
  reading the body, headers, making requests with fetch
---

# HTTP Module

`node:http` is the built-in low-level HTTP server and client.
`http.createServer((req, res) => …)` calls the handler for every request: `req`
(`IncomingMessage`) is a **readable stream** with the method, URL and headers,
and `res` (`ServerResponse`) is a **writable stream** for the status, headers
and body. There is no routing, body parsing or cookies: that is what Express,
Fastify, Koa or Hono add on top. For **outgoing** requests, use the global
**`fetch`** (built in and stable since Node.js 21) instead of `http.request`.

Applies to: Node.js 24 LTS.

## Details

### Request and Response

| Object                    | Member                                               | What it is                                                     |
| ------------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| `req` (`IncomingMessage`) | `req.method`, `req.url`                              | `'GET'`, `'/users?page=2'` (path and query only, no host)      |
|                           | `req.headers`                                        | Object with **lower-cased** header names                       |
|                           | the stream itself                                    | The body, in `Buffer` chunks: `for await (const chunk of req)` |
| `res` (`ServerResponse`)  | `res.statusCode = 404`, `res.setHeader(name, value)` | Set the status and headers one by one                          |
|                           | `res.writeHead(status, headers)`                     | Sets the status and headers at once                            |
|                           | `res.write(chunk)`                                   | Sends part of the body; headers are sent with the first chunk  |
|                           | `res.end([data])`                                    | Finishes the response; must be called exactly once             |

- After headers are sent (by `writeHead`, the first `write` or `end`), changing
  them throws `ERR_HTTP_HEADERS_SENT`. So decide the status first, then write.
- A handler that never calls `res.end()` leaves the client hanging until a
  timeout.
- Parse the URL with `new URL(req.url, 'http://localhost')` to get `pathname`
  and `searchParams`.

### Related Modules

| Module       | Purpose                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| `node:https` | The same API over TLS; needs a key and a certificate                     |
| `node:http2` | HTTP/2 server and client; browsers require TLS for it                    |
| `fetch`      | Global HTTP client (based on undici): promises, Web `Request`/`Response` |

### `fetch` in Node.js

- Same API as in the browser, without CORS and cookies handling.
- It rejects only on network errors; a 404 or 500 is a normal response, so check
  `res.ok`.
- There is no default timeout that fits a request handler: pass
  `signal: AbortSignal.timeout(5000)`.
- The body must be consumed (`await res.json()`, `res.text()`) or cancelled,
  otherwise the connection is not returned to the pool.

## Example

```javascript
// server.mjs
import http from 'node:http';

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home page\n');
    return;
  }

  if (req.method === 'POST' && pathname === '/echo') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk); // chunks are Buffers
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: body }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found\n');
});

server.listen(3000, () => console.log('http://localhost:3000'));
```

```javascript
// client.mjs
const res = await fetch('http://localhost:3000/echo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ada' }),
  signal: AbortSignal.timeout(5000),
});

if (!res.ok) throw new Error(`HTTP ${res.status}`);
console.log(await res.json()); // { received: { name: 'Ada' } }
```

Writing the status before the routing decision:

```javascript
http.createServer((req, res) => {
  // error-next-line
  res.writeHead(200);
  if (req.url !== '/') {
    // error-next-line
    res.writeHead(404); // ERR_HTTP_HEADERS_SENT
  }
  res.end();
});
```

## Follow-up Questions

- Why use a framework if `node:http` exists? Routing, body parsing, middleware,
  validation and error handling would otherwise be written by hand.
- How does the server handle many requests at once? Each request is a callback
  on the event loop; while one waits for I/O, others run. A slow synchronous
  handler blocks all of them.
- How do you stream a large file in a response?
  `await pipeline(fs.createReadStream(file), res)`, see
  [Stream Module](./stream.md).
- How do you shut a server down gracefully? `server.close()` stops accepting new
  connections and waits for open ones; `server.closeIdleConnections()` closes
  idle keep-alive ones.

## Common Mistakes

- Calling `writeHead` before deciding the status, then calling it again.
- Treating `chunk` as a string: body chunks are `Buffer`s unless
  `req.setEncoding('utf8')` was called.
- Expecting `fetch` to throw on 404 or 500.
- Forgetting `res.end()` in one of the branches.

## See Also

- [HTTP in the browser](../../web-platform/network/http.md)
- [Stream Module](./stream.md)
- [Error Handling in Node.js](../errors.md)
