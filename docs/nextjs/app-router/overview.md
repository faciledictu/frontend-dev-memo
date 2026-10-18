---
sidebar_position: 1
description:
  File conventions of the app/ directory, segments, route groups, parallel and
  intercepting routes
tags: [junior, middle]
---

# App Router

The **App Router** is the file-based router in the `app/` directory. A **folder
is a URL segment**, and the route is public only when the folder has a
**`page.tsx`**. Special files in a folder add UI for that segment and everything
below it: `layout` (shared shell that keeps its state on navigation), `loading`
(Suspense fallback), `error`
([error boundary](../../react/basics/error-boundaries.md)), `not-found`. All
components are **Server Components** by default.

Applies to: Next.js 16.4.

## Details

### Special Files

| File               | Purpose                                                                        |
| ------------------ | ------------------------------------------------------------------------------ |
| `page.tsx`         | The UI of the route; makes the segment publicly reachable                      |
| `layout.tsx`       | Wraps the segment and its children; not re-rendered on navigation between them |
| `template.tsx`     | Like a layout, but remounted on every navigation (state and effects reset)     |
| `loading.tsx`      | Wraps the page in `<Suspense>` and shows this fallback while it loads          |
| `error.tsx`        | Error boundary for the segment; must be a Client Component                     |
| `not-found.tsx`    | Shown when `notFound()` is called; the root one also handles unmatched URLs    |
| `global-error.tsx` | Replaces the root layout when it throws; renders its own `<html>` and `<body>` |
| `route.ts`         | [Route Handler](./route-handlers.md): an HTTP endpoint instead of a page       |

The root `app/layout.tsx` is required and must render `<html>` and `<body>`.
Other files in a folder (components, utilities) are not routes, so they can be
kept next to the page.

### Segments

| Folder              | Example URL        | `params`                         |
| ------------------- | ------------------ | -------------------------------- |
| `blog/[slug]`       | `/blog/hello`      | `{ slug: 'hello' }`              |
| `shop/[...path]`    | `/shop/a/b`        | `{ path: ['a', 'b'] }`           |
| `shop/[[...path]]`  | `/shop` and deeper | `{ path: undefined }` on `/shop` |
| `(marketing)/about` | `/about`           | Route group: not in the URL      |
| `_components`       | —                  | Private folder: never a route    |

- **Route groups** `(name)` organize files and give a set of pages its own
  layout without changing URLs. Two groups must not resolve to the same URL:
  that is a build error.
- `params` and `searchParams` are passed to pages as **promises** since Next.js
  15: `const { slug } = await params`.
- With Cache Components, awaiting `params` is request-time data: the page needs
  a `loading.tsx` (or another `<Suspense>` above it), otherwise `next build`
  fails. `generateStaticParams` makes `params` known at build time, but uncached
  data in the page still needs `<Suspense>` or `'use cache'`.

### Parallel and Intercepting Routes

- **Parallel routes** (`@slot` folders) render several pages in one layout at
  the same time, for example a dashboard with independent panels. The layout
  receives each slot as a prop.
- **Intercepting routes** (`(.)photo/[id]`) show another route in the current
  layout, for example a photo opened in a modal over a feed, while a direct
  visit or reload opens the full page.

## Example

```plaintext
app/
├── layout.tsx            → root layout: <html> and <body>
├── page.tsx              → /
├── not-found.tsx         → 404 for the whole app
├── (marketing)/
│   ├── layout.tsx        → layout only for marketing pages
│   └── about/page.tsx    → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       ├── loading.tsx   → fallback while the post loads
│       └── page.tsx      → /blog/:slug
├── dashboard/
│   ├── layout.tsx        → shared by all dashboard pages
│   ├── loading.tsx       → fallback while a dashboard page loads
│   ├── error.tsx         → catches errors in dashboard pages
│   └── settings/page.tsx → /dashboard/settings
└── api/users/route.ts    → /api/users
```

```tsx title="app/blog/[slug]/page.tsx"
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/posts';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // highlight-next-line
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return <h1>{post.title}</h1>;
}
```

## Follow-up Questions

- What is the difference between `layout` and `template`? A layout persists
  across navigations and keeps its state; a template is remounted each time.
- Why must `error.tsx` be a Client Component? It is a React error boundary. It
  receives `retry()`, which fetches again and re-renders the segment; the older
  `reset()` only clears the error state.
- Can the App Router and the Pages Router be used together? Yes, during a
  migration, but the same URL in both directories is a build error.
- How are dynamic routes prerendered at build time? `generateStaticParams`
  returns the `params` to prerender, like `getStaticPaths` in the Pages Router;
  other values render on request.
- Where does `<title>` come from? From the Metadata API; see
  [Metadata and SEO](./metadata.md).

## Common Mistakes

- Expecting a folder with only a `layout.tsx` to be reachable: it needs a
  `page.tsx` (or `route.ts`).
- `<html>` and `<body>` in a nested layout: only the root layout (and
  `global-error.tsx`) renders them.
- Expecting a layout to re-run on navigation, for example for an auth check.
- `route.ts` and `page.tsx` in the same folder: a build error.

## See Also

- [Navigation and Redirecting](./navigation.md)
- [Server Components](./server-components.mdx)
- [Pages Router](../page-router/overview.md)
