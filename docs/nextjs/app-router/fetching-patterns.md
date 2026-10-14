---
sidebar_position: 6
description:
  Fetching in Server Components, waterfalls, parallel requests, streaming,
  preload, passing a promise to the client
---

# Data Fetching Patterns

In the App Router data is fetched **on the server, in the component that needs
it**: an `async` Server Component awaits `fetch` or a database query directly.
The same request in several components is **deduplicated** within one render
(`fetch` automatically, other functions with React `cache`), so data does not
have to be passed down through props. The main risk is a **waterfall**: start
independent requests in parallel and wrap slow parts in `<Suspense>` so they do
not block the page.

Applies to: Next.js 16, React 19.

## Details

### Why on the Server

- Direct access to the database and secrets without an extra API.
- Fewer round trips: the server is close to the data, the client gets the result
  in one response.
- Less JavaScript: the fetching code is not sent to the browser.

### Patterns

| Pattern               | How                                                                              | When                                             |
| --------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------ |
| Sequential            | `const user = await getUser(); await getOrders(user.id)`                         | The second request needs the result of the first |
| Parallel              | Start both, then `await Promise.all([a, b])`                                     | Independent requests                             |
| Streaming             | Each slow component in its own `<Suspense>`                                      | Show the fast parts first                        |
| Preload               | Call `void getItem(id)` early, read it later; the function is wrapped in `cache` | A request can start before a blocking check      |
| Promise to the client | Pass an unawaited promise as a prop; read it with `use()` in a Client Component  | Data needed in an interactive component          |
| Deduplication         | `fetch` is memoized; wrap ORM calls in React `cache`                             | The same data in several components              |

- Nested `async` components that each await their own data form a waterfall: the
  child starts only after the parent has finished.
- `Promise.all` waits for the slowest request; with `<Suspense>` around each
  part they appear independently.
- Client-side fetching (SWR, TanStack Query) is still useful for data that
  changes after the page has loaded: polling, infinite lists.

## Example

Parallel requests; the slow part streams in its own boundary. With Cache
Components the segment also needs a `loading.tsx`, because the page awaits
`params`:

```tsx title="app/artists/[id]/page.tsx"
import { Suspense } from 'react';
import { getArtist, getAlbums, getPlaylists } from '@/lib/music';
import { Playlists } from './playlists';

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Both requests start at once
  const [artist, albums] = await Promise.all([getArtist(id), getAlbums(id)]);

  return (
    <>
      <h1>{artist.name}</h1>
      <p>{albums.length} albums</p>
      <Suspense fallback={<p>Loading playlists...</p>}>
        <Playlists playlistsPromise={getPlaylists(id)} />
      </Suspense>
    </>
  );
}
```

```tsx title="app/artists/[id]/playlists.tsx"
'use client';

import { use } from 'react';

type Playlist = { id: string; name: string };

export function Playlists({
  playlistsPromise,
}: {
  playlistsPromise: Promise<Playlist[]>;
}) {
  const playlists = use(playlistsPromise); // suspends until resolved

  return (
    <ul>
      {playlists.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

## Follow-up Questions

- How do you avoid a waterfall? Start independent requests together, move the
  awaits down to the components that need the data, and wrap slow parts in
  `<Suspense>`.
- Why not fetch from your own Route Handler in a Server Component? It is an
  extra HTTP request to the same server; call the data function directly.
- How is the same request in a layout and a page not made twice? `fetch` calls
  with the same URL and options are memoized for one render; for other functions
  use React `cache`.

## See Also

- [Server Components](./server-components.mdx)
- [Caching](./caching.mdx)
- [`use` and Suspense in React](../../react/performance/concurrent-rendering.md#suspense)
