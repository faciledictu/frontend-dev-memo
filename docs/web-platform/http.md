---
sidebar_position: 1
---

# HTTP Protocol

## Overview

HTTP stands for _HyperText Transfer Protocol_. It is the application-layer
protocol used by the World Wide Web. HTTP allows web browsers to request
resources, such as HTML documents and other files, from web servers. The server
then responds to these requests, allowing users to view web pages. HTTP defines
how messages are formatted and transmitted, and how web servers and browsers
should respond.

HTTP is stateless, meaning that each request from a client to a server is
treated as an independent transaction that is unrelated to any previous request.
This simplifies server design because it does not need to retain session
information.

### Status Codes

HTTP status codes are standardized responses given by web servers. Status codes
have 3 digits and are divided into five groups according to the first digit.

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

:::info[Idempotency]

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
updated. The rest of the resource remains unchanged. **Not guaranteed to be
idempotent**: it depends on the operation. Setting a field to a given value
gives the same result when repeated, while an operation like "append an item"
does not.

`DELETE` _Delete a resource_. Removes data from a server. Idempotent.

### REST

REST (Representational State Transfer) is an architectural style for designing
networked applications. HTTP with its CRUD methods is often used as a protocol
for building RESTful applications, because HTTP provides all the key concepts of
REST:

- Stateless Communication
- Client-Server Communication
- Cacheability
- Uniform Interface (universal methods)

## AJAX

AJAX (Asynchronous JavaScript and XML) is a technique used to create fast and
dynamic web pages. It allows web applications to send and receive data
asynchronously from a server in the background without interfering with the
display and behavior of the existing page.

## Performing Requests Using JavaScript

Requests can be sent using the standard browser API or using an external
library, such as Axios.

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
    'Authorization': 'Bearer your-token',
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => console.error('Error:', error));
```

## CORS

By default, browsers enforce the **Same-Origin Policy**: a script can't read the
response to a request made to a different origin. An origin is the combination
of scheme, host and port, so `https://example.com` and `https://api.example.com`
are different origins. The policy protects users from malicious pages reading
their data on other sites.

CORS (Cross-Origin Resource Sharing) is a mechanism that lets a server relax
this policy. The server tells the browser which origins are allowed to read its
responses using the `Access-Control-Allow-Origin` header (and other
`Access-Control-*` headers).

For requests that are not "simple" (e.g., with a JSON body or custom headers),
the browser first sends a _preflight_ `OPTIONS` request to check that the actual
request is allowed.

If you don't control the server, you can use a proxy server on the same origin
as the page. The proxy makes the request on your behalf and forwards the
response back to your client. This way, for the browser the request goes to the
same origin.

For development and testing purposes, it is also possible to disable these
checks by running the browser in a special mode or by using extensions.
