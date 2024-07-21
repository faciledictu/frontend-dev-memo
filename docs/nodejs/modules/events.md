---
sidebar_position: 4
---

# Events Module

## Event-Based Approach

An event-based approach is a programming paradigm where the flow of the program
is determined by events, such as user actions (clicks, key presses), sensor
outputs, or messages from other programs or threads. In this model, a program
listens for and responds to events as they occur.

:::info Key Characteristics

1. Asynchronous Handling: Events are processed asynchronously, allowing the
   program to handle multiple events concurrently without blocking the main
   execution thread.
2. Event Emitters and Listeners: An event emitter generates and dispatches
   events, while listeners (or event handlers) respond to these events.
3. Decoupling: This approach decouples the event producer (emitter) from the
   event consumer (listener), promoting a more modular and maintainable
   codebase.

:::

## Methods and Expamples

The events module provides a way to handle asynchronous events.

1. Creating and Event Emitter instance

   ```typescript
   const myEmitter = new EventEmitter();
   ```

2. Setting up and event listener

   ```typescript
   myEmitter.on('greet', () => {
     console.log('Hello! Someone greeted!');
   });
   ```

3. Trigger (emit) the event

   ```typescript
   myEmitter.emit('greet');
   ```

   When we emit the greet event, the listener is triggered, and the message _"Hello! Someone greeted!"_ is logged to the console.

## Real-World Use Case

Imagine you're building a chat application. You can use the event-based approach
to handle new messages. When a user sends a message, an event is emitted.
Listeners can then pick up this event and broadcast the message to other users,
save it to a database, or even log it for moderation.

```typescript
import { EventEmitter } from 'events';

interface Message {
  user: string;
  content: string;
}

class ChatEmitter extends EventEmitter {
  sendMessage(message: Message): void {
    this.emit('newMessage', message);
  }
}

const chatEmitter = new ChatEmitter();

chatEmitter.on('newMessage', (message: Message) => {
  console.log(`${message.user} says: ${message.content}`);
  // Additional logic to handle the message
});

chatEmitter.sendMessage({ user: 'Alice', content: 'Hello, World!' });
chatEmitter.sendMessage({ user: 'Bob', content: 'Hi, Alice!' });
```

1. We define a `interface Message` to type our message objects.
2. We create a `class ChatEmitter` that extends `EventEmitter` and includes a method
   `sendMessage` to emit `newMessage` events.
3. We set up a listener for the `newMessage` event, which logs the message to the
   console and could include additional logic like broadcasting the message or
   saving it to a database.
4. We emit a couple of `newMessage` events to demonstrate the functionality.
