---
sidebar_position: 17
description:
  AsyncStorage, MMKV, SecureStore and SQLite, where each kind of data goes on
  the device, tokens in Keychain / Keystore, persisting app state
tags: [junior, middle]
---

# Storing Data on the Device

There is no `localStorage` in React Native. The choice depends on the data:
**settings and cache** go into a key-value store, **AsyncStorage** (async) or
the faster, synchronous **MMKV**; **tokens and secrets** go into the **iOS
Keychain / Android Keystore** through `expo-secure-store` or
`react-native-keychain`; **many records to query** go into **SQLite**. A plain
key-value store is not encrypted: anyone with access to a rooted device or an
unencrypted backup can read it.

Applies to: React Native 0.88, Expo SDK 58.

## Details

### Which One to Use

| Storage                                      | API                                  | Encrypted                        | Use for                                                      |
| -------------------------------------------- | ------------------------------------ | -------------------------------- | ------------------------------------------------------------ |
| AsyncStorage                                 | Async, strings                       | No                               | Settings, small cache, persisted state                       |
| MMKV                                         | **Sync**, typed values               | Optional (the key is in the app) | The same, when speed or sync reads matter (state on startup) |
| `expo-secure-store`, `react-native-keychain` | Async (sync variants in SecureStore) | Yes: Keychain / Keystore         | Tokens, passwords, keys: small values                        |
| `expo-sqlite`, op-sqlite                     | Async SQL (sync available)           | Optional (SQLCipher)             | Lists of records, search, offline data                       |
| `expo-file-system`                           | Files                                | No                               | Images, downloads, large JSON                                |

- **AsyncStorage** 3 keeps data in SQLite and creates named instances
  (`createAsyncStorage('app')`); the default export still reads the v2 storage,
  so old data is not lost on upgrade. `expo-sqlite/kv-store` is a drop-in
  replacement for the classic (v2) API, with sync methods.
- **MMKV** (`react-native-mmkv` 4, a Nitro module built on JSI) reads
  synchronously from memory-mapped files, so a store can be read before the
  first render without a loading state.

### Secrets

- iOS **Keychain** stores the value encrypted by the system; on Android the
  value is encrypted with a key held in the **Keystore** (hardware-backed where
  available).
- `requireAuthentication` asks for Face ID / fingerprint before reading; such a
  value becomes unreadable when the biometrics change.
- Keep values small (a token, not a profile): some iOS versions rejected values
  over about 2 KB.
- MMKV's `encryptionKey` is not a place for secrets: the key is in the JS bundle
  or must itself be stored in the Keychain.
- On iOS, Keychain items can **survive an uninstall**: a reinstalled app may
  find an old token. Clear it on the first launch (a flag in AsyncStorage) if
  this matters; on Android the data is removed with the app.

### Relational and Offline Data

- SQLite fits lists the user filters and searches, and data kept offline:
  `expo-sqlite` (with `SQLiteProvider` and `useSQLiteContext`) or op-sqlite.
  Drizzle and similar ORMs work on top of them.
- Offline-first apps (local writes, sync with the server, conflicts) usually use
  a sync engine on top of SQLite; see [Offline Support](./offline.md).

### Persisting App State

- Zustand: the `persist` middleware with `createJSONStorage(() => storage)`,
  where `storage` is an AsyncStorage instance or an MMKV adapter. See
  [Where to Keep State](../react/state-management/overview.md).
- TanStack Query: `persistQueryClient` with
  `@tanstack/query-async-storage-persister` keeps the cache between launches.
  See [TanStack Query](../react/state-management/tanstack-query.md).
- Store a version with persisted state and migrate it: after an app update the
  old shape is still on the device.

## Example

```ts title="storage.ts"
import * as SecureStore from 'expo-secure-store';
import { createMMKV } from 'react-native-mmkv';

// Settings: synchronous, readable before the first render
export const settings = createMMKV({ id: 'settings' });
settings.set('theme', 'dark');
const theme = settings.getString('theme'); // 'dark'

// Token: Keychain on iOS, Keystore-encrypted on Android
export async function saveToken(token: string) {
  // highlight-next-line
  await SecureStore.setItemAsync('session', token);
}

export function getToken() {
  return SecureStore.getItemAsync('session'); // string | null
}

export async function logout() {
  await SecureStore.deleteItemAsync('session');
  settings.remove('user');
}
```

<details>
<summary>Zustand persisted to MMKV</summary>

```ts title="store.ts"
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'store' });

const storage = createJSONStorage(() => ({
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => {
    mmkv.remove(name);
  },
}));

type Cart = { items: string[]; add: (id: string) => void };

export const useCart = create<Cart>()(
  persist(
    (set) => ({
      items: [],
      add: (id) => set((s) => ({ items: [...s.items, id] })),
    }),
    { name: 'cart', storage, version: 1 }
  )
);
```

</details>

## Follow-up Questions

- Why not keep the token in AsyncStorage? It is a plain file in the app's
  sandbox: readable on a rooted or jailbroken device and in unencrypted backups.
- Why is MMKV faster than AsyncStorage? It is synchronous and memory-mapped: no
  async round trip and no JSON serialization, values are typed (numbers,
  booleans).
- Where do you keep a refresh token and where the access token? The refresh
  token in the Keychain / Keystore; the short-lived access token can stay in
  memory and be restored from the refresh token on launch.
- What happens to the data on an app update or uninstall? It survives an update
  (keep migrations for the shape); it is removed on uninstall, except iOS
  Keychain items.
- Can the app read the token while the device is locked (a background refresh, a
  push handler)? It depends on the Keychain accessibility class: the default
  `WHEN_UNLOCKED` fails then; use `AFTER_FIRST_UNLOCK` (`keychainAccessible` in
  SecureStore).

## Common Mistakes

- Tokens in AsyncStorage, or in MMKV "because it supports encryption".
- Storing a whole server response in a secure store: it is meant for small
  values and is slow for large ones.
- Reading AsyncStorage synchronously or forgetting `await`: it returns a
  promise.
- Persisting state without a version: an app update with a new shape crashes on
  the old data.

## See Also

- [Offline Support](./offline.md)
- [Environment Configuration and Secrets](./release/env.md)
- [Browser Storage](../web-platform/network/storage.md)
- [Authentication and Authorization](../web-platform/network/authentication.md)
