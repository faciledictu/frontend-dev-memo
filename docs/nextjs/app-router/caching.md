---
sidebar_position: 7
description:
  Cache Components and 'use cache', revalidation, the previous caching model and
  what changed in 15 and 16
---

# Caching

Caching in Next.js is described by four questions: **what** is cached, **where**
(one request, the server, the prerendered route, the browser), **for how long**
and **how it is invalidated**. The layers stay the same; the API changes between
versions. In the current model, **Cache Components** (`cacheComponents: true`
with `partialPrefetching: true`, on in new projects since 16.4, the default from
17), **nothing is cached implicitly**: you mark a function or a component with
**`'use cache'`**, set its lifetime with **`cacheLife`**, tag it with
**`cacheTag`** and invalidate it with **`revalidateTag`** / **`updateTag`**. In
the **previous model** caching is set with `fetch` options and route segment
config; since Next.js 15 `fetch` is not cached by default.

Applies to: Next.js 16.4.

## Details

### Where Data Is Cached

| Layer             | Lifetime                          | Previous model                                                           | Cache Components                                                   |
| ----------------- | --------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| One request       | A single server render            | Request Memoization: identical `fetch` calls; React `cache`              | The same                                                           |
| Server data       | Between requests                  | Data Cache: `fetch` with `force-cache` or `revalidate`, `unstable_cache` | The result of a `'use cache'` function or component                |
| Prerendered route | Until revalidation or a new build | Full Route Cache: the whole route is either static or dynamic            | Static shell: static and cached parts; the rest streams on request |
| Browser           | The session, in memory            | Router Cache: visited and prefetched segments                            | The same; freshness is set by the `stale` time of `cacheLife`      |

### What Changed Between Versions

| Version | Change                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 14      | `fetch` and `GET` Route Handlers are cached by default; the client Router Cache keeps dynamic pages for 30 seconds                    |
| 15      | `fetch` and `GET` Route Handlers are not cached by default; the Router Cache no longer reuses dynamic pages (`staleTimes.dynamic: 0`) |
| 16      | Cache Components: `'use cache'`, `cacheLife`, `cacheTag`, `updateTag`, `refresh`; `revalidateTag` takes a second argument             |
| 16.4    | Cache Components recommended for all apps and enabled in new `create-next-app` projects                                               |

### Cache Components

- At build time Next.js prerenders a **static shell**: static markup, cached
  (`'use cache'`) parts and `<Suspense>` fallbacks. The rest streams at request
  time (**Partial Prerendering**).
- Uncached async work and **runtime APIs** (`cookies()`, `headers()`,
  `searchParams`, `params` not listed in `generateStaticParams`) must be inside
  `<Suspense>` or cached; otherwise Next.js reports a blocking route in
  development and at build time.
- `'use cache'` goes at the top of a file, a function or a component. The
  arguments and the captured variables are the **cache key**; arguments and the
  result must be serializable.
- Runtime APIs cannot be called inside `'use cache'`: read the value outside and
  pass it as an argument. `'use cache: private'` allows them but caches only in
  the browser; `'use cache: remote'` stores the result in a shared cache handler
  instead of the per-instance memory.

`cacheLife` profiles (`stale` is for the browser, `revalidate` is when the
server refreshes in the background, `expire` is when a request has to wait for
fresh data):

| Profile   | `stale` | `revalidate` | `expire` |
| --------- | ------- | ------------ | -------- |
| `default` | 5m      | 15m          | never    |
| `seconds` | 30s     | 1s           | 60s      |
| `minutes` | 5m      | 1m           | 1h       |
| `hours`   | 5m      | 1h           | 1d       |
| `days`    | 5m      | 1d           | 1w       |
| `weeks`   | 5m      | 1w           | 30d      |
| `max`     | 5m      | 30d          | 1y       |

### On-Demand Revalidation

All of these are imported from `next/cache` and are synchronous.

| Function                    | Where                          | Effect                                                                                                       |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `revalidateTag(tag, 'max')` | Server Actions, Route Handlers | Stale-while-revalidate: the old data is served while the new is fetched. The one-argument form is deprecated |
| `updateTag(tag)`            | Server Actions only            | Expires immediately: the user sees their own change after the action                                         |
| `revalidatePath(path)`      | Server Actions, Route Handlers | Invalidates everything cached for a path                                                                     |
| `refresh()`                 | Server Actions only            | Re-renders the current page with fresh uncached data, without touching the cache                             |

### The Previous Model

Used when `cacheComponents` is off.

| Option                                           | Effect                                                 |
| ------------------------------------------------ | ------------------------------------------------------ |
| `fetch(url, { cache: 'force-cache' })`           | Store in the Data Cache                                |
| `fetch(url, { next: { revalidate: 60 } })`       | Store and refresh at most every 60 seconds             |
| `fetch(url, { next: { tags: ['posts'] } })`      | Tag for `revalidateTag`                                |
| `unstable_cache(fn, keys, { tags, revalidate })` | Cache a non-`fetch` function, such as a database query |
| `export const dynamic = 'force-dynamic'`         | Render the route on every request                      |
| `export const revalidate = 60`                   | Default revalidation for the route segment             |

A route becomes dynamic when it uses `cookies()`, `headers()`, `searchParams`,
`connection()` or `cache: 'no-store'`. A route without them is still
**prerendered at build time**, together with the result of its uncached `fetch`.

## Example

With Cache Components: posts are cached for an hour and tagged; the action
expires the tag so the author sees the new post at once.

```tsx title="app/posts/page.tsx"
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';

async function getPosts() {
  'use cache';
  cacheLife('hours');
  cacheTag('posts');
  return db.post.findMany();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

```typescript title="app/posts/actions.ts"
'use server';

import { updateTag } from 'next/cache';
import { db } from '@/lib/db';

export async function createPost(formData: FormData) {
  await db.post.create({ data: { title: String(formData.get('title')) } });
  updateTag('posts');
}
```

## Follow-up Questions

- Is `fetch` cached by default? Not since Next.js 15. With Cache Components
  nothing is cached without `'use cache'`.
- What is the difference between `revalidateTag` and `updateTag`?
  `revalidateTag` serves stale data while refreshing in the background;
  `updateTag` expires at once and is meant for read-your-own-writes in a Server
  Action.
- How does React `cache` differ from `'use cache'`? React `cache` deduplicates
  calls within one request; `'use cache'` keeps the result between requests.
- Why can `'use cache'` data disappear on serverless hosting? By default it is
  kept in the memory of one instance; `'use cache: remote'` is needed for a
  shared cache.

## Common Mistakes

- Describing the Next.js 14 model ("everything is cached") as current.
- With Cache Components, awaiting `params`, `cookies()` or uncached data at the
  top of a page with no `<Suspense>` or `loading.tsx` above it: the build fails
  with a blocking-route error. Fixes: a Suspense boundary, `'use cache'`, or
  `export const instant = false` to allow a blocking route.
- Calling `cookies()` inside a `'use cache'` function instead of passing the
  value as an argument.
- Expecting a page without `cookies()` or `searchParams` to fetch fresh data on
  every request in the previous model: it was prerendered at build time.

## See Also

- [Server Components](./server-components.mdx)
- [Data Fetching Patterns](./fetching-patterns.md)
- [Server Actions](./server-actions.mdx)
