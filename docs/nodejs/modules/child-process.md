---
sidebar_position: 5
---

# Child Process Module

The `child_process` module allows you to spawn new processes and communicate
with them. It provides four different methods for creating child processes:

## Methods for Creating Child Processes

1. `exec` method is useful for running shell commands.

   This method runs a command in a shell and buffers the output. It's suitable
   for short-lived processes where you need the entire output once the process
   completes.

   ```typescript
   import { exec } from 'child_process';

   exec('ls -la', (error, stdout, stderr) => {
     if (error) {
       console.error(`exec error: ${error}`);
       return;
     }
     console.log(`stdout: ${stdout}`);
     console.error(`stderr: ${stderr}`);
   });
   ```

2. `execFile` method is used to run a file directly.

   This method is similar to `exec()`, but it directly executes a file without
   using a shell, making it slightly more efficient and secure.

   ```typescript
   import { execFile } from 'child_process';

   execFile('node', ['--version'], (error, stdout, stderr) => {
     if (error) {
       console.error(`execFile error: ${error}`);
       return;
     }
     console.log(`stdout: ${stdout}`);
     console.error(`stderr: ${stderr}`);
   });
   ```

3. `spawn` method

   This method launches a new process with a given command. It is suitable for
   long-running processes where you need to handle the process's I/O streams
   (stdout, stderr, stdin) in a non-blocking way.

   ```typescript
   import { spawn } from 'child_process';

   const ls = spawn('ls', ['-la']);

   ls.stdout.on('data', (data) => {
     console.log(`stdout: ${data}`);
   });

   ls.stderr.on('data', (data) => {
     console.error(`stderr: ${data}`);
   });

   ls.on('close', (code) => {
     console.log(`child process exited with code ${code}`);
   });
   ```

4. `fork` method

   This method is designed for spawning new Node.js processes. It has built-in
   communication channels (IPC) for sending messages between the parent and
   child processes.

   ```typescript
   import { fork } from 'child_process';

   const child = fork('./child.ts');

   child.on('message', (message) => {
     console.log(`Message from child: ${message}`);
   });

   child.send('Hello from parent process');
   ```
