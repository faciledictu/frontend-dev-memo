---
sidebar_position: 1
---

# HTTP Module

The http module in Node.js is a built-in module that allows you to create HTTP
servers and make HTTP requests. It's essential for building web applications and
APIs since it provides the functionality needed to handle HTTP requests and
responses.

:::tip

HTTP Module is great for quick setups or learning purposes. However, for more
robust and feature-rich applications, especially APIs, developers often use
frameworks like Express.js built on top of the `http` module, which simplifies
many tasks.

:::

## Key Methods

`createServer(callback)`<br/>Creates an HTTP server.

`request.on('data', callback)`<br/>Listens for data chunks received in the
request.

`response.writeHead(statusCode, headers)`<br/>Sets the HTTP status code and
headers for the response.

`response.end([data], [encoding])`<br/>Ends the response process.

`request(options, callback)`<br/>Makes an HTTP request.

## Installation

```sh
npm install -g typescript
npm install @types/node
```

## Examples

### Creating a Server

To create a simple HTTP server, you can use the `createServer` method.

```typescript
import * as http from 'http';

// Create an HTTP server
const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    // Set the response HTTP header with HTTP status and Content type
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send the response body
    res.end('Hello, World!\n');
  }
);

// The server listens on port 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### Handling Different Routes

You can enhance the server to respond differently based on the URL requested.

```typescript
import * as http from 'http';

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    if (req.url === '/') {
      res.end('Home Page\n');
    } else if (req.url === '/about') {
      res.end('About Page\n');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found\n');
    }
  }
);

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### Making HTTP Requests in

You can also use the http module to make HTTP requests to other servers.

```typescript
import * as http from 'http';

// Options for the HTTP request
const options: http.RequestOptions = {
  hostname: 'www.example.com',
  port: 80,
  path: '/',
  method: 'GET',
};

const req = http.request(options, (res: http.IncomingMessage) => {
  let data = '';

  // A chunk of data has been received.
  res.on('data', (chunk: string) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', (e: Error) => {
  console.error(`Problem with request: ${e.message}`);
});

// End the request
req.end();
```
