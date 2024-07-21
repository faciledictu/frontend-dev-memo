---
sidebar_position: 3
---

# FS (File System) Module

The File System Access API provides a way to interact with the file system,
allowing web applications to read and write files on the user's device. This API
is particularly useful for applications that need to save user data locally or
allow users to upload and download files.

## Key Concepts

- File Handles: Represent a reference to a file on the user's file system. They
  allow you to read from and write to the file.
- Directory Handles: Represent a reference to a directory on the user's file
  system. They allow you to read from and write to the directory, as well as
  access its contents.
- File Permissions: The API requires explicit permission from the user to read
  or write files, ensuring privacy and security.

### Synchronous Methods

Synchronous methods block the execution of code until they complete, which can
be simpler but may slow down your application if used excessively, especially
for I/O operations.

:::info

These Methods:

- Block the event loop.

- Simpler to write.

- Suitable for quick scripts or tasks where performance is not critical.

:::

These methods have `...Sync` at the end of their names and block the event loop
until they complete.

```typescript
import * as fs from 'fs';

try {
  const data = fs.readFileSync('path/to/file.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```

## Asynchronous Methods

Asynchronous methods do not block the execution of code. They use callbacks to
handle the result of the operation, making them suitable for non-blocking,
event-driven programming.

:::info

These Methods:

- Use callbacks to handle results.

- Non-blocking, more efficient for I/O operations.

- Can lead to callback hell if not managed properly.

:::

```typescript
import * as fs from 'fs';

fs.readFile('path/to/file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

## Promise-based Methods

Promise-based methods are part of the `fs.promises` API, providing a modern
approach to asynchronous operations using promises, making the code more
readable and easier to manage, especially with `async/await`.

:::info

These Methods:

- Use promises for handling results.

- Clean and readable, especially with async/await.

- Non-blocking and modern, preferred for scalable applications.

:::

These methods are part of the `fs.promises` API and return promises, making them
suitable for use with async/await.

```typescript
import { promises as fs } from 'fs';

async function readFile(path: string) {
  try {
    const data = await fs.readFile(path, 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

readFile('path/to/file.txt');
```

## Some of Most Used Methods

| Sync                | Async           | Promise-based                | Description                         |
| ------------------- | --------------- | ---------------------------- | ----------------------------------- |
| `fs.readFileSync`   | `fs.readFile`   | `fs.promises.readFileSync`   | Read files                          |
| `fs.writeFileSync`  | `fs.writeFile`  | `fs.promises.writeFileSync`  | Write files                         |
| `fs.appendFileSync` | `fs.appendFile` | `fs.promises.appendFileSync` | Append to files                     |
| `fs.unlinkSync`     | `fs.unlink`     | `fs.promises.unlinkSync`     | Delete files                        |
| `fs.mkdirSync`      | `fs.mkdir`      | `fs.promises.mkdirSync`      | Create directories                  |
| `fs.rmdirSync`      | `fs.rmdir`      | `fs.promises.rmdirSync`      | Delete directories                  |
| `fs.accessSync`     | `fs.access`     | `fs.promises.accessSync`     | Check if a file or directory exists |
