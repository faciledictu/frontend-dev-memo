---
sidebar_position: 2
description:
  Server state with TanStack Query, query keys, staleTime and gcTime, mutations,
  invalidation and optimistic updates
---

# Server State: TanStack Query

**TanStack Query** (formerly React Query) is a **cache of server state**.
`useQuery({ queryKey, queryFn })` loads data and stores it under the **query
key**: identical requests are **deduplicated**, cached data is shown at once,
and data counts as **stale** after `staleTime` (0 by default) and is then
refetched in the background (on mount, window focus, reconnect). `useMutation`
changes data on the server; then the related queries are **invalidated** and
refetched. It replaces hand-written loading in `useEffect`, with its race
conditions and no cache.

Applies to: TanStack Query 5.

## Details

### Why Not `useEffect`

| Hand-written `useEffect` + `useState`                                                         | TanStack Query                                               |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Loading and error flags by hand                                                               | `isPending`, `error`, `status`                               |
| [Race conditions](../hooks/side-effects.md#data-fetching-and-race-conditions) on fast changes | The result is stored under its own key                       |
| Every component fetches again                                                                 | One request per key, shared by all components                |
| Data is loaded again on every mount                                                           | Cached data is shown at once and refetched in the background |
| No retries, no refetch on focus or reconnect                                                  | Built in; failed queries are retried 3 times                 |

### Query Keys

- An array: `['todos']`, `['todos', id]`, `['todos', { status, page }]`.
- **Everything `queryFn` depends on goes into the key**, as with the
  dependencies of an effect. A new key is a new cache entry and a new request.
- Objects in a key are hashed deterministically: the order of their properties
  does not matter.
- Keys are hierarchical: `invalidateQueries({ queryKey: ['todos'] })` matches
  every key whose first element is `'todos'`.
- `queryOptions({ queryKey, queryFn })` keeps the key and the function together
  for reuse and typing.

### `staleTime` and `gcTime`

| Option      | Default   | Meaning                                                                                             |
| ----------- | --------- | --------------------------------------------------------------------------------------------------- |
| `staleTime` | `0`       | How long data stays **fresh**. Fresh data is served from the cache without a request                |
| `gcTime`    | 5 minutes | How long an **inactive** query (no component uses it) stays in memory. Called `cacheTime` before v5 |

- With `staleTime: 0` every new mount, window focus and reconnect starts a
  background refetch, while the cached data is already on the screen.
- Data that rarely changes gets a `staleTime` of minutes. `Infinity`: no
  automatic refetch, but invalidation still works; `'static'`: not even
  invalidation refetches.
- **Structural sharing**: if the refetched data is equal to the cached data, the
  old references are kept, so components and memoized values don't update.

### Statuses

- `status` is about data: `'pending'` (no data yet), `'error'`, `'success'`;
  flags `isPending`, `isError`, `isSuccess`.
- `fetchStatus` is about the request: `'fetching'`, `'paused'` (offline),
  `'idle'`; `isFetching` is true for any request, including a background
  refetch.
- `isLoading` is `isPending && isFetching`: the first load. In v4 `isLoading`
  meant what `isPending` means now.
- `placeholderData: keepPreviousData` shows the previous page while the next one
  loads.
- `useInfiniteQuery` with `getNextPageParam` and `fetchNextPage` for infinite
  scroll; `select: (data) => …` derives or picks a part of the data without a
  second query.

### Mutations

- `const mutation = useMutation({ mutationFn })`, then
  `mutation.mutate(variables)`; `mutation.isPending`, `mutation.error`.
- After success: `queryClient.invalidateQueries({ queryKey })` marks the queries
  stale and refetches the active ones, or `queryClient.setQueryData` writes the
  response into the cache.
- **Optimistic update**, the simple way: render `mutation.variables` as a
  pending item while `isPending`, and **return** `invalidateQueries()` from
  `onSettled`: the mutation stays pending until the refetch finishes, so the
  item does not flicker.
- Through the cache: `onMutate` cancels the queries, saves the current data and
  writes the expected data; `onError` restores the saved data; `onSettled`
  invalidates.

### Setup, Suspense and SSR

- One `QueryClient` for the app, passed through `QueryClientProvider`. It is
  created outside the component or once in `useState`, not in render.
- `useSuspenseQuery`: the loading state goes to `<Suspense>`, errors go to an
  error boundary, `data` is always defined.
- SSR: the data is prefetched on the server (`queryClient.prefetchQuery`),
  serialized with `dehydrate` and restored with `<HydrationBoundary>`. In the
  Next.js App Router, data is often loaded in
  [Server Components](../../nextjs/app-router/fetching-patterns.md) instead.
- `queryFn` receives an `AbortSignal` (`{ signal }`); passed to `fetch`, it
  cancels a request that is no longer needed.

### Alternatives

| Library                | Fits                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| SWR                    | The same idea, smaller API, fewer features around mutations            |
| RTK Query              | A project on Redux: the cache lives in the store, invalidation by tags |
| Apollo Client, Relay   | GraphQL, with a normalized cache                                       |
| Framework data loading | React Router loaders, Next.js Server Components: data loaded per route |

## Example

A list with a query and a mutation that invalidates it:

```jsx
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});

async function request(url, options) {
  const response = await fetch(url, options);
  // fetch does not reject on 404 or 500
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function Todos() {
  const client = useQueryClient();
  const { data, isPending, error } = useQuery({
    queryKey: ['todos'],
    queryFn: ({ signal }) => request('/api/todos', { signal }),
  });
  const addTodo = useMutation({
    mutationFn: (text) =>
      request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      }),
    // The returned promise keeps isPending true until the refetch finishes
    // highlight-next-line
    onSettled: () => client.invalidateQueries({ queryKey: ['todos'] }),
  });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
        {addTodo.isPending && (
          <li style={{ opacity: 0.5 }}>{addTodo.variables}</li>
        )}
      </ul>
      <button onClick={() => addTodo.mutate('New task')}>Add</button>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}
```

The key must contain every variable the query depends on:

```jsx
function Todo({ id }) {
  // error-next-line
  useQuery({ queryKey: ['todo'], queryFn: () => fetchTodo(id) }); // one cache entry for all IDs
  // correct-next-line
  useQuery({ queryKey: ['todo', id], queryFn: () => fetchTodo(id) });
  // …
}
```

## Follow-up Questions

- What is the difference between `staleTime` and `gcTime`? `staleTime` decides
  when data is refetched; `gcTime` decides when unused data is removed from
  memory.
- Why is there a request every time the window gets focus? `staleTime` is `0`
  and `refetchOnWindowFocus` is on by default.
- `isPending` or `isFetching`? `isPending` for the first load with no data;
  `isFetching` for any request, such as an indicator of a background refresh.
- Does TanStack Query replace Redux? For server state, yes. The client state
  that is left is usually small enough for `useState`, context or Zustand.
- How to make a query wait for another one? `enabled: Boolean(userId)`.
- How to do infinite scroll? `useInfiniteQuery`: the pages are stored under one
  key, and `fetchNextPage` appends the next one.

## Common Mistakes

- Not throwing on `!response.ok`: the query "succeeds" with the error body.
- A key that does not include a variable used in `queryFn`.
- Creating the `QueryClient` in the component body: a new empty cache on every
  render.
- Copying `data` into `useState` or a store: the copy is not refetched.
- "`gcTime` is how long data is fresh": that is `staleTime`.

## See Also

- [Where to Keep State](./overview.md)
- [Side Effects: Data Fetching](../hooks/side-effects.md#data-fetching-and-race-conditions)
- [TanStack Query docs](https://tanstack.com/query/latest/docs/framework/react/overview)
