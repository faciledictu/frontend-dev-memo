---
sidebar_position: 6
description:
  Polling, long polling, Server-Sent Events and WebSocket, how each works and
  when to choose it
tags: [middle]
---

# Real-Time Updates: WebSocket, SSE, Polling

HTTP is request–response: the server cannot send anything until the client asks.
Ways to get updates without a reload:

- **Polling**: a request every few seconds. A delay and many empty responses.
- **Long polling**: the server holds the request open until there is data, then
  the client sends the next one.
- **Server-Sent Events** (SSE, `EventSource`): one long HTTP response in which
  the server writes text events. **Server → client only**, with automatic
  reconnection.
- **WebSocket**: a persistent **two-way** connection, opened with an HTTP
  upgrade.

SSE suits notifications, feeds, progress and streaming of AI responses;
WebSocket suits chats, multiplayer games and collaborative editing.

## Details

|               | Polling       | Long polling                           | SSE                                       | WebSocket                                   |
| ------------- | ------------- | -------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| Direction     | client asks   | client asks, server answers when ready | server → client                           | both ways                                   |
| Protocol      | HTTP          | HTTP                                   | HTTP, `text/event-stream`                 | `ws://` / `wss://` after an HTTP upgrade    |
| Data          | any           | any                                    | UTF-8 text                                | text and binary                             |
| Reconnection  | not needed    | the next request                       | built in, with `Last-Event-ID`            | write it yourself                           |
| Cookies, auth | as usual      | as usual                               | cookies; `EventSource` cannot set headers | cookies on the handshake; no custom headers |
| Cost          | many requests | one open request per client            | one open response per client              | one open connection per client              |

### Server-Sent Events

- The response has `Content-Type: text/event-stream` and is never finished. Each
  event is a few `field: value` lines followed by an empty line: `data:` (the
  payload, may repeat), `event:` (the event name), `id:`, `retry:` (the
  reconnection delay in ms).
- After a disconnect, `EventSource` reconnects by itself and sends the last
  received `id` in the `Last-Event-ID` header, so the server can send what was
  missed. A response with status `204` stops the reconnection.
- `EventSource` supports only `GET` and no custom headers;
  `new EventSource(url, { withCredentials: true })` sends cookies cross-origin.
  AI chat UIs that need `POST` read a streamed `fetch` response instead
  (`response.body.getReader()`).
- Over HTTP/1.1 a browser opens at most 6 connections per domain, for all tabs
  together, so many tabs with SSE run out of them. HTTP/2 multiplexes the
  streams over one connection, usually up to 100.
- Proxies must not buffer the response (for nginx: `X-Accel-Buffering: no`).

### WebSocket

- The handshake is a `GET` with `Upgrade: websocket` and `Sec-WebSocket-Key`;
  the server answers `101 Switching Protocols`, and from then on the TCP
  connection carries WebSocket frames.
- API: `new WebSocket(url)`, the events `open`, `message`, `close`, `error`,
  `socket.send(data)`, `socket.close(code, reason)`, `readyState`.
- **Not built in**: reconnection, a heartbeat to detect dead connections (the
  protocol has ping/pong frames, but JavaScript in the browser cannot send
  them), message acknowledgements, rooms. Libraries such as Socket.IO add them.
  See [Socket.IO](../../nodejs/socket-io.md).
- WebSocket is **not limited by CORS**: any site can open a connection to your
  server, and the browser sends cookies with the handshake. The server must
  check the `Origin` header. See [CSRF](../security/csrf.md).
- Scaling: connections are long-lived and stateful, so a server needs sticky
  sessions or a shared broker (Redis pub/sub) to deliver a message to clients
  connected to other instances.

**WebTransport** (HTTP/3, streams and unreliable datagrams) is the newer option
for games and media; WebSocket remains the default.

## Example

An SSE server in Node.js and the client (a page served from the same origin):

```javascript title="server.js"
import { createServer } from 'node:http';

createServer((req, res) => {
  if (req.url !== '/events') return res.writeHead(404).end();

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  let id = Number(req.headers['last-event-id'] ?? 0);
  const timer = setInterval(() => {
    id += 1;
    // highlight-start
    res.write(
      `id: ${id}\nevent: tick\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`
    );
    // highlight-end
  }, 1000);

  req.on('close', () => clearInterval(timer));
}).listen(3000);
```

```javascript
const source = new EventSource('/events');

source.addEventListener('tick', (event) => {
  console.log(event.lastEventId, JSON.parse(event.data));
});
// No reconnection code: EventSource reconnects and sends Last-Event-ID
```

A WebSocket client with reconnection and backoff:

```javascript
function connect(attempt = 0) {
  const socket = new WebSocket('wss://chat.example.com');

  socket.addEventListener('open', () => {
    attempt = 0;
    socket.send(JSON.stringify({ type: 'join', room: 'general' }));
  });

  socket.addEventListener('message', (event) => {
    console.log(JSON.parse(event.data));
  });

  socket.addEventListener('close', (event) => {
    if (event.code === 1000) return; // closed on purpose
    // highlight-next-line
    const delay = Math.min(1000 * 2 ** attempt, 30_000); // 1 s, 2 s, 4 s … 30 s
    setTimeout(() => connect(attempt + 1), delay);
  });
}

connect();
```

## Follow-up Questions

- Why not always use WebSocket? SSE and polling are plain HTTP: they work with
  existing auth, caches, proxies and load balancers, and reconnect by
  themselves. WebSocket is worth it when the client also sends a lot.
- How does the server know that a WebSocket client is gone? `close` fires when
  the connection ends, cleanly or not (code `1006`). But a connection that dies
  silently (lost network, a sleeping laptop) sends nothing, and `close` comes
  only after a TCP timeout. A heartbeat (the server's ping/pong, or
  application-level messages) detects it.
- How do you authenticate a WebSocket? A cookie sent with the handshake (and an
  `Origin` check), or a short-lived token in the first message. A token in the
  URL ends up in server logs.
- What about messages missed while the client was disconnected? SSE: the browser
  sends `Last-Event-ID`, and the server replays the rest. WebSocket: number the
  messages and ask for everything after the last seen ID on reconnect, or
  refetch the state.
- Why do AI chat UIs stream with `fetch` instead of `EventSource`? `EventSource`
  cannot send `POST` or set headers; `fetch` with `response.body.getReader()`
  can, but reconnection and `Last-Event-ID` are then your code.

## Common Mistakes

- "SSE is outdated, WebSocket replaced it." They solve different tasks; SSE is
  simpler for server → client streams.
- "WebSocket reconnects automatically." `EventSource` does; for `WebSocket` it
  is application code or a library.
- Not checking `Origin` on the WebSocket handshake.
- "Socket.IO is WebSocket." It is its own protocol on top of WebSocket and long
  polling.

## See Also

- [HTTP](./http.md)
- [Socket.IO](../../nodejs/socket-io.md)
- [CSRF](../security/csrf.md)
