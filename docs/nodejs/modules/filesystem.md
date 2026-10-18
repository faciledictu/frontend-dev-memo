---
sidebar_position: 2
description:
  The fs module, promise vs callback vs sync APIs, common operations, paths,
  existence checks, streams for large files
tags: [junior]
---

# File System Module (`fs`)

The `node:fs` module reads and writes files and directories. Each operation
comes in three styles: **promise-based** (`node:fs/promises`, the default
choice), **callback-based** (`fs.readFile(path, cb)`) and **synchronous**
(`fs.readFileSync`), which **blocks the event loop** until it finishes and is
fine only at startup or in CLI scripts. Asynchronous file operations run in the
libuv thread pool. `readFile` loads the whole file into memory; for large files
use **streams** (`fs.createReadStream`).

Applies to: Node.js 24 LTS.

## Details

### Three API Styles

| Style    | Import                                      | Result                | Errors                   | Use for                                  |
| -------- | ------------------------------------------- | --------------------- | ------------------------ | ---------------------------------------- |
| Promise  | `import fs from 'node:fs/promises'`         | A promise             | Rejection, `try...catch` | Application code (default)               |
| Callback | `import fs from 'node:fs'`                  | `(err, result) => {}` | First callback argument  | Older code; slightly faster in hot paths |
| Sync     | `import fs from 'node:fs'`, `*Sync` methods | The value             | Thrown                   | Startup config, CLI scripts              |

### Common Operations

| Task                       | `fs/promises`                                             | Notes                                                                             |
| -------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Read a file                | `readFile(path, 'utf8')`                                  | Without an encoding returns a `Buffer`                                            |
| Write a file               | `writeFile(path, data)`                                   | Creates or **overwrites**                                                         |
| Append                     | `appendFile(path, data)`                                  |                                                                                   |
| Delete a file or directory | `rm(path, { recursive: true, force: true })`              | `unlink` for a single file; `rmdir` only removes empty directories                |
| Create a directory         | `mkdir(path, { recursive: true })`                        | `recursive` also means "no error if it exists"                                    |
| List a directory           | `readdir(path, { withFileTypes: true })`                  | `recursive: true` lists subdirectories too                                        |
| Find files by pattern      | `glob('src/**/*.ts')`                                     | Async iterator; stable since Node.js 24                                           |
| File info                  | `stat(path)`                                              | `size`, `mtime`, `isFile()`, `isDirectory()`                                      |
| Rename or move             | `rename(from, to)`                                        | Atomic within one file system on POSIX; may fail on Windows if the target is open |
| Copy                       | `copyFile(from, to)`, `cp(from, to, { recursive: true })` | `cp` copies directories                                                           |
| Watch for changes          | `watch(path)`                                             | Async iterator; behavior differs between operating systems                        |
| Low-level access           | `open(path, flags)` → `FileHandle`                        | `read`, `write`, `close()`; always close it                                       |

### Paths

- A relative path is resolved against **`process.cwd()`** (where `node` was
  started), not against the file that contains the code. Build paths from the
  module's directory: `path.join(import.meta.dirname, 'data.json')` in ESM,
  `path.join(__dirname, 'data.json')` in CommonJS.
- `node:path` joins and normalizes paths for the current OS (`path.join`,
  `path.resolve`, `path.extname`); do not concatenate with `/`.

### Checking That a File Exists

- Do not check and then act (`access()` then `readFile()`): the file can
  disappear in between (a **race condition**). Do the operation and handle
  `err.code === 'ENOENT'`.
- `fs.existsSync()` is fine for a quick synchronous check; the callback
  `fs.exists()` is deprecated.

### Things to Know

- File operations are not synchronized: two concurrent `writeFile` calls to the
  same file can corrupt it. To replace a file safely, write a temporary file and
  `rename` it over the old one.
- `writeFile` and `readFile` hold the whole content in memory. For large files
  or HTTP uploads and downloads, use streams and `pipeline`, see
  [Stream Module](./stream.md).
- The file system part of the browser (File System Access API, OPFS) is a
  different API with file handles and user permission prompts; it has nothing to
  do with `node:fs`.

## Example

```javascript
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(import.meta.dirname, 'data', 'settings.json');

async function loadSettings() {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    // highlight-next-line
    if (err.code === 'ENOENT') return {}; // no file yet: an expected case
    throw err; // anything else is a real error
  }
}

const settings = await loadSettings();
settings.runs = (settings.runs ?? 0) + 1;

await mkdir(path.dirname(file), { recursive: true });
await writeFile(file, JSON.stringify(settings, null, 2));
```

The same read in the three styles:

```javascript
import fs from 'node:fs';
import { readFile } from 'node:fs/promises';

const a = await readFile('notes.txt', 'utf8'); // promise

fs.readFile('notes.txt', 'utf8', (err, b) => {}); // callback

const c = fs.readFileSync('notes.txt', 'utf8'); // sync: blocks the event loop
```

## Follow-up Questions

- `path.join` or `path.resolve`? `join` joins the segments and normalizes the
  result, which can stay relative; `resolve` works like a series of `cd`
  commands: an absolute segment starts over, and `process.cwd()` is prepended if
  the result is still relative.
- Why not use `readFileSync` in a request handler? While it reads, the server
  cannot serve any other request.
- How do you read a 10 GB file? With a stream, line by line with
  `readline.createInterface({ input: fs.createReadStream(path) })`, or in
  chunks.
- Are async file operations truly non-blocking at the OS level? Not on most
  systems: they are blocking calls made in the libuv thread pool, so the main
  thread stays free. With many parallel file operations the pool (4 threads by
  default) becomes the bottleneck.

## Common Mistakes

- Looking for `fs.promises.readFileSync`: the promise API has no `Sync` methods.
- Using `fs.rmdir(path, { recursive: true })`: deprecated, use `fs.rm`.
- Reading paths relative to the current file with `'./data.json'`: it is
  relative to `process.cwd()`.
- Checking existence before reading instead of handling `ENOENT`.

## See Also

- [Stream Module](./stream.md)
- [Error Handling in Node.js](../errors.md)
- [Event Loop in Node.js](../event-loop.md)
