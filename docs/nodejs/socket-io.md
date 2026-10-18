---
sidebar_position: 6
description:
  Socket.IO vs WebSocket, transports, events and acknowledgements, rooms and
  namespaces, scaling with adapters
tags: [middle]
---

# Socket.IO

**Socket.IO** is a library for real-time, bidirectional, event-based
communication between a client and a Node.js server. It is **not** a WebSocket
implementation: it has its own protocol on top of **Engine.IO**, which connects
over HTTP long-polling or WebSocket (and WebTransport) and upgrades to the best
available transport. On top of that it adds **named events**,
**acknowledgements**, **automatic reconnection**, **rooms** and **namespaces**.
Because of the protocol, a plain `WebSocket` client cannot talk to a Socket.IO
server, and the Socket.IO client cannot talk to a plain WebSocket server.

Applies to: Socket.IO 4.8.

## Details

### Socket.IO vs WebSocket vs SSE

|                     | WebSocket (browser API, `ws`) | Socket.IO                                             | Server-Sent Events       |
| ------------------- | ----------------------------- | ----------------------------------------------------- | ------------------------ |
| Direction           | Both ways                     | Both ways                                             | Server → client only     |
| Messages            | Raw strings or binary         | Named events with any serializable arguments, binary  | Text events              |
| Reconnection        | Write it yourself             | Built in, with backoff; events are buffered meanwhile | Built in (`EventSource`) |
| Fallback            | None                          | HTTP long-polling                                     | Not needed: plain HTTP   |
| Rooms, broadcasting | Write it yourself             | Built in                                              | Write it yourself        |
| Client size         | 0 (built into browsers)       | A client library                                      | 0                        |

Use plain WebSocket when the protocol is simple or the other side is not
Socket.IO; Socket.IO when you need rooms, acknowledgements and reconnection
without writing them.

### Events

- Custom events: `socket.emit('chat:message', data)` on one side,
  `socket.on('chat:message', handler)` on the other. Any number of arguments,
  objects are serialized automatically.
- **Acknowledgements:** the last argument of `emit` can be a callback that the
  other side calls to confirm receipt; or `await socket.emitWithAck(…)`.
- Reserved events (cannot be emitted by the application):

| Where  | Event                                     | When                                                  |
| ------ | ----------------------------------------- | ----------------------------------------------------- |
| Server | `connection` (on `io` or a namespace)     | A client has connected                                |
| Server | `disconnecting`, `disconnect` (on socket) | The client is leaving (still in its rooms) / has left |
| Client | `connect`, `disconnect`                   | Connected / disconnected                              |
| Client | `connect_error`                           | Connection failed or was rejected by middleware       |

- `message` is not a reserved event: it is the event name used by
  `socket.send()`.
- Delivery is **at most once** by default and in order. For guaranteed delivery,
  use acknowledgements with retries (`io({ retries: 3, ackTimeout: 10000 })` on
  the client) or connection state recovery.

### Rooms and Namespaces

| Task                                   | Code                                                   |
| -------------------------------------- | ------------------------------------------------------ |
| Join / leave a room                    | `socket.join('room1')`, `socket.leave('room1')`        |
| Send to everyone in a room             | `io.to('room1').emit('event', data)`                   |
| Send to a room, except the sender      | `socket.to('room1').emit('event', data)`               |
| Send to everyone except the sender     | `socket.broadcast.emit('event', data)`                 |
| Rooms of a socket                      | `socket.rooms` (a `Set`, includes its own `socket.id`) |
| Separate channel with its own handlers | `io.of('/admin').on('connection', …)`                  |

- **Rooms** exist only on the server: the client does not know which rooms it is
  in. Each socket is automatically in a room named after its `socket.id`, which
  is how you message one client. On disconnect, a socket leaves all its rooms.
- **Namespaces** split one connection into channels (`/`, `/admin`) with their
  own handlers, rooms and middleware.
- **Middleware** `io.use((socket, next) => …)` runs on connection: the place for
  authentication (`socket.handshake.auth`).

### Scaling

- Several Node.js servers do not see each other's sockets: `io.to(room).emit`
  reaches only clients connected to the same server. An **adapter** (Redis,
  Postgres, cluster) forwards broadcasts between servers.
- With HTTP long-polling, every request of a session must reach the same server:
  configure **sticky sessions** in the load balancer, or allow only the
  WebSocket transport.

## Example

```javascript title="server.mjs"
import { Server } from 'socket.io';

const io = new Server(3000, { cors: { origin: 'http://localhost:5173' } });

io.on('connection', (socket) => {
  socket.on('room:join', (room, ack) => {
    socket.join(room);
    ack({ ok: true });
  });

  socket.on('chat:message', (room, text) => {
    io.to(room).emit('chat:message', { from: socket.id, text });
  });
});
```

```javascript title="client.mjs"
// Browser or Node.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('chat:message', ({ from, text }) => console.log(`${from}: ${text}`));

// highlight-next-line
const { ok } = await socket.emitWithAck('room:join', 'general');
if (ok) socket.emit('chat:message', 'general', 'Hello!');
```

## Follow-up Questions

- How does Socket.IO notice a dead connection? A heartbeat: the server pings
  every `pingInterval` (25 s) and drops the socket after `pingTimeout` (20 s)
  without a pong; the client then reconnects.
- Can you connect to a Socket.IO server with `new WebSocket(url)`? No: Socket.IO
  has its own handshake and packet format; you need the Socket.IO client.
- Why start with long-polling? It works through proxies and firewalls that block
  WebSocket; the connection then upgrades. It can be disabled with
  `transports: ['websocket']`.
- How do you authenticate a socket? Pass a token in
  `io(url, { auth: { token } })` and check it in `io.use()` middleware; reject
  with `next(new Error(…))`, which arrives on the client as `connect_error`.
- How do you scale to several servers? An adapter for broadcasts plus sticky
  sessions or WebSocket-only transport.

## Common Mistakes

- "Socket.IO is a WebSocket library." It uses WebSocket as one of the transports
  under its own protocol.
- "`message` is a built-in event." It is the name used by `send()`, nothing
  more.
- Expecting `io.emit` to reach clients connected to another server instance
  without an adapter.
- Treating events as guaranteed to arrive: without acknowledgements, an event
  sent during a disconnect can be lost.

## See Also

- [Real-Time Updates in the Browser](../web-platform/network/realtime.md)
- [HTTP Module](./modules/http.md)
- [Events Module](./modules/events.md)
