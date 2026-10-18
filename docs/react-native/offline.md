---
sidebar_position: 18
description:
  NetInfo and expo-network, isConnected vs isInternetReachable, cached reads,
  queued writes, offline-first, TanStack Query onlineManager and focusManager,
  conflicts and idempotent requests
tags: [middle, senior]
---

# Offline Support

An offline-capable app **reads from a local copy** and **does not lose writes**
made without a network. There are three levels: **cached reads** (a persisted
query cache) → **queued writes** (paused mutations, an outbox) →
**offline-first** (a local database is the source of truth, a sync engine
exchanges changes with the server). Connectivity comes from **NetInfo** or
**`expo-network`**, but "connected" does not mean the internet works: requests
still fail and must be retried.

Applies to: React Native 0.88, Expo SDK 58, TanStack Query 5.

## Details

### Is the Device Online?

| Field                 | Meaning                                                               |
| --------------------- | --------------------------------------------------------------------- |
| `isConnected`         | There is a network (Wi-Fi, cellular); says nothing about the internet |
| `isInternetReachable` | The internet answers; `null` while unknown (right after launch)       |

- NetInfo (`@react-native-community/netinfo`): `useNetInfo()`,
  `addEventListener` (returns an unsubscribe function), `fetch()`. Where the
  platform does not report reachability, it pings a URL (`reachabilityUrl`).
- `expo-network`: `useNetworkState()`, `addNetworkStateListener`. On iOS its
  `isInternetReachable` is the same as `isConnected`.
- Wi-Fi with a captive portal, a dead cellular link or a server outage all look
  "connected". Use the flag for UI and for resuming queued work, not to skip a
  request: send it and handle the error.

### Levels

| Level         | Works offline                       | How                                                                                                      |
| ------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Cached reads  | Seeing data loaded earlier          | Persisted TanStack Query cache, or data in MMKV / SQLite                                                 |
| Queued writes | Actions are saved and sent later    | Paused mutations, or an outbox table drained when the network is back                                    |
| Offline-first | Everything; the network is optional | A local database (SQLite) is read and written by the UI; a sync engine exchanges changes with the server |

Where to keep the data (AsyncStorage, MMKV, SQLite):
[Storing Data on the Device](./storage.md).

### TanStack Query in React Native

- There is no `window`: the library does not know about the network or the app
  focus. Connect them yourself: `onlineManager.setEventListener` with NetInfo or
  `expo-network`, and `focusManager.setFocused(state === 'active')` from
  `AppState`.
- With the default `networkMode: 'online'`, queries and mutations started
  offline **pause** (`fetchStatus: 'paused'`, `isPaused`) and run when the
  device is back online.
- **Persisted cache**: `PersistQueryClientProvider` with
  `createAsyncStoragePersister` (or an MMKV-backed storage); `gcTime` at least
  as long as the persister's `maxAge` (24 hours by default), and a `buster` that
  changes when the data shape does.
- **Mutations that survive a restart**: register the `mutationFn` with
  `queryClient.setMutationDefaults(['addTodo'], …)` (a function cannot be
  persisted, only the key and variables), then call
  `queryClient.resumePausedMutations()` in the provider's `onSuccess`.
- **Optimistic updates**: in `onMutate` cancel queries, save the old data and
  write the new one with `setQueryData`; restore it in `onError`; invalidate in
  `onSettled`. See
  [TanStack Query](../react/state-management/tanstack-query.md).

### Sync Engines on SQLite

- **PowerSync**: syncs Postgres, MongoDB or MySQL into SQLite on the device;
  writes go through a local upload queue to your backend.
- **ElectricSQL**: streams subsets ("shapes") of Postgres to the client; writes
  go through your API.
- **WatermelonDB**: a local database on SQLite; you implement the pull and push
  endpoints.
- **Realm**: was popular; its Atlas Device Sync reached end of life in 2025, so
  it appears only in older projects.

### Conflicts and Idempotency

