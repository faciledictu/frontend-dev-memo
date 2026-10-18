---
sidebar_position: 3
description:
  What Proxy (formerly Middleware) is, where it runs in a request, matcher,
  NextResponse, what it is for and not for
tags: [middle]
---

# Proxy (Middleware)

**Proxy** (`proxy.ts` in the project root, called **Middleware** before
Next.js 16) is a function that runs **before a request is routed**: after
`headers` and `redirects` from `next.config`, before rewrites and the filesystem
routes. It can **redirect**, **rewrite** to another path, change request and
response headers and cookies, or respond directly. It runs only on the **Node.js
runtime**. It is for fast decisions based on the request; it is **not** for
fetching data or for real authorization.

Applies to: Next.js 16.4.

## Details

### Place in a Request

1. `headers` from `next.config`.
2. `redirects` from `next.config`.
3. **Proxy**.
4. `beforeFiles` rewrites.
5. Filesystem routes: `public/`, `_next/static/`, `app/`, `pages/`.
6. `afterFiles` rewrites, dynamic routes (`/blog/[slug]`), `fallback` rewrites.

Without a `matcher` Proxy runs on **every request**, including static files,
`_next/image` and the contents of `public/`.

### Matcher

- A path, or an array of paths or of objects with `source`, `has` and `missing`
  (match by a header, a cookie or a query parameter).
- Path parameters work like in `redirects`: `/dashboard/:path*`; a regular
  expression excludes static files (see the example).
- Values must be **constants**: the matcher is read at build time, and a
  variable is ignored.
- Anything finer goes into an `if` inside the function.

### NextResponse

| Call                                                    | What it does                                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Return nothing or `NextResponse.next()`                 | Continue to the route unchanged                                                        |
| `NextResponse.next({ request: { headers } })`           | Continue with changed **request** headers: the route sees them, the browser does not   |
| `response.headers.set(…)`                               | A **response** header: the browser sees it                                             |
| `NextResponse.redirect(new URL('/login', request.url))` | A redirect: the URL in the browser changes                                             |
| `NextResponse.rewrite(new URL('/b', request.url))`      | Serve another route; the URL in the browser stays the same                             |
| `request.cookies` / `response.cookies`                  | Read the incoming cookies / set or delete cookies in the response                      |
| `return Response.json(…, { status: 401 })`              | Respond directly, without reaching the route                                           |
| `event.waitUntil(promise)`                              | The second argument (`NextFetchEvent`): finish work, such as logging, after responding |

### What It Is For

| Good fit                                               | Not a fit                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| Locale detection and rewrite to `/en/…`                | Fetching data for the page: Proxy runs on every matched request    |
| A/B test: pick a variant by a cookie and rewrite       | Slow work: it delays every response                                |
| Redirects that depend on a cookie or a header          | Authorization: the check belongs next to the data                  |
| Security headers, a request ID header                  | Caching `fetch`: `cache` and `next.revalidate` have no effect here |
| An optimistic auth check: no session cookie → `/login` | Static export: Proxy needs a server                                |

**Server Actions** are POST requests to their page, so the page's matcher covers
them, and a moved action silently loses Proxy; see
[Authentication](./authentication.md#proxy).

### `middleware` → `proxy`

- Next.js 16 renamed the file and the function; `middleware.ts` still works but
  is deprecated.
- The codemod renames both: `npx @next/codemod@canary middleware-to-proxy .`
- Proxy runs only on Node.js, and setting `runtime` in it throws. An app that
  needs the Edge runtime keeps `middleware.ts` for now.

## Example

```typescript title="proxy.ts"
import { NextResponse, type NextRequest } from 'next/server';

const LOCALES = ['en', 'de'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Locale: /about → /en/about, the URL in the browser stays /about
  if (
    !LOCALES.some((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
  ) {
    const locale = request.cookies.get('locale')?.value ?? 'en';
    return NextResponse.rewrite(new URL(`/${locale}${pathname}`, request.url));
  }

  // Pass a header to the route, not to the browser
  const headers = new Headers(request.headers);
  headers.set('x-request-id', crypto.randomUUID());
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Everything except API routes, Next.js assets and files with an extension
  // (/logo.png from public/ would otherwise be rewritten to /en/logo.png)
  // highlight-next-line
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
```

## Follow-up Questions

- Rewrite or redirect? A redirect sends the browser to a new URL (a second
  request, the address bar changes); a rewrite serves another route under the
  same URL.
- Why is a request header set with `NextResponse.next({ headers })` a mistake?
  That sets **response** headers: the value goes to the browser. Request headers
  for the route go into `request: { headers }`.
- Can Proxy read the database? On Node.js it technically can, but every matched
  request, including prefetches, would wait for it. Read data in the page and
  check access in the Data Access Layer.
- How many Proxy files can an app have? One, in the project root (or `src/`);
  per-route logic is branching inside it or the matcher.
- Does Proxy run on client-side navigation? Yes: the RSC request for the next
  page is a request to the server and goes through the matcher like any other.
- How does a layout know the locale after a rewrite? Proxy sets a request header
  (`x-locale`) and the server code reads it with `headers()`; on the client
  `usePathname()` still shows the original URL.

## Common Mistakes

- No matcher: Proxy runs on every image and script, and a redirect to `/login`
  can break the styles of the login page itself.
- Treating Proxy as the auth layer. It is an optimistic first check; see
  CVE-2025-29927 in [Authentication](./authentication.md#proxy).
- Building the matcher from a variable: it is ignored silently.
- Using a relative URL in `NextResponse.redirect('/login')`: it needs an
  absolute URL, `new URL('/login', request.url)`.

## See Also

- [Authentication](./authentication.md)
- [Navigation and Redirecting](./app-router/navigation.md)
- [Environment Variables](./environment-variables.md)
