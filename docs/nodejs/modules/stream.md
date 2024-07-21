---
sidebar_position: 7
---

# Stream Module

Streams are a powerful concept in Node.js that allow you to work with large
amounts of data efficiently. They provide a way to process data piece-by-piece,
without having to load the entire dataset into memory.

:::tip

Streams particularly useful for handling large files or data sources, like
reading or writing files, handling HTTP requests and responses, or processing
data from a database.

:::

:::note Key Concepts

**Chunks.** Streams process data in chunks, which are small pieces of data.

**Piping.** A mechanism to connect the output of one stream directly to another
stream.

**Events.** Streams are instances of EventEmitter and emit several events at
different stages of their operation, like data, end, error, and finish.

:::

Streams are implemented in the `stream` module, which is a core Node.js module.

## Types of Streams

There are four main types of streams in Node.js

1. `stream.Readable`: Used for reading data.

2. `stream.Writable`: Used for writing data.

3. `stream.Duplex`: Used for both reading and writing data.

4. `stream.Transform`: A type of duplex stream where the output is computed
   based on the input.

## Event Emitters

Streams are instances of `EventEmitter` so you can use methods such as on, once
etc. They emit various events.

<details>
<summary>Events Types and Examples</summary>

### Readable Stream Events

- `data`: Emitted when data is available to be read from the stream. This event
  is only emitted in flowing mode.
- `end`: Emitted when there is no more data to be consumed from the stream.
- `error`: Emitted if an error occurs while reading data.
- `readable`: Emitted when there is data available to be read, but it is not in
  flowing mode. This allows you to manually read the data.
- `close`: Emitted when the stream and any of its underlying resources (like a
  file descriptor) have been closed. Not all streams will emit this event.

### Writable Stream Events

- `drain`: Emitted when the writable stream’s internal buffer is emptied,
  indicating that more data can be written.
- `finish`: Emitted after the end method has been called and all data has been
  flushed to the underlying system.
- `pipe`: Emitted when the pipe method is called on a readable stream, adding
  this writable stream to its set of destinations.
- `unpipe`: Emitted when the unpipe method is called on a readable stream,
  removing this writable stream from its set of destinations.
- `error`: Emitted if an error occurs while writing data.
- `close`: Emitted when the stream and any of its underlying resources have been
  closed.

### Duplex and Transform streams

Inherit events from both Readable and Writable streams.

```typescript
import fs from 'fs';

// Creating a readable stream
const readableStream = fs.createReadStream('input.txt');

// Attaching event listeners
readableStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});

readableStream.on('end', () => {
  console.log('No more data to read.');
});

readableStream.on('error', (err) => {
  console.error('An error occurred:', err);
});

readableStream.on('close', () => {
  console.log('Stream has been closed.');
});

// Creating a writable stream
const writableStream = fs.createWriteStream('output.txt');

// Attaching event listeners
writableStream.on('finish', () => {
  console.log('All data has been written to the file.');
});

writableStream.on('error', (err) => {
  console.error('An error occurred:', err);
});

writableStream.on('close', () => {
  console.log('Stream has been closed.');
});

// Writing data to the writable stream
writableStream.write('Hello, world!\n');
writableStream.end();
```

</details>

## Methods

:::note Flow Modes

**Flowing mode**: Data is read from the stream automatically and provided to the application via events as soon as it is available.

**Paused mode**: Data must be explicitly read from the stream using methods like `read()`.

:::

`readableStream.read([size])`<br/>Reads data from the stream.

`readableStream.pause()`<br/>Pauses the flowing of data.

`readableStream.resume()`<br/>Resumes the flowing of data.

`writableStream.write(chunk, [encoding], [callback])`<br/>Writes data to the stream.

`writableStream.end([chunk], [encoding], [callback])`<br/>Signals that no more data
will be written to the stream.

`readableStream.pipe(writable)`<br/>Used to pass data from a readable stream to a
writable stream. This simplifies the process of reading from one stream and
writing to another.

## Backpressure

Streams handle backpressure, which occurs when the writable stream cannot handle the amount of data being written to it as quickly as it is being produced by the readable stream.

Node.js streams manage this using the `highWaterMark` option and the `drain` event.

## Usage

### Reading and Writing Files

Streams can be used to read from and write to files efficiently.

```typescript
import { createReadStream, createWriteStream } from 'fs';

// Create readable and writable streams
const readableStream = createReadStream('input.txt');
const writableStream = createWriteStream('output.txt');

// Pipe the readable stream into the writable stream
readableStream.pipe(writableStream);
```

### Handling HTTP Requests/Responses

Streams are useful for handling large HTTP requests or responses.

```typescript
import { createServer } from 'http';
import { createReadStream } from 'fs';

// Create an HTTP server
const server = createServer((req, res) => {
  // Create a readable stream for a large file
  const readableStream = createReadStream('bigfile.txt');

  // Pipe the readable stream into the HTTP response
  readableStream.pipe(res);
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
```
