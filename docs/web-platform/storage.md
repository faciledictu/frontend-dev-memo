---
sidebar_position: 6
description:
  Cookies vs localStorage vs sessionStorage, cookie attributes and security
---

# Browser Storage

|                | Cookies                                 | `localStorage`         | `sessionStorage`        |
| -------------- | --------------------------------------- | ---------------------- | ----------------------- |
| Size           | about 4 KB per cookie                   | about 5 MB per origin  | about 5 MB per origin   |
| Lifetime       | `Expires` / `Max-Age`, or the session   | until it is cleared    | until the tab is closed |
| Sent to server | **yes**, with every matching request    | no                     | no                      |
| Visible to     | domain and path; can include subdomains | all tabs of the origin | one tab                 |
| Access from JS | `document.cookie`, unless `HttpOnly`    | yes                    | yes                     |

**Cookies** are for what the server needs with every request, such as a session
ID. **Web Storage** is for data that only the client uses: UI settings, drafts.
For large or structured data there is **IndexedDB**, an asynchronous database in
the browser.

## Details

### Cookie Attributes

A cookie is set by the server with the `Set-Cookie` header or by a script.

| Attribute             | Meaning                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `Expires` / `Max-Age` | lifetime as a date or in seconds. Without them it is a session cookie                          |
| `Domain`              | not set: only the host that set the cookie. Set: this domain and its subdomains                |
| `Path`                | the URL path prefix the cookie is sent for                                                     |
| `Secure`              | sent only over HTTPS                                                                           |
| `HttpOnly`            | hidden from JavaScript, so a script injected by XSS cannot read it. Only the server can set it |
| `SameSite`            | whether the cookie is sent with cross-site requests; a defense against CSRF                    |

`SameSite` values:

- `Strict`: only requests from the same site.
- `Lax`: the same, plus top-level navigation from another site with a safe
  method (`GET`), such as a click on a link. A cross-site `POST` form does not
  get the cookie. Chromium browsers use it when the attribute is missing.
- `None`: all requests, including those from other sites. Requires `Secure`.

A **site** is broader than an origin: it is the scheme and the registrable
domain. `app.example.com` and `api.example.com` are different origins but the
same site.

**Third-party cookies** belong to a domain other than the one in the address
bar, for example cookies of an embedded widget or an ad network. They need
`SameSite=None; Secure`. Safari blocks them and Firefox isolates them per site
by default. Chrome dropped its plan to remove them and still allows them, except
in Incognito.

### Web Storage

- The API is the same for both: `setItem(key, value)`, `getItem(key)`,
  `removeItem(key)`, `clear()`.
- Keys and values are **strings**; objects go through `JSON.stringify` and
  `JSON.parse`.
- The API is **synchronous** and blocks the main thread, so it is not for large
  data.
- `sessionStorage` survives a reload of the tab, but a tab opened separately
  gets its own empty storage. A tab opened from the page or duplicated starts
  with a copy.
- When `localStorage` changes, the `storage` event fires in the **other** tabs
  of the same origin. This is a simple way to sync tabs.
- Any script on the page can read it, including one injected by XSS.

### Cookies in JavaScript

- Reading `document.cookie` returns all visible cookies as one string:
  `name=value; other=value`.
- Assigning to it sets or updates **one** cookie and does not touch the others.
- To delete a cookie, set it again with `max-age=0` and the same `path` and
  `domain`.
- Names and values should be encoded with `encodeURIComponent`.

## Example

A cookie set by the server for a session:

```http
Set-Cookie: sessionId=abc123; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=Lax
```

Cookies in a script:

```javascript
function setCookie(name, value, maxAge) {
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}` +
    `; max-age=${maxAge}; path=/; samesite=lax`;
}

function getCookie(name) {
  const prefix = `${encodeURIComponent(name)}=`;
  const pair = document.cookie
    .split('; ')
    .find((item) => item.startsWith(prefix));

  return pair ? decodeURIComponent(pair.slice(prefix.length)) : null;
}

setCookie('theme', 'dark', 3600); // for one hour
getCookie('theme'); // 'dark'
setCookie('theme', '', 0); // delete
getCookie('theme'); // null
```

Web Storage:

```javascript
localStorage.setItem('settings', JSON.stringify({ theme: 'dark' }));

const settings = JSON.parse(localStorage.getItem('settings') ?? '{}');
console.log(settings.theme); // 'dark'

// Fires in other tabs of the same origin
window.addEventListener('storage', (event) => {
  console.log(event.key, event.oldValue, event.newValue);
});
```

## Follow-up Questions

- Where should an auth token be stored? An `HttpOnly` cookie cannot be read by
  an injected script (which can still send requests as the user), but is sent
  automatically, so it needs CSRF protection (`SameSite`). `localStorage` has no
  CSRF problem, but any script can read it. See
  [Authentication](./authentication.md).
- What do `HttpOnly` and `SameSite` each protect against? `HttpOnly`: theft of
  the cookie by a script. `SameSite`: requests forged from another site.
- Are cookies sent with a cross-origin `fetch`? Only with
  `credentials: 'include'`, and a cross-site request also needs
  `SameSite=None; Secure` on the cookie. Whether the script can read the
  response is decided by the [CORS](./cors.md#credentials) headers.

## Common Mistakes

- "`HttpOnly` means the cookie works only over HTTP." It means no access from
  JavaScript; HTTPS-only is `Secure`.
- "`localStorage` is sent to the server." Only cookies are.
- "`sessionStorage` is shared between tabs." Every tab has its own.
- Storing an object without `JSON.stringify`: the value becomes
  `'[object Object]'`.

## See Also

- [HTTP](./http.md)
- [CORS and the Same-Origin Policy](./cors.md)
