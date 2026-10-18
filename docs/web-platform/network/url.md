---
sidebar_position: 2
description:
  Parts of a URL, new URL and URLSearchParams, percent-encoding, encodeURI vs
  encodeURIComponent
tags: [junior, middle]
---

# URL and Encoding

- A URL consists of a **scheme**, a **host** with an optional port, a **path**,
  a **query** (`?…`) and a **fragment** (`#…`). The fragment is **not sent** to
  the server.
- Characters that are not allowed or have a special meaning (`&`, `=`, `#`, `?`,
  spaces, non-ASCII) are **percent-encoded**: each UTF-8 byte becomes `%XX`.
  `encodeURIComponent` encodes **one part** of a URL; `encodeURI` a whole URL,
  so it leaves `&`, `=`, `?`, `/` and `#` as they are.
- Build and parse URLs with **`new URL(path, base)`** and **`URLSearchParams`**,
  not string concatenation.

## Details

### Parts of a URL

For `https://user:pw@example.com:8080/a/b?q=1#top`:

| Property   | Value                      | Notes                                                 |
| ---------- | -------------------------- | ----------------------------------------------------- |
| `protocol` | `https:`                   | With the colon                                        |
| `username` | `user`                     | Credentials in URLs are deprecated                    |
| `host`     | `example.com:8080`         | `hostname` + `port`                                   |
| `hostname` | `example.com`              |                                                       |
| `port`     | `8080`                     | Empty string for the default port (`443` for `https`) |
| `pathname` | `/a/b`                     |                                                       |
| `search`   | `?q=1`                     | `searchParams` is a live `URLSearchParams` of it      |
| `hash`     | `#top`                     | Stays in the browser                                  |
| `origin`   | `https://example.com:8080` | Scheme + host + port; read-only                       |

The origin is what the Same-Origin Policy compares. See
[CORS and the Same-Origin Policy](./cors.md).

### new URL and URLSearchParams

- `new URL(input, base)` resolves a relative URL against a base, as the browser
  does for links: `new URL('../img/a.png', 'https://ex.com/a/b/page.html')` →
  `https://ex.com/a/img/a.png`. It also normalizes: lowercases the scheme and
  host, drops the default port, resolves `.` and `..`.
- It **throws `TypeError: Invalid URL`** for invalid input, for example a
  relative URL without a base. `URL.canParse(input, base)` returns a boolean;
  `URL.parse(input, base)` returns the `URL` or `null` instead of throwing.
- The properties are writable: `url.pathname = …`, `url.hash = …`; `url.href`
  gives the result.
- `URLSearchParams` reads and builds the query: `get`, `getAll` (repeated keys),
  `set`, `append`, `delete`, `has`, `sort`, iteration. It accepts a string, an
  object or an array of pairs, and is accepted by `fetch` as a form body.
- **`URLPattern`** matches URLs against patterns like `/users/:id` and returns
  the parameters: a built-in alternative to route-matching libraries.

### Encoding Functions

| Function             | Leaves as is                           | Space | Use for                                    |
| -------------------- | -------------------------------------- | ----- | ------------------------------------------ |
| `encodeURIComponent` | Letters, digits, `- _ . ! ~ * ' ( )`   | `%20` | One value: a path segment, a param         |
| `encodeURI`          | The above plus `; , / ? : @ & = + $ #` | `%20` | A whole URL with spaces or non-ASCII chars |
| `URLSearchParams`    | Letters, digits, `* - . _`             | `+`   | Query strings and form bodies              |

- In a query string, `+` means a space for `URLSearchParams` and form parsers,
  but not for `decodeURIComponent`, which leaves `+` as it is.
- `decodeURIComponent` throws **`URIError: URI malformed`** for an invalid
  sequence such as `%E0%A4%A`; wrap user input in `try`.
- **Double encoding**: encoding an already encoded value turns `%20` into
  `%2520`. Encode once, at the place where the URL is built.
- `escape` / `unescape` are deprecated: they do not use UTF-8 (`€` → `%u20AC`).
- Internationalized domain names are converted to **punycode**:
  `new URL('https://пример.рф').host` is `xn--e1afmkfd.xn--p1ai`.
- Cookie values are encoded with the same `encodeURIComponent`. See
  [Browser Storage](./storage.md).

### Security

- Validate the **protocol** of a user-supplied URL before putting it into `href`
  or `src`: `javascript:` URLs run code. See
  [Cross-Site Scripting (XSS)](../security/xss.md).
- Check the **origin** of a redirect target (`?next=…`), not a prefix of the
  string: `https://example.com.evil.com` starts with `https://example.com`.

Support: `URL`, `URLSearchParams` and `URL.canParse()` are Baseline;
`URL.parse()` and `URLPattern` became Baseline in 2024 and 2025.

## Example

A query built by concatenation breaks on `&`:

```javascript
const query = 'Tom & Jerry';

// error-next-line
const bad = `/search?q=${query}&page=2`; // q is 'Tom ', and ' Jerry' becomes a key
new URLSearchParams(bad.split('?')[1]).get('q'); // 'Tom '

// correct-start
const url = new URL('/search', 'https://example.com');
url.searchParams.set('q', query);
url.searchParams.set('page', 2);
// correct-end
url.href; // 'https://example.com/search?q=Tom+%26+Jerry&page=2'
url.searchParams.get('q'); // 'Tom & Jerry'
```

## Follow-up Questions

- Why is the hash not sent to the server? It addresses a place inside the
  document, so the browser handles it; that is why hash routing needs no server
  configuration. See [History API](../browser/history-api.md).
- How do you pass an array in a query string? There is no standard: repeated
  keys `?id=1&id=2` (built with `append`, read with `getAll`), or `id[]=` or
  comma-separated values, as the server expects.
- What does `new URL('api', 'https://ex.com/a/b')` return?
  `https://ex.com/a/api`: without a trailing slash, `b` is a file and is
  replaced.
- How do you read the current page's parameters?
  `new URL(location.href).searchParams` or
  `new URLSearchParams(location.search)`.
- Is there a length limit? The standard sets none, but servers and CDNs often
  reject URLs over about 8 KB; large data goes in a `POST` body.

## Common Mistakes

- Building URLs with template strings and forgetting to encode user input.
- Using `encodeURI` for a parameter value.
- Decoding `+` with `decodeURIComponent` and getting `+` instead of a space.
- Encoding a value twice, once by hand and once by `URLSearchParams`.
- Checking a URL with `startsWith` or a regular expression instead of parsing it
  and comparing `origin`.

## See Also

- [HTTP](./http.md)
- [CORS and the Same-Origin Policy](./cors.md)
- [History API](../browser/history-api.md)
- [Cross-Site Scripting (XSS)](../security/xss.md)
