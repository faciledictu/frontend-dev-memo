---
sidebar_position: 3
description:
  Content-Security-Policy header, directives and source values, strict CSP with
  nonces and strict-dynamic, Report-Only, frame-ancestors
tags: [middle, senior]
---

# Content Security Policy (CSP)

**CSP** is a response header, `Content-Security-Policy`, that tells the browser
where the page may load scripts, styles, images, frames and connections from.
Once `script-src` is set, **inline scripts**, `on*` attributes and `eval` are
blocked unless the policy allows them. That makes CSP the **second layer of
defense against XSS**: an injected script does not run even if escaping was
missed somewhere. The recommended form is a **strict CSP**: scripts are allowed
by a random **nonce** or a **hash**, not by a list of hosts, and it is rolled
out with **Report-Only** first. `frame-ancestors` also protects against
clickjacking.

## Details

### Directives

| Directive                   | Controls                                                                 |
| --------------------------- | ------------------------------------------------------------------------ |
| `default-src`               | the fallback for the `*-src` directives that are not set                 |
| `script-src`                | scripts: `<script>`, inline code, `eval`, event handler attributes       |
| `style-src`                 | stylesheets and inline styles                                            |
| `img-src`, `font-src`       | images and fonts                                                         |
| `connect-src`               | `fetch`, XHR, WebSocket, `EventSource`                                   |
| `frame-src`                 | what the page may embed in `<iframe>`                                    |
| `frame-ancestors`           | who may embed **this** page; `'none'` or `'self'` against clickjacking   |
| `object-src`                | `<object>` and `<embed>`; set to `'none'`                                |
| `base-uri`                  | `<base href>`, which could redirect relative script URLs; `'none'`       |
| `form-action`               | where forms may be submitted                                             |
| `upgrade-insecure-requests` | loads `http://` resources over HTTPS                                     |
| `require-trusted-types-for` | `'script'` turns on [Trusted Types](./xss.md#defense) for DOM sinks      |
| `report-to`                 | where to send violation reports (an endpoint from `Reporting-Endpoints`) |

### Source Values

| Value                               | Allows                                                                                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `'self'`                            | the page's own origin                                                                                                                          |
| `'none'`                            | nothing                                                                                                                                        |
| `https://cdn.example.com`, `https:` | a host or a whole scheme                                                                                                                       |
| `'nonce-<random>'`                  | elements with the matching `nonce` attribute                                                                                                   |
| `'sha256-<hash>'`                   | an inline script or style with exactly this content                                                                                            |
| `'strict-dynamic'`                  | scripts that a trusted script creates (`createElement`, not `document.write`); hosts, schemes, `'self'` and `'unsafe-inline'` are then ignored |
| `'unsafe-inline'`                   | any inline code; it disables the protection against XSS. Ignored when a nonce or a hash is present                                             |
| `'unsafe-eval'`                     | `eval`, `new Function`, `setTimeout` with a string                                                                                             |

### Strict CSP vs Allowlist

- An **allowlist** (`script-src 'self' https://cdn.example.com`) is easy to
  bypass: a CDN or an API on the list usually hosts something an attacker can
  use (JSONP endpoints, old libraries).
- A **strict CSP** trusts a **nonce**: a random value generated anew for every
  response and put both into the header and into each `<script nonce>`. An
  injected script cannot know it.
- **`'strict-dynamic'`** lets nonce scripts load other scripts (bundler chunks,
  tag managers) without listing them.
- A **hash** fits static pages that cannot generate a nonce per response.
- Inline handlers (`onclick="…"`) are blocked even with a nonce: move them to
  `addEventListener`.

### Deployment

- Start with **`Content-Security-Policy-Report-Only`**: violations are reported
  but nothing is blocked. Fix them, then switch to the enforcing header.
- Both headers can be sent at once: an enforced policy and a stricter one being
  tested.
- A `<meta http-equiv="Content-Security-Policy">` tag works too, but without
  `frame-ancestors`, `sandbox` and `report-uri`, and it applies only to what
  comes after it. Report-Only cannot be set with `<meta>`.
- If several policies are present, a resource must pass **all** of them: an
  extra policy can only tighten the rules.

## Example

A strict policy:

```http
Content-Security-Policy: script-src 'nonce-r4nd0m' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'
```

What happens on the page:

```html
<!-- correct-next-line -->
<script nonce="r4nd0m" src="/app.js"></script>

<!-- error-start -->
<!-- Refused to execute inline script because it violates the following
     Content Security Policy directive: "script-src 'nonce-r4nd0m' 'strict-dynamic'" -->
<script>
  alert('injected');
</script>
<!-- Refused to execute inline event handler because it violates the following
     Content Security Policy directive: "script-src 'nonce-r4nd0m' 'strict-dynamic'" -->
<img src="x" onerror="alert('injected')" />
<!-- error-end -->
```

A new nonce for every response, in Express:

```javascript
import crypto from 'node:crypto';

app.use((req, res, next) => {
  // highlight-next-line
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'nonce-${res.locals.nonce}' 'strict-dynamic'; ` +
      `object-src 'none'; base-uri 'none'`
  );
  next();
});
// The template renders <script nonce="<%= nonce %>">
```

## Follow-up Questions

- Why not just `script-src 'self'`? It allows any script served from your
  origin, including user uploads and JSONP endpoints, and an injected
  `<script src>` can point at them.
- Why must the nonce change on every response? A fixed nonce can be read from
  any page and copied into the injected script.
- How do you protect against clickjacking? `frame-ancestors 'none'` (or
  `'self'`). It replaces the older `X-Frame-Options: DENY`.
- Why does a React, Vite or Next.js app break under a strict CSP? Bundlers and
  CSS-in-JS libraries inject inline `<script>` and `<style>` tags. Pass the
  nonce to the framework (Next.js and Vite support it) and allow it in
  `style-src` too, or accept `'unsafe-inline'` for styles only.
- How do you find out what CSP blocked? The console message names the directive;
  Report-Only with `report-to` collects violations from users; the page can
  listen to the `securitypolicyviolation` event.
- Does CSP replace escaping and sanitization? No, it is the second layer. See
  [XSS](./xss.md).

## Common Mistakes

- `'unsafe-inline'` in `script-src` "to make it work": it turns off the main
  protection.
- An allowlist with large CDNs or `https:`: easy to bypass.
- Turning on the enforcing header without a Report-Only period: it breaks the
  site for users.
- Forgetting `object-src 'none'` and `base-uri 'none'` in a strict policy.

## See Also

- [XSS](./xss.md)
- [CSRF](./csrf.md)
- [HTTP](../network/http.md)
