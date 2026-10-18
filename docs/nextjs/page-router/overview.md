---
sidebar_position: 1
description:
  pages/ routing, dynamic routes, _app and _document, navigation and redirects
tags: [junior]
---

# Pages Router

The **Pages Router** is the original Next.js router: every file in **`pages/`**
is a route, and **`[param]`** in a file name makes a dynamic route. All
components are client components that are prerendered on the server and
hydrated; data comes from **`getStaticProps`** / **`getServerSideProps`**.
App-wide wrappers live in **`_app`** and **`_document`**. It is **legacy**:
supported, but new projects use the [App Router](../app-router/overview.md).

Applies to: Next.js 16.4 (Pages Router).

## Details

### Routes

| File                        | URL                | `router.query`                   |
| --------------------------- | ------------------ | -------------------------------- |
| `pages/index.js`            | `/`                |                                  |
| `pages/blog/first-post.js`  | `/blog/first-post` |                                  |
| `pages/posts/[id].js`       | `/posts/a`         | `{ id: 'a' }`                    |
| `pages/shop/[...slug].js`   | `/shop/a/b`        | `{ slug: ['a', 'b'] }`           |
| `pages/shop/[[...slug]].js` | `/shop` and deeper | `{ slug: undefined }` on `/shop` |
| `pages/api/users.js`        | `/api/users`       | API Route, not a page            |

A catch-all `[...slug]` does not match `/shop`; the optional one `[[...slug]]`
does.

### Special Files

- **`_app.js`** wraps every page: global CSS, providers, a shared layout. It
  receives `Component` (the current page) and `pageProps` (from the data
  fetching functions).
- **`_document.js`** customizes the `<html>` and `<body>` markup. It is rendered
  only on the server, so it has no event handlers or state.
- **`404.js`**, **`500.js`**: custom error pages.

### Navigation

- `<Link href="/about">` navigates on the client and prefetches the page in
  production when the link is in the viewport.
- `useRouter()` from **`next/router`** (not `next/navigation`) gives `push`,
  `replace`, `back`, `query`, `pathname`, `isFallback`. `withRouter` is the HOC
  version for class components.

### Redirects

| Where                     | How                                                                         |
| ------------------------- | --------------------------------------------------------------------------- |
| `next.config` `redirects` | `{ source, destination, permanent }` for known URLs                         |
| Proxy (`proxy.ts`)        | `NextResponse.redirect(new URL('/new-page', request.url))`: an absolute URL |
| `getServerSideProps`      | Return `{ redirect: { destination, permanent } }`                           |
| `getStaticProps`          | The same, but not during the build; works on ISR revalidation               |
| Client                    | `router.push()` / `router.replace()`                                        |

## Example

```jsx title="pages/posts/[id].js"
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Post() {
  const router = useRouter();
  // A static page gets the query only after hydration
  // highlight-next-line
  if (!router.isReady) return null;
  const id = Number(router.query.id);

  return (
    <>
      <h1>Post {id}</h1>
      <Link href="/posts">Back</Link>
      <button onClick={() => router.push(`/posts/${id + 1}`)}>Next</button>
    </>
  );
}
```

## Follow-up Questions

- Why is `router.query` empty on the first render of a static page? The page is
  prerendered without the query; it is filled after hydration
  (`router.isReady`).
- How do you share a layout between pages? Render it in `_app`, or use the
  per-page `getLayout` pattern to keep the layout's state between pages.
- Can you use Server Components in the Pages Router? No: all components in
  `pages/` are prerendered and hydrated. Routers can be mixed per URL, not per
  page.

## Common Mistakes

- Importing `useRouter` from `next/navigation` in `pages/`, or from
  `next/router` in `app/`.
- State, effects or event handlers in `_document`: it renders only on the
  server.
- Expecting Server Components or Server Actions in `pages/`: both are App Router
  only.

## See Also

- [Rendering Strategies](./rendering-strategies.md)
- [Data Fetching](./data-fetching.mdx)
- [App Router vs Pages Router](../overview.md#app-router-vs-pages-router)
