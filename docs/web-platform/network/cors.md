---
sidebar_position: 2
description: Same-Origin Policy, what an origin is, preflight and credentials
tags: [junior, middle]
---

# CORS and the Same-Origin Policy

The **Same-Origin Policy** is a browser rule: a script cannot read the response
to a request made to another **origin**. An origin is **scheme + host + port**.
**CORS** (Cross-Origin Resource Sharing) does not forbid anything: it is the way
for a server to **relax** this rule with `Access-Control-*` response headers.
The check is done by the browser, so CORS protects the user, not the server.

## Details

### Origin

Compared with `https://example.com/page`:

| URL                        | Same origin? | Why                               |
| -------------------------- | ------------ | --------------------------------- |
| `https://example.com/api`  | yes          | the path is not part of an origin |
| `http://example.com`       | no           | scheme                            |
| `https://api.example.com`  | no           | host                              |
| `https://example.com:8080` | no           | port (the default is 443)         |

The policy limits **reading** from scripts. Embedding (`<img>`, `<script>`,
`<link>`), form submissions and navigation to another origin are allowed, which
is why [CSRF](../security/csrf.md) attacks are possible.

The policy also keeps windows and iframes of different origins out of each
other's DOM.

### Simple Requests and Preflight

- A **simple request** is sent right away with the `Origin` header. The browser
  gives the response to the script only if it has a matching
  `Access-Control-Allow-Origin`. The server has already processed the request by
  then. A request is simple when:
  - the method is `GET`, `HEAD` or `POST`;
  - there are no headers beyond the safelisted ones (`Accept`,
    `Accept-Language`, `Content-Language`, `Content-Type`);
  - `Content-Type` is `text/plain`, `multipart/form-data` or
    `application/x-www-form-urlencoded`.
- Any other request (`PUT`, `PATCH`, `DELETE`, a JSON body, an `Authorization`
  header) is **preflighted**: the browser first sends an `OPTIONS` request that
  asks whether the method and the headers are allowed. The actual request is
  sent only if the answer permits it.

### Response Headers

| Header                             | Meaning                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `Access-Control-Allow-Origin`      | the allowed origin, or `*` for any                                                          |
| `Access-Control-Allow-Methods`     | methods allowed for the actual request (preflight)                                          |
| `Access-Control-Allow-Headers`     | request headers allowed (preflight)                                                         |
| `Access-Control-Allow-Credentials` | `true` allows requests with cookies                                                         |
| `Access-Control-Max-Age`           | seconds to cache the preflight result; 5 by default, capped by browsers (2 hours in Chrome) |
| `Access-Control-Expose-Headers`    | response headers that the script is allowed to read                                         |

### Credentials

- A cross-origin `fetch` does not send cookies by default. They are sent with
  `credentials: 'include'`.
- The response must then have `Access-Control-Allow-Credentials: true` and the
  **exact origin** in `Access-Control-Allow-Origin`; `*` is not accepted.
- A server that copies the request origin into the response should also send
  `Vary: Origin`, so that caches do not mix up responses.
- For a cross-site request the cookie itself needs `SameSite=None; Secure`. See
  [Browser Storage](./storage.md#cookie-attributes).

### How to Fix a CORS Error

- Configure the **server** to send the headers. Nothing in the frontend code can
  grant the permission.
- If the server is not yours, send the request through a **proxy on your own
  origin** (a dev-server proxy, your backend). The policy exists only in
  browsers, so server-to-server requests are not limited.
- `mode: 'no-cors'` does not help: the response is opaque, the script cannot
  read its status or body.

## Example

A preflight for `DELETE` with an `Authorization` header, and the response that
allows it:

```http
OPTIONS /users/1 HTTP/1.1
Host: api.example.com
Origin: https://app.example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: authorization

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: authorization
Access-Control-Max-Age: 600
```

## Follow-up Questions

- Why is there no CORS error in Postman or `curl`? The policy is enforced only
  by browsers.
- Why is a preflight needed? Old servers were written when a page could send to
  another origin only what a form can send. The preflight makes sure that the
  server knows about CORS before it gets anything else.
- Are `https://example.com` and `https://api.example.com` the same? They are
  different origins, but the same **site**, which is what `SameSite` cookies
  look at, see [Browser Storage](./storage.md#cookie-attributes).
- How do a page and a cross-origin iframe talk?
  `postMessage(data, targetOrigin)` with an exact target origin, and a check of
  `event.origin` in the `message` handler.
- Do `<img>`, `<script>` and fonts need CORS? `<img>` and classic scripts embed
  without it; web fonts and module scripts are always fetched with CORS. A
  non-CORS image can be drawn on a `<canvas>` but taints it: `getImageData()`
  throws. The `crossorigin` attribute switches an element to a CORS request.

## Common Mistakes

- "CORS blocks cross-origin requests." The Same-Origin Policy blocks; CORS is
  how the server lifts the block.
- "An origin is a domain." It is scheme, host and port together.
- "The request did not reach the server." A simple request is processed by the
  server; the browser only hides the response.
- "`Access-Control-Allow-Origin: *` works for everything." Not for requests with
  credentials.
- Setting `Access-Control-Allow-Origin` as a request header in `fetch`: it is a
  response header, and the extra header only triggers a preflight.

## See Also

- [HTTP](./http.md)
- [Authentication and Authorization](./authentication.md)
- [CSRF](../security/csrf.md)
