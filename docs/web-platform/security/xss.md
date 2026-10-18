---
sidebar_position: 1
description:
  Stored, reflected and DOM-based XSS, escaping by context, sanitization, XSS in
  React, Trusted Types
tags: [middle]
---

# Cross-Site Scripting (XSS)

**XSS** is an injection of the attacker's script into a page of your site. The
script runs in **your origin**, with all the rights of the page: it reads the
DOM and `localStorage`, sends requests as the user, changes what the user sees.
Types: **stored** (in the database, shown to other users), **reflected** (the
server echoes part of the URL), **DOM-based** (client code puts untrusted data
into a sink such as `innerHTML`). The defense is to treat every external string
as text: **escape output** for its context, **sanitize** HTML that must be
rendered, and add **CSP** as the second layer.

## Details

### Where XSS Comes From

| Type      | Where the payload lives                     | Example                                                  |
| --------- | ------------------------------------------- | -------------------------------------------------------- |
| Stored    | the database                                | a comment with `<img src=x onerror=…>` shown to everyone |
| Reflected | the URL, returned by the server             | `/search?q=<script>…</script>` printed into the page     |
| DOM-based | the URL or a message, handled in the client | `el.innerHTML = location.hash.slice(1)`                  |

Dangerous sinks in the browser: `innerHTML` / `outerHTML`, `insertAdjacentHTML`,
`document.write`, `eval`, `new Function`, `setTimeout` with a string, `href` /
`src` with a `javascript:` URL, `on*` attributes.

### Defense

- **Escape output by context.** The same string needs different escaping inside
  HTML text, an attribute, a URL, inline JavaScript or CSS. Template engines and
  frameworks escape HTML text and attributes automatically; in plain DOM code
  use `textContent` and `setAttribute` instead of building HTML strings.
- **Sanitize** when HTML from users must be rendered (a rich-text editor,
  Markdown): pass it through **DOMPurify**, which removes scripts, event
  handlers and dangerous URLs. A hand-written regex filter is always bypassed.
- **Check URLs** that come from users: allow only `http:` and `https:` (and
  `mailto:` if needed), so that `javascript:alert(1)` is not accepted. See
  [URL and Encoding](../network/url.md#security).
- **CSP** with nonces blocks injected scripts even if one hole was missed. See
  [Content Security Policy](./csp.md).
- **Limit the damage**: an `HttpOnly` cookie cannot be read by the script. The
  script can still send requests as the user, so this is not a defense by
  itself. See [Browser Storage](../network/storage.md#cookie-attributes).
- **Trusted Types** (the CSP directive `require-trusted-types-for 'script'`)
  make the browser reject plain strings in `innerHTML` and other sinks: only
  values created by a reviewed policy are accepted. This finds DOM-based XSS in
  the whole codebase at once.

### XSS in React

React escapes every value rendered in JSX, as text and as attribute values, so
`<div>{comment}</div>` is safe. What is left:

- **`dangerouslySetInnerHTML`** inserts HTML as is. Sanitize the value first.
- **URLs** in `href` and `src`. React 19 blocks `javascript:` URLs; older
  versions only warn in development. Other schemes and open redirects still need
  a check.
- **Refs and direct DOM access**: `ref.current.innerHTML = …` bypasses React.
- **Server-rendered state** inside `<script>`: `JSON.stringify` does not escape
  `</script>`, so the data can close the tag. Use a serializer that escapes `<`
  (frameworks do this for their own data).
- Spreading user-controlled objects as props (`<a {...userProps}>`) can set
  `href` or `dangerouslySetInnerHTML`.

## Example

DOM-based XSS from a query parameter:

```javascript
// ?name=<img src=x onerror=alert(document.cookie)>
const name = new URLSearchParams(location.search).get('name');

// error-next-line
greeting.innerHTML = `Hello, ${name}!`; // the onerror handler runs
// correct-next-line
greeting.textContent = `Hello, ${name}!`; // the markup is shown as text
```

HTML from users in React:

```jsx
import DOMPurify from 'dompurify';

function Comment({ html }) {
  // error-next-line
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function SafeComment({ html }) {
  // correct-next-line
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

A URL from users:

```javascript
function safeUrl(value) {
  try {
    const url = new URL(value, location.origin);
    // highlight-start
    return ['http:', 'https:'].includes(url.protocol)
      ? url.href
      : 'about:blank';
    // highlight-end
  } catch {
    return 'about:blank'; // new URL() throws on 'http://'
  }
}

safeUrl('javascript:alert(1)'); // 'about:blank'
safeUrl('/profile'); // 'https://your-site.example/profile'
// Only the scheme is checked, not the host:
safeUrl('//evil.example'); // 'https://evil.example/'
```

## Follow-up Questions

- Why does `innerHTML = '<script>alert(1)</script>'` not show an alert? Scripts
  inserted with `innerHTML` are not executed, but event handlers are:
  `<img src=x onerror=…>` works.
- Does an `HttpOnly` cookie protect from XSS? It protects the cookie from being
  read. The injected script can still make requests with it, so the session is
  used without being stolen.
- What is the difference between escaping and sanitizing? Escaping turns markup
  into text (`<` → `&lt;`), so nothing is rendered as HTML. Sanitizing keeps the
  allowed markup and removes the dangerous parts (scripts, handlers,
  `javascript:` URLs). Escape by default; sanitize only when HTML must be
  rendered.
- Where do you look for XSS in a React code review? `dangerouslySetInnerHTML`,
  `href` and `src` built from user data, `ref.current.innerHTML`, user objects
  spread into props, server state serialized into `<script>`.
- Is escaping on input enough? No: the same data goes to different contexts
  (HTML, attributes, JSON, URLs), so it is escaped on output, where the context
  is known. Validation on input is an extra layer.
- How is XSS different from CSRF? XSS runs code inside your site; CSRF makes the
  user's browser send a request from another site. See [CSRF](./csrf.md).

## Common Mistakes

- "React makes XSS impossible." It escapes JSX values, but not
  `dangerouslySetInnerHTML`, refs, user-controlled props or URLs in older
  versions.
- "We strip `<script>` tags." Event handlers, `javascript:` URLs, SVG and many
  other vectors remain. Use a real sanitizer.
- "XSS is a server problem." DOM-based XSS happens entirely in the client.
- Relying on the `X-XSS-Protection` header: browsers removed the XSS filter it
  controlled, so it does nothing today.
- "CSP replaces escaping." It is the second layer for the holes that were
  missed, not the first one.

## See Also

- [Content Security Policy](./csp.md)
- [CSRF](./csrf.md)
- [Authentication and Authorization](../network/authentication.md)
