---
sidebar_position: 2
description:
  Link and prefetching, useRouter, usePathname, useSearchParams, redirect and
  where to redirect
---

# Navigation and Redirecting

Navigation between pages is done with **`<Link>`**: it renders an `<a>`,
**prefetches** the target route when the link is in the viewport, and navigates
on the client without a full reload, keeping shared layouts. For navigation from
code there is **`useRouter()`** from `next/navigation`. On the server a redirect
is made with **`redirect()`** (307) or **`permanentRedirect()`** (308); before
routing, with `redirects` in `next.config` or in **Proxy**.

Applies to: Next.js 16.

## Details

### Client-Side Hooks

All are imported from `next/navigation` and work only in Client Components.

| Hook                | Returns                                                     |
| ------------------- | ----------------------------------------------------------- |
| `useRouter()`       | `push`, `replace`, `back`, `forward`, `refresh`, `prefetch` |
| `usePathname()`     | The current path, such as `/blog/hello`                     |
| `useSearchParams()` | Read-only `URLSearchParams` of the query string             |
| `useParams()`       | Dynamic params of the current route                         |

- `useRouter` from `next/router` belongs to the Pages Router and does not work
  in `app/`.
- A component that calls `useSearchParams()` should be wrapped in `<Suspense>`;
  otherwise the page up to the closest Suspense boundary is rendered on the
  client.
- In Server Components the same data comes from the `params` and `searchParams`
  props.

### Prefetching

- `<Link>` prefetches only in production, when the link enters the viewport.
- By default, a static route is prefetched fully; for a dynamic route only the
  part down to the nearest `loading.tsx` (the loading shell) is prefetched.
  `prefetch={true}` prefetches the full route, `prefetch={false}` turns it off.
- With Partial Prefetching (`partialPrefetching: true`) the default prefetch is
  the route's static shell with cached content; `prefetch={true}` adds cached
  content that depends on the link's URL.

### Where to Redirect

| Where                           | How                                                     | When                                  |
| ------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| `next.config` `redirects()`     | `{ source, destination, permanent }`                    | Known, static redirects (old URLs)    |
| Proxy (`proxy.ts`)              | `NextResponse.redirect(new URL('/login', request.url))` | Before routing, by a cookie or header |
| Server Component, Route Handler | `redirect('/login')`, `permanentRedirect('/new')`       | After reading data                    |
| Server Action                   | `redirect(...)` (responds with 303)                     | After a mutation                      |
| Client Component                | `router.push()` / `router.replace()`                    | After a user action                   |

- `redirect()` and `notFound()` throw a special error, so they are called
  outside `try/catch` (or the error is rethrown).
- `notFound()` renders the closest `not-found.tsx` with a 404 status.
- `middleware.ts` was renamed to `proxy.ts` in Next.js 16; the exported function
  is `proxy`.

## Example

```tsx title="app/ui/nav-link.tsx"
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  );
}
```

`notFound()` and `redirect()` in a page (with Cache Components the segment also
needs a `loading.tsx`, because the page awaits `params`):

```tsx title="app/orders/[id]/page.tsx"
import { notFound, redirect } from 'next/navigation';
import { getOrder } from '@/lib/orders';

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();
  if (order.status === 'draft') redirect(`/orders/${id}/edit`);

  return <h1>Order {order.number}</h1>;
}
```

## Common Mistakes

- Putting an `<a>` inside `<Link>`: since Next.js 13 `<Link>` renders the `<a>`
  itself.
- Using `useRouter().push` for ordinary links: it loses prefetching and
  accessibility of a real link.
- Wrapping `redirect()` in `try/catch` and swallowing the redirect.
- Passing a relative string to `NextResponse.redirect()`: it needs an absolute
  URL.

## See Also

- [App Router](./overview.md)
- [Authentication](../authentication.md)
- [Navigation in the Pages Router](../page-router/overview.md#navigation)
