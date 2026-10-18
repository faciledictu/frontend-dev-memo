---
sidebar_position: 1
description:
  Methods, status codes, caching, HTTP versions and requests with fetch
tags: [junior, middle]
---

# HTTP

**HTTP** (HyperText Transfer Protocol) is the application-layer protocol of the
web. The client sends a **request** (method, URL, headers, optional body) and
the server returns a **response** (status code, headers, optional body). HTTP is
**stateless**: every request is independent, so state between requests is
carried by cookies or tokens. **HTTPS** is HTTP over TLS: the connection is
encrypted and the server proves its identity with a certificate.

## Details

### Methods

| Method    | Typical use                                     | Safe | Idempotent |
| --------- | ----------------------------------------------- | ---- | ---------- |
| `GET`     | read a resource                                 | yes  | yes        |
| `HEAD`    | the same as `GET`, but without the body         | yes  | yes        |
| `OPTIONS` | ask what is allowed; CORS preflight             | yes  | yes        |
| `POST`    | create a resource, run an action                | no   | no         |
| `PUT`     | replace a resource, or create it at a known URL | no   | yes        |
| `PATCH`   | update a part of a resource                     | no   | no         |
| `DELETE`  | delete a resource                               | no   | yes        |

- **Safe**: the request does not change the state of the server.
- **Idempotent**: several identical requests leave the server in the same state
  as one request. The response may differ: the second `DELETE` can return `404`.
- `PATCH` is not guaranteed to be idempotent: "set the name to X" is, "append an
  item" is not.
- Idempotency matters for retries: an idempotent request can be repeated after a
  network failure, a `POST` can create a duplicate.

### Status Codes

| Group | Meaning       | Codes worth remembering                                                                                          |
| ----- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `1xx` | Informational | `101 Switching Protocols` (WebSocket)                                                                            |
| `2xx` | Success       | `200 OK`, `201 Created`, `204 No Content`                                                                        |
| `3xx` | Redirection   | `301 Moved Permanently`, `302 Found`, `304 Not Modified`, `307 Temporary Redirect`, `308 Permanent Redirect`     |
| `4xx` | Client error  | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `429 Too Many Requests` |
| `5xx` | Server error  | `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`                 |

- `401` means "not authenticated": no credentials or they are invalid. `403`
  means "authenticated, but not allowed".
- `301` and `302` allow the client to change `POST` to `GET`; `308` and `307`
  are their counterparts that keep the method.
- `304` has no body: the client uses its cached copy.

Headers worth naming: `Content-Type`, `Accept`, `Authorization`, `Cookie` /
`Set-Cookie`, `Location`, `Cache-Control`, `Content-Encoding`.

### Caching

- `Cache-Control` says who may store the response and for how long:
  - `max-age=3600`: the response is fresh for an hour and is used without a
    request;
  - `no-cache`: may be stored, but must be revalidated with the server before
    every use;
  - `no-store`: must not be stored at all;
  - `private`: only the browser may store it, not a CDN or a proxy.
- **Revalidation**: the server sends `ETag` (a version of the content) or
  `Last-Modified`. The client repeats the request with `If-None-Match` or
  `If-Modified-Since` and gets `304 Not Modified` if nothing has changed.
- A typical setup: files with a hash in the name get
  `Cache-Control: max-age=31536000, immutable`, the HTML page gets `no-cache`.

### HTTP Versions

| Version  | Transport     | What is different                                                                                          |
| -------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| HTTP/1.1 | TCP           | Text format. One request at a time per connection, so browsers open up to 6 connections per host           |
| HTTP/2   | TCP           | Binary frames. Many parallel streams over one connection (multiplexing), header compression                |
| HTTP/3   | QUIC over UDP | A lost packet delays only its own stream, not all of them. TLS 1.3 is built in, connection setup is faster |

Methods, status codes and headers are the same in all versions; only the way
they are transferred changes.

### REST

REST is an architectural style, not a protocol: resources are identified by
URLs, the interface is uniform (HTTP methods and status codes), the server keeps
no client state between requests, and responses say whether they can be cached.
CRUD maps to methods as `POST` (create), `GET` (read), `PUT` / `PATCH` (update)
and `DELETE`. How it compares with GraphQL and RPC:
[REST vs GraphQL](./rest-vs-graphql.md).

### Requests from JavaScript

- **`fetch`** is the standard promise-based API.
  - The promise is rejected only when there is no response at all: a network
    failure, a [CORS](./cors.md) error or an abort; with `404` and `500` the
    promise is fulfilled, so `response.ok` must be checked.
  - `AbortController` cancels a request; `AbortSignal.timeout(ms)` sets a
    timeout.
  - Cookies are sent to the same origin only, unless `credentials: 'include'` is
    set.
- **`XMLHttpRequest`** is the older callback-based API. It is still needed for
  upload progress, which `fetch` does not report.
- **AJAX** is the general name for requesting data from JavaScript without
  reloading the page.

## Example

```javascript
async function getJson(url, { timeout = 5000 } = {}) {
  // highlight-next-line
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(timeout),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

try {
  const user = await getJson('https://api.example.com/users/1');
  console.log(user);
} catch (error) {
  // 'TimeoutError' on timeout, TypeError on a network failure,
  // Error('HTTP 404') on an error status
  console.error(error.name, error.message);
}
```

## Follow-up Questions

- What is the difference between `PUT` and `PATCH`? `PUT` replaces the whole
  resource and is idempotent; `PATCH` changes a part of it and may not be.
- What is the difference between `no-cache` and `no-store`? `no-cache` stores
  the response but revalidates it every time; `no-store` does not store it.
- How does the server recognize a user if HTTP is stateless? By a cookie or a
  token sent with every request. See [Authentication](./authentication.md).
- What happens between entering a URL and seeing the page? See
  [How the Browser Works](../browser/browser-workflow.md).
- What happened to HTTP/2 Server Push? Browsers removed it; `103 Early Hints`
  and `<link rel="preload">` replaced it.
- `fetch` or axios? axios rejects on non-2xx statuses, parses JSON and has
  interceptors; `fetch` is built in and supports streams, but `response.ok` and
  the timeout are checked by hand.
- How do you make a `POST` safe to retry? An `Idempotency-Key` header: the
  server stores the result per key and returns it again for a repeated request.
- What is `stale-while-revalidate`? After `max-age` runs out, the cache serves
  the stale copy during the `stale-while-revalidate` window and revalidates it
  in the background: `max-age=60, stale-while-revalidate=600`.

## Common Mistakes

- "`PATCH` is idempotent." Not by the specification; it depends on the
  operation.
- "HTTP is a text protocol." Only HTTP/1.x; HTTP/2 and HTTP/3 are binary.
- "`fetch` throws on `404`." It does not; check `response.ok`.
- "`no-cache` forbids caching." That is `no-store`.
- "No `Cache-Control` means no caching." Without `Cache-Control` or `Expires`, a
  response with `Last-Modified` is cached heuristically. Set `Cache-Control`
  explicitly: `no-cache` to revalidate, `no-store` to forbid storing.

## See Also

- [CORS and the Same-Origin Policy](./cors.md)
- [Browser Storage](./storage.md)
- [Real-Time Updates](./realtime.md)
- [REST vs GraphQL](./rest-vs-graphql.md)
