---
sidebar_position: 2
description:
  How CSRF works, why CORS does not stop it, SameSite cookies, CSRF tokens,
  Origin and Fetch Metadata checks
tags: [middle, senior]
---

# Cross-Site Request Forgery (CSRF)

**CSRF** is an attack where another site makes the user's browser send a request
to your site. The browser attaches **cookies automatically**, so the server sees
an authenticated request and performs the action: a transfer, a password change,
a post. The attacker cannot read the response (the Same-Origin Policy hides it),
but the **side effect** has already happened. Only credentials the browser
attaches by itself are affected (cookies, Basic auth), not a token your code
puts into the `Authorization` header. Defenses: **`SameSite` cookies**, a **CSRF
token**, checking the **`Origin`** or **`Sec-Fetch-Site`** header, and never
changing state with `GET`.

## Details

### What the Attacker Can Send

- A **form** with `method="POST"`, submitted by a script: any URL-encoded,
  multipart or `text/plain` body.
- A **`GET`** through `<img src>`, a link or a redirect.
- A **`fetch`** with `credentials: 'include'` that is a simple request (see
  [CORS](../network/cors.md#simple-requests-and-preflight)). It is sent without
  a preflight; the browser only hides the response.

What a cross-site page **cannot** do: set custom headers or a JSON
`Content-Type` without a preflight, which your server rejects.

### Defenses

| Defense                     | How it works                                                                                                            | Limits                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `SameSite=Lax` / `Strict`   | the browser does not send the cookie with cross-site requests (`Lax` still sends it on top-level `GET` navigation)      | a **site** is broader than an origin: a compromised subdomain is same-site |
| CSRF token                  | the server puts a random token into the page and checks it in every state-changing request; another site cannot read it | must be added to every form and request                                    |
| `Origin` / `Sec-Fetch-Site` | the server rejects state-changing requests whose `Origin` is foreign or whose `Sec-Fetch-Site` is `cross-site`          | decide what to do when the headers are missing                             |
| Custom header or JSON only  | a cross-origin request with such a header or `Content-Type` needs a preflight, and the server does not allow it         | relies on a correct CORS setup; check the `Content-Type` exactly           |

- **`SameSite`.** Set it explicitly. Chromium treats a cookie without the
  attribute as `Lax`, but still sends it with a top-level cross-site `POST`
  during the first 2 minutes after it was set; Firefox and Safari do not apply
  `Lax` by default at all. See
  [Browser Storage](../network/storage.md#cookie-attributes).
- **CSRF token.** The classic variant stores it in the session (synchronizer
  token). The stateless variant, **double submit**, puts it into a cookie and
  into the request, and the server compares the two; the cookie must be signed
  or tied to the session, otherwise a subdomain can overwrite it. Frameworks
  have it built in (Rails, Django, Laravel).
- **`Sec-Fetch-Site`** is one of the **Fetch Metadata** headers, sent by all
  modern browsers, only over HTTPS (and to `localhost`): `same-origin`,
  `same-site`, `cross-site`, or `none` for a request the user started (typing
  the URL, a bookmark). It cannot be set from a script.
- **Safe methods.** `GET`, `HEAD` and `OPTIONS` must not change anything:
  `SameSite=Lax` still sends cookies with a top-level `GET` navigation (a link,
  a redirect), and an `<img>` sends a `GET` with cookies that have no `SameSite`
  restriction.

## Example

A page on another site that changes data on `bank.example` as soon as it is
opened:

```html title="https://evil.example/index.html"
<form action="https://bank.example/transfer" method="POST">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="1000" />
</form>
<script>
  document.forms[0].submit();
</script>
```

The server-side check of the request source, as Express middleware:

```javascript
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
const ORIGIN = 'https://bank.example';

function csrfGuard(req, res, next) {
  if (SAFE_METHODS.includes(req.method)) return next();

  const site = req.get('Sec-Fetch-Site');
  // highlight-start
  const allowed = site
    ? site === 'same-origin' || site === 'none'
    : req.get('Origin') === ORIGIN; // older browsers
  // highlight-end

  if (!allowed) return res.status(403).send('Cross-site request blocked');
  next();
}
```

The client side of a CSRF token: the server renders it into the page, the script
sends it in a header, and the server compares it with the session:

```javascript
const token = document.querySelector('meta[name="csrf-token"]').content;

await fetch('/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // highlight-next-line
    'X-CSRF-Token': token,
  },
  body: JSON.stringify({ to: 'alice', amount: 100 }),
});
```

## Follow-up Questions

- Is an API with a JWT in the `Authorization` header vulnerable to CSRF? No: the
  browser does not add the header by itself. It is vulnerable to XSS instead.
  See
  [Authentication](../network/authentication.md#where-to-keep-the-token-in-the-browser).
- Is `SameSite=Lax` enough? For most sites it covers cross-site attacks, but not
  same-site ones (a vulnerable subdomain), not state-changing `GET` requests,
  and not browsers that ignore it. Banks and admin panels add a token or an
  `Origin` check.
- What is login CSRF? The attacker logs the victim into the attacker's account,
  and the victim then enters their data into it. Login forms need protection
  too.
- How does an SPA send the token, and why is that cookie not `HttpOnly`? The
  script reads the token from a cookie, a `<meta>` tag or an endpoint and puts
  it into a header (`X-CSRF-Token`) of every state-changing request. The cookie
  must be readable by your script; another site still cannot read it (the
  Same-Origin Policy) or set the header without a preflight.
- Does a WebSocket have the same problem? Yes, it is called **cross-site
  WebSocket hijacking**: the handshake sends cookies and is not limited by CORS,
  so the server must check the `Origin` header. See
  [Real-Time Updates](../network/realtime.md).

## Common Mistakes

- "CORS protects against CSRF." CORS controls who can **read** a response, not
  who can **send** a request: a form or a simple `fetch` is still processed. See
  [CORS](../network/cors.md).
- "We use `POST`, so we are safe." A form on another site sends `POST` too.
- "A CSRF token in a cookie is enough." The browser sends the cookie
  automatically; the token must also be in the request body or a header, where
  another site cannot put it.
- Confusing it with XSS: CSRF does not run code in your site. See
  [XSS](./xss.md).

## See Also

- [XSS](./xss.md)
- [Browser Storage](../network/storage.md)
- [CORS and the Same-Origin Policy](../network/cors.md)