| Strategy        | How it works                                                | Fits                                 |
| --------------- | ----------------------------------------------------------- | ------------------------------------ |
| Last write wins | The newest change overwrites; server timestamps or versions | Settings, simple fields              |
| Server wins     | A stale write (old `version`) is rejected with 409          | Money, stock, anything authoritative |
| Merge           | Per-field merge, or CRDTs (Yjs, Automerge) for documents    | Notes, collaborative text            |

- A queued request may be sent twice (a timeout after the server already applied
  it). Make writes **idempotent**: an ID generated on the client (`randomUUID()`
  from `expo-crypto`) for new records, or an `Idempotency-Key` header the server
  remembers.
- Send queued writes in order: an edit must not reach the server before the
  create.
- Device clocks are wrong; compare server-assigned versions, not client times.

### Showing Offline State

- A banner from `useNetInfo()` / `useNetworkState()`, not an error screen, when
  cached data exists; show when the data was last updated.
- Mark pending items ("Sending…", a clock icon) and failed ones with a retry.
- Disable actions that must not be queued: payments, one-time codes.

## Example

```tsx title="queryClient.tsx"
import { useEffect, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  QueryClient,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

// Network: pause queries and mutations offline, resume online
// highlight-start
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(!!state.isConnected))
);
// highlight-end

const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: 24 * 60 * 60 * 1000 } },
});

// Queued mutations need their function registered by key
queryClient.setMutationDefaults(['addTodo'], {
  mutationFn: (todo: { id: string; title: string }) =>
    // PUT with a client-generated id: a retry does not duplicate the record
    fetch(`https://api.example.com/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
    }).then((res) => {
      if (!res.ok) throw new Error(String(res.status)); // keep it queued
      return res;
    }),
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

export function QueryProvider({ children }: { children: ReactNode }) {
  // App focus: refetch stale queries when the app returns to the foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (Platform.OS !== 'web') focusManager.setFocused(state === 'active');
    });
    return () => sub.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => queryClient.resumePausedMutations()}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
```

```tsx title="AddTodoButton.tsx"
import { Button } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';

type Todo = { id: string; title: string };

// Works offline: the mutation pauses and is sent when the network is back
export function AddTodoButton() {
  const addTodo = useMutation<Response, Error, Todo>({
    mutationKey: ['addTodo'], // mutationFn comes from setMutationDefaults
  });
  return (
    <Button
      title="Add"
      onPress={() => addTodo.mutate({ id: randomUUID(), title: 'Buy milk' })}
    />
  );
}
```

## Follow-up Questions

- `isConnected` is `true`, but requests fail. Why? It only means there is a
  network: a captive portal, no mobile data, or the server is down. Check
  `isInternetReachable` and handle errors anyway.
- Why does refetch on focus not work in React Native out of the box? TanStack
  Query listens to the browser's `visibilitychange`; in React Native connect
  `focusManager` to `AppState`.
- What happens to a mutation started offline? With `networkMode: 'online'` it
  pauses and runs when the device is online again; to survive an app restart it
  needs a persisted cache, `setMutationDefaults` and `resumePausedMutations`.
- How do you avoid duplicate records when a request is retried? A client-side ID
  or an idempotency key.
- When is a sync engine worth it? When users edit data offline for long periods
  or on several devices; for "see the last data" a persisted cache is enough.
- How do you sync in the background? A periodic task, see
  [App Lifecycle](./app-lifecycle.md); but sync on launch and on return to the
  foreground first: background runs are not guaranteed.

## Common Mistakes

- Blocking all requests when `isConnected` is `false`, or trusting it when it is
  `true`.
- Treating `isInternetReachable: null` as offline at startup.
- Persisting the cache with `gcTime` shorter than `maxAge`: entries are
  garbage-collected and removed from storage before `maxAge`.
- Retrying non-idempotent `POST` requests from a queue.
- An error screen instead of cached data when the device is offline.

## See Also

- [Storing Data on the Device](./storage.md)
- [App Lifecycle and Background Work](./app-lifecycle.md)
- [TanStack Query](../react/state-management/tanstack-query.md)
- [TanStack Query in React Native](https://tanstack.com/query/latest/docs/framework/react/react-native)
