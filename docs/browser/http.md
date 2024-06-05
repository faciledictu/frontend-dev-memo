---
sidebar_position: 1
---

# HTTP Protocol

## Overview

HTTP stands for _HyperText Transfer Protocol_. It is the basic text protocol
used by the World Wide Web. HTTP allows web browsers to request resources, such
as HTML documents and other files, from web servers. The server then responds to
these requests, allowing users to view web pages. HTTP defines how messages are
formatted and transmitted, and how web servers and browsers should respond.

HTTP is stateless, meaning that each request from a client to a server is
treated as an independent transaction that is unrelated to any previous request.
This simplifies server design because it does not need to retain session
information.

### Status Codes

HTTP status codes are standardised responses given by web servers. Status codes
has 3 digits and they are divided into five groups according to the first one.

- **1xx** _Informational_. Request received, continuing process (e.g., 100
  Continue).
- **2xx** _Success_. The action was successfully received, understood, and
  accepted (e.g., 200 OK).
- **3xx** _Redirection_. Further action needs to be taken to complete the
  request (e.g., 301 Moved Permanently).
- **4xx** _Client Error_. The request contains bad syntax or cannot be fulfilled
  (e.g., 404 Not Found).
- **5xx** _Server Error_. The server failed to fulfill an apparently valid
  request (e.g., 500 Internal Server Error).

### HTTPS

A secure version of HTTP is HTTPS (S for Secure). HTTPS uses encryption to
transfer data between a client and a server, which helps protect against
eavesdropping and tampering.

### CRUD Methods

CRUD stands for Create, Read, Update, and Delete, which map to the following
HTTP methods.

:::info Idempotency

Idempotent methods are those that can be called many times without different
outcomes.

:::

`POST` _Create a new resource_. Submits data to a server (e.g., submitting a
form). **Not idempotent**. Multiple POST requests can result in multiple new
resources.

`GET` _Read or retrieve a resource_. Requests data from a server (e.g., fetching
a webpage). Idempotent.

`PUT` _Update an existing resource_. If the resource doesn't exist, it will be
created, otherwise it will be replaced. Idempotent. Multiple PUT requests with
the same data will produce the same result as a single request.

`PATCH` _Partially update an existing resource_. Only the specified fields are
updated. The rest of the resource remains unchanged. Generally idempotent.
Multiple PATCH requests with the same data will produce the same result as a
single request, but this can vary depending on the implementation.

`DELETE` _Delete a resource_. Removes data from a server. Idempotent.

### REST

REST (Representational State Transfer) is an architectural style for designing
networked applications. HTTP with its CRUD methods is often used as a protocol
for building RESTful applications. Beause HTTP protocol provides all the key
concepts of REST:

- Stateless Communication
- Client-Server Communication
- Cacheability
- Uniform Interface (methods)
- with universal methods

## AJAX

AJAX (Asynchronous JavaScript and XML) is a technique used to create fast and
dynamic web pages. It allows web applications to send and receive data
asynchronously from a server in the background without interfering with the
display and behavior of the existing page.

## Performing requests using JavaScript

Request can be sended using standard browser API or using an external library,
such as Axios.

When working with server responses, you typically get and parse the JSON data.

:::note

JSON (JavaScript Object Notation) is a data interchange format that's easy for
humans to read and write, and easy for machines to parse and generate. It's
often used to transmit data between a server and web application.

:::

### Basic Usage of `XMLHttpRequest` (XHR)

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    console.log(response);
  }
};
xhr.send();
```

### Basic Usage of `fetch()`

```javascript
fetch('https://api.example.com/data')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
```

To set headers in a request:

```javascript
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer your-token',
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => console.error('Error:', error));
```

## CORS

CORS (Cross-Origin Resource Sharing) is a security feature implemented by
browsers to prevent web pages from making requests to a different domain than
the one that served the web page. It is essential for protecting users and
servers from certain types of attacks.

To bypass CORS the server can to include the necessary CORS headers like
`Access-Control-Allow-Origin` to the response.

For development and testing purposes, it is possible to disable CORS in the
browser by running the browser in special mode or by using extensions.

The proxy server will make the request on your behalf and then forward the
response back to your client. This way, the request appears to be coming from
the same origin.
