---
sidebar_position: 6
---

# Cluster Module

The cluster module is a core Node.js module that allows you to create child
processes (workers) that share the same server port. It is especially useful for
taking advantage of multi-core systems to handle a high number of requests more
efficiently.

:::info[Why Use the Cluster Module?]

Node.js is single-threaded, meaning it runs on a single core by default. This
can be a limitation when you want to scale your application to handle more
traffic. The `cluster` module helps you distribute the load across multiple
cores, making your application more efficient and scalable.

:::

The cluster module works with two kinds of processes:

1. Primary Process: This is the main process that spawns worker processes.
2. Worker Processes: These are the child processes that handle the actual
   workload.

## Creating the Clustered Server

Workers can share any TCP connection. Here is an example of how to create a
basic HTTP server.

```javascript
import cluster from 'cluster';
import { cpus } from 'os';
import http from 'http';

const numCPUs = cpus().length;

// Initialize Primary Process
const initPrimaryProcess = () => {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
};

// Initialize Worker Process
const initWorkerProcess = () => {
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello, world!\n');
  });

  server.listen(8000, () => {
    console.log(`Worker ${process.pid} started and listening on port 8000`);
  });
};

// Main function to start the cluster
const startCluster = () => {
  if (cluster.isPrimary) {
    initPrimaryProcess();
  } else {
    initWorkerProcess();
  }
};

// Start the cluster
startCluster();
```

1. Primary Process

   - The process checks `cluster.isPrimary` to determine whether it is the
     primary process.
   - It then forks (creates) a number of worker processes equal to the number of
     CPU cores.

2. Worker Processes

   - Each worker process runs the code inside the else block.
   - Each worker creates an HTTP server that listens on port 8000.

3. Inter-process Communication

   The primary and worker processes can communicate with each other using the
   cluster module's messaging API, though it's not shown in this basic example.
