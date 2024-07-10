---
sidebar_position: 8
---

# Best Practices for Working with Data

## Fetch data on the server

- **Direct Access.** Gain direct access to backend data resources (e.g.,
  databases).

- **Enhanced Security.** Prevent exposure of sensitive information (e.g., access
  tokens, API keys) to the client.

- **Efficient Data Handling.** Fetch data and render in the same environment,
  reducing client-server communication and main thread work on the client.

- **Optimized Data Fetching.** Perform multiple data fetches with a single
  round-trip instead of multiple individual requests on the client.

- **Improved Performance.** Reduce client-server waterfalls and latency by
  fetching data closer to the data source.

## Fetch Data in the Component that Need It

You don't need to fetch data globally and pass props to children components when
using the same data in multiple components. Instead, you can use `fetch` or
React `cache` in each component that needs the data.

This approach doesn't affect performance because `fetch` requests are
automatically memoized.

## Working with Multiple Fetching

### Sequential Fetching

In sequential data fetching, requests are made one after the other. If you have
nested components, then data fetching will happen sequentially if those data
requests are different. (this doesn't apply to requests for the same data as
they are automatically memoized).

To implement this, you typically use await in an async function to ensure that
each request completes before the next one starts.

```tsx
// ...

async function Playlists({ artistID }: { artistID: string }) {
  // Wait for the playlists
  const playlists = await getArtistPlaylists(artistID);

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
}

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  // Wait for the artist
  const artist = await getArtist(username);

  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}
```

:::tip

Use `loading.js` or React `<Suspense>` to show an instant loading state while
React fetches the result. This will prevent the whole route from being blocked
and the user can interact with the parts of the page that are not blocked.

:::

### Parallel Fetching

An approach to prevent waterfalls is using parallel data fetching.

To fetch data in parallel, define requests outside the components that use the
data and call them from inside the component. This saves time by initiating both
requests in parallel, but the user won't see the result until both promises are
resolved.

The `getArtist` and `getArtistAlbums` functions are defined outside the Page
component. Inside it we call them in parallel and wait for both promises to
resolve.

```tsx
import Albums from './albums';

async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`);
  return res.json();
}

async function getArtistAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`);
  return res.json();
}

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const artistData = getArtist(username);
  const albumsData = getArtistAlbums(username);

  // Wait for the promises to resolve
  const [artist, albums] = await Promise.all([artistData, albumsData]);

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  );
}
```
