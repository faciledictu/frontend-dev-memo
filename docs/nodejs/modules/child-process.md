---
sidebar_position: 5
description:
  exec, execFile, spawn and fork, buffered vs streamed output, shell injection,
  IPC with fork
---

# Child Process Module

`node:child_process` starts other programs as separate operating system
processes. **`exec`** runs a command in a **shell** and buffers the whole
output; **`execFile`** runs a file directly, without a shell; **`spawn`**
streams the output, which suits long-running processes and large output;
**`fork`** starts another Node.js script with an **IPC channel** for
`send()`/`'message'`. `exec`, `execFile` and `spawn` also have blocking `*Sync`
versions. A child process has its own memory and event loop, so a crash or a
CPU-heavy task in it does not affect the parent.

Applies to: Node.js 24 LTS.

## Details

### Methods

| Method                                  | Shell                                | Output                                | Use for                                        |
| --------------------------------------- | ------------------------------------ | ------------------------------------- | ---------------------------------------------- |
| `exec(command, cb)`                     | Yes                                  | Buffered, `maxBuffer` 1 MB by default | Short shell commands with pipes, `*`, `&&`     |
| `execFile(file, args, cb)`              | No                                   | Buffered                              | Running a program with arguments safely        |
| `spawn(command, args)`                  | No by default (`shell: true` option) | Streams `stdout`, `stderr`, `stdin`   | Long-running processes, large output           |
| `fork(modulePath, args)`                | No                                   | Inherited by default; IPC channel     | Another Node.js script that exchanges messages |
| `execSync`, `execFileSync`, `spawnSync` | As above                             | Returned value                        | CLI scripts; they block the event loop         |

- Promise versions: `util.promisify(exec)` and `util.promisify(execFile)`
  resolve to `{ stdout, stderr }`.
- `spawn` emits `'error'` if the program cannot be started (for example
  `ENOENT`), and `'exit'` / `'close'` with the exit code when it ends.
- A child process is a full process: a Node.js child (`fork`) takes tens of
  megabytes of memory and some time to start. For CPU-heavy JavaScript inside
  the same process, use
  [`worker_threads`](./cluster.md#cluster-vs-worker-threads).

### Shell Injection

`exec` passes the string to a shell, so user input inside it can run arbitrary
commands. Pass arguments as an array to `execFile` or `spawn`.

```javascript
import { exec, execFile } from 'node:child_process';

const name = 'photo.jpg; rm -rf ~'; // user input

// error-next-line
exec(`convert ${name} out.png`); // the shell runs `rm -rf ~`

// correct-next-line
execFile('convert', [name, 'out.png']); // the name is one argument
```

### Running TypeScript in `fork`

Node.js 24 can `fork('./worker.ts')` directly: type stripping removes types
before running. Only erasable syntax works (no `enum`, no parameter properties),
and types are not checked. Otherwise compile to JavaScript and fork the `.js`
file.

## Example

```javascript
// parent.mjs
import { fork } from 'node:child_process';

const child = fork('./child.mjs');

child.on('message', (result) => {
  console.log('Sum from child:', result);
  child.disconnect(); // close the IPC channel so both processes can exit
});

child.send({ numbers: [1, 2, 3, 4] });
```

```javascript
// child.mjs
process.on('message', ({ numbers }) => {
  const sum = numbers.reduce((a, b) => a + b, 0); // CPU work off the parent's thread
  process.send(sum);
});
```

Streaming output with `spawn`:

```javascript
import { spawn } from 'node:child_process';

const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => process.stdout.write(data));
ls.on('error', (err) => console.error('Failed to start:', err.message));
ls.on('close', (code) => console.log(`Exited with code ${code}`)); // also fires after 'error'
```

## Follow-up Questions

- `exec` or `spawn`? `exec` for a short command whose output fits in memory;
  `spawn` for long-running processes or large output, since it streams.
- How do a parent and a forked child communicate? Through the IPC channel:
  `child.send()` and `process.on('message')`; messages are serialized, not
  shared.
- How is `fork` different from `cluster`? `cluster` uses `fork` under the hood
  and adds sharing of a server port between workers.
- How do you stop a child process? `child.kill()` (sends `SIGTERM`), or pass an
  `AbortSignal` in the `signal` option.

## Common Mistakes

- Building an `exec` command string from user input.
- Using `exec` for a command with large output: it fails with
  `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` after 1 MB.
- No `'error'` listener on a spawned process: a missing program crashes the
  parent.
- Using `execSync` in a server request handler: it blocks the event loop.

## See Also

- [Cluster Module](./cluster.md)
- [Stream Module](./stream.md)
- [Events Module](./events.md)
