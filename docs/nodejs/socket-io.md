---
sidebar_position: 7
---

# Socket.io

Socket.io is a JavaScript library that enables real-time, bidirectional, and
event-based communication between web clients and servers. It is built on top of
_WebSockets API_.

## Use Cases

Socket.io is used for various real-time applications such as:

- Real-time analytics
- Instant messaging
- Live chat
- Collaborative editing
- Online gaming

## Principles

Socket.io consists of two parts:

- Client-side library: Runs in the browser and is available as a Node.js module.

- Server-side library: For Node.js, enabling communication between the server
  and clients.

Socket.io uses _WebSockets when possible_, but it can also fall back to other
techniques like _HTTP long-polling_ for environments where WebSockets are not
supported. This makes it reliable and adaptable to different environments and
network conditions.

## Events

Socket.io provides a set of built-in events for basic operations:

- `connection`: Fired when a client connects to the server.
- `disconnect`: Fired when a client disconnects from the server.
- `message`: A general event for sending messages.
- `connect_error`: Fired when the connection encounters an error.

## Creating Your Own Events

You can create custom events to handle specific logic in your application.

On server:

```javascript
const io = require('socket.io')(3000);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listening to a custom event
  socket.on('myCustomEvent', (data) => {
    console.log('Received myCustomEvent:', data);

    // Emitting a custom event
    socket.emit('myResponseEvent', { message: 'Hello from server!' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
```

Using on client:

```javascript
const socket = io('http://localhost:3000');

// Emitting a custom event
socket.emit('myCustomEvent', { message: 'Hello from client!' });

// Listening to a custom event
socket.on('myResponseEvent', (data) => {
  console.log('Received myResponseEvent:', data);
});
```

## Rooms

Rooms are a way to group multiple sockets together, allowing for efficient
broadcast and targeted messaging within a subset of connected clients. Each
socket can join and leave multiple rooms, enabling flexible and scalable
communication patterns.

### Use Cases for Rooms

- Chat Applications: Grouping users into different chat rooms.
- Collaborative Applications: Different groups working on different documents or
  projects.
- Online Gaming: Players grouped into different game sessions or lobbies.
- Notifications: Sending targeted notifications to specific groups of users.

### Creating and Managing Rooms

To add a socket to a room, use the join method. This method adds the socket to
the specified room, creating the room if it does not exist.

```javascript
io.on('connection', (socket) => {
  // Automatically join a room on connection
  socket.join('room1');

  // Join a specific room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });
});
```

#### Leaving a Room

To remove a socket from a room, use the leave method. This method removes the
socket from the specified room.

```javascript
io.on('connection', (socket) => {
  // Leave a specific room
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });
});
```

### Checking Room Membership

To check if a socket is in a specific room or to get a list of rooms a socket is
in, you can use the rooms property of the socket.

```javascript
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} is in rooms:`, socket.rooms);
});
```

### Broadcasting to Rooms

To send a message to all clients in a specific room, use the `to` or `in`
method.

```javascript
io.on('connection', (socket) => {
  socket.on('sendMessageToRoom', (room, message) => {
    io.to(room).emit('message', message);
    console.log(`Message sent to room ${room}: ${message}`);
  });
});
```

To broadcast a message to all clients in a room except the sender, use the
`broadcast.to` method.

```javascript
io.on('connection', (socket) => {
  socket.on('broadcastToRoom', (room, message) => {
    socket.broadcast.to(room).emit('message', message);
    console.log(
      `Message broadcast to room ${room} excluding sender: ${message}`
    );
  });
});
```

### Handling Disconnections

When a socket disconnects, it automatically leaves all the rooms it was a part
of. You can handle additional logic during the disconnect event.

### Client-Side Implementation

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io('http://localhost:3000');

  // Join a room
  socket.emit('joinRoom', 'room1');

  // Leave a room
  socket.emit('leaveRoom', 'room1');

  // Send a message to a room
  socket.emit('sendMessageToRoom', 'room1', 'Hello, Room 1!');

  // Listen for messages from the server
  socket.on('message', (message) => {
    console.log('Received message:', message);
  });
</script>
```
