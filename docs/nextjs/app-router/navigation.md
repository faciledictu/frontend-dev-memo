---
sidebar_position: 2
description:
  Link and prefetching, useRouter, usePathname, useSearchParams, redirect and
  where to redirect
tags: [junior, middle]
---

# Navigation and Redirecting

Navigation between pages is done with **`<Link>`**: it renders an `<a>`,
**prefetches** the target route when the link is in the viewport, and navigates
on the client without a full reload, keeping shared layouts. For navigation from
code there is **`useRouter()`** from `next/navigation`. On the server a redirect
is made with **`redirect()`** (307) or **`permanentRedirect()`** (308); before
routing, with `redirects` in `next.config` or in **Proxy**.

Applies to: Next.js 16.4.

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
  client, and with no boundary at all `next build` fails on a static page.
- In Server Components the same data comes from the `params` and `searchParams`
  props.

### Prefetching

- `<Link>` prefetches only in production, when the link enters the viewport.
- By default, a static route is prefetched fully; for a dynamic route only the
  part down to the nearest `loading.tsx` (the loading shell) is prefetched.
  `prefetch={true}` prefetches the full route, `prefetch={false}` turns it off.
- With Partial Prefetching (`partialPrefetching: true`; requires Cache
  Components, both on in new 16.4 projects) the default prefetch is the route's
  **App Shell** (the part that does not depend on URL data: static and cached
  content), reused across links; `prefetch={true}` adds cached content that
  depends on the link's URL.

### Where to Redirect

| Where                           | How                                                                                    | When                                  |
| ------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------- |
| `next.config` `redirects()`     | `{ source, destination, permanent }`                                                   | Known, static redirects (old URLs)    |
| Proxy (`proxy.ts`)              | `NextResponse.redirect(new URL(...))`, see [Proxy](../proxy.md)         | Before routing, by a cookie or header |
| Server Component, Route Handler | `redirect('/login')`, `permanentRedirect('/new')`                                      | After reading data                    |
| Server Action                   | `redirect(...)`: a client-side navigation; 303 for a form submitted without JavaScript | After a mutation                      |
| Client Component                | `router.push()` / `router.replace()`                                                   | After a user action                   |

- `redirect()` and `notFound()` throw a special error, so they are called
  outside `try/catch` (or the error is rethrown).
- `notFound()` renders the closest `not-found.tsx` with a 404 status.

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
  // highlight-next-line
  if (order.status === 'draft') redirect(`/orders/${id}/edit`);

  return <h1>Order {order.number}</h1>;
}
```

## Follow-up Questions

- `redirect()` or `router.push()`? `redirect()` while rendering on the server or
  in a Server Action; `router.push()` in a client event handler.
- What does `router.refresh()` do? Fetches the current route's RSC Payload again
  and re-renders Server Components, keeping client state and scroll.
- Why can a prefetched link still show a loading state? Only the shell (down to
  `loading.tsx`, or the App Shell) is prefetched by default; the rest renders on
  navigation.
- How do you link to an external URL? With a plain `<a>` (or `<Link>`, which
  then renders an `<a>` without prefetching): client-side navigation and
  prefetching apply only to routes of the app.

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
