---
sidebar_position: 1
description:
  File conventions of the app/ directory, segments, route groups, parallel and
  intercepting routes
---

# App Router

The **App Router** is the file-based router in the `app/` directory. A **folder
is a URL segment**, and the route is public only when the folder has a
**`page.tsx`**. Special files in a folder add UI for that segment and everything
below it: `layout` (shared shell that keeps its state on navigation), `loading`
(Suspense fallback), `error` (error boundary), `not-found`. All components are
**Server Components** by default.

Applies to: Next.js 16.

## Details

### Special Files

| File            | Purpose                                                                        |
| --------------- | ------------------------------------------------------------------------------ |
| `page.tsx`      | The UI of the route; makes the segment publicly reachable                      |
| `layout.tsx`    | Wraps the segment and its children; not re-rendered on navigation between them |
| `template.tsx`  | Like a layout, but remounted on every navigation (state and effects reset)     |
| `loading.tsx`   | Wraps the page in `<Suspense>` and shows this fallback while it loads          |
| `error.tsx`     | Error boundary for the segment; must be a Client Component                     |
| `not-found.tsx` | Shown when `notFound()` is called or no route matches                          |
| `route.ts`      | [Route Handler](./route-handlers.md): an HTTP endpoint instead of a page       |

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
  a `loading.tsx` (or another `<Suspense>` above it) or `generateStaticParams`,
  otherwise `next build` fails.

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
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return <h1>{post.title}</h1>;
}
```

## Follow-up Questions

- What is the difference between `layout` and `template`? A layout persists
  across navigations and keeps its state; a template is remounted each time.
- Why must `error.tsx` be a Client Component? It is a React error boundary and
  receives a `reset` function to retry rendering.
- Can the App Router and the Pages Router be used together? Yes, during a
  migration, but the same URL in both directories is a build error.

## See Also

- [Navigation and Redirecting](./navigation.md)
- [Server Components](./server-components.mdx)
- [Pages Router](../page-router/overview.md)
