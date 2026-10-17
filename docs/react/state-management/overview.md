---
sidebar_position: 1
description:
  Kinds of state and where each belongs, client vs server state, when a store is
  needed, Zustand
---

# Where to Keep State

The place for state is chosen by **the kind of data**, not by a library. State
starts **local** and is lifted only as high as needed; what can be computed is
not stored. **Server state** (a cache of data from an API) goes to a
data-fetching library such as [TanStack Query](./tanstack-query.md); **URL
state** (filters, page, tab) goes to the URL; **global client state** goes to
context if it changes rarely, or to a **store** (Zustand, Redux Toolkit) if it
changes often and is read in parts. Most of what apps used to keep in a global
store is server state.

Applies to: React 19.3, Zustand 5.

## Details

### Kinds of State

| Kind                          | Example                                                        | Where                                                                             |
| ----------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Local UI state                | An open dropdown, the text of an input                         | `useState` in the component                                                       |
| Shared by nearby components   | The selected tab and its panel                                 | [Lifted](../basics/state.md#where-state-lives) to the closest common parent       |
| Derived                       | A filtered list, a total                                       | Computed during render, not stored                                                |
| Form                          | Field values, validation errors                                | Uncontrolled fields and [Actions](../basics/forms.md#actions), or React Hook Form |
| URL                           | Filters, sorting, page, the selected ID                        | Search and route params, see [React Router](../ecosystem/routing.md)              |
| Server                        | A user profile, a product list                                 | [TanStack Query](./tanstack-query.md), RTK Query, SWR, or framework loaders       |
| Global client, rarely changes | Theme, locale, the current user                                | [Context](../hooks/context.md)                                                    |
| Global client, changes often  | An unsaved canvas, a selection in a table, a multi-step wizard | A store: Zustand, [Redux Toolkit](./redux.md), Jotai                              |
| Not shown in the UI           | A timer ID, the previous value                                 | [Ref](../hooks/refs.md)                                                           |
| Persisted on the device       | A draft, user settings                                         | `localStorage` behind a store (Zustand `persist`) or `useSyncExternalStore`       |

### Client and Server State

- **Client state** belongs to the app: it is synchronous and always up to date.
- **Server state** belongs to the server: the app holds a **copy** that can be
  stale, is shared with other users, and arrives asynchronously.
- Server state needs caching, deduplication of requests, background refetching
  and invalidation after a change. Kept in `useState` or Redux, all of this is
  written by hand.
- One **source of truth**: the same data is not copied into a second place
  (server data into local state, props into state). The copy goes stale.

### When a Store Is Needed

- Many distant components read and change the same client data.
- The data changes often and components read only parts of it: a store with
  **selectors** re-renders only the components whose part changed; context
  re-renders every consumer.
- The update logic is complex and needs DevTools or middleware.

Otherwise local state, [composition](../basics/patterns.md#composition) and
context are enough.

### Libraries

| Library       | Model                                                             |
| ------------- | ----------------------------------------------------------------- |
| Redux Toolkit | One store, actions and reducers; DevTools, middleware, RTK Query  |
| Zustand       | A store as a hook with selectors; no provider, little boilerplate |
| Jotai         | Atoms: small pieces of state combined bottom-up, like `useState`  |
| MobX          | Observable objects, mutable updates, automatic tracking of reads  |
| XState        | State machines: explicit states and transitions for complex flows |

## Example

A Zustand store: each component subscribes to its own part through a selector.

```jsx
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const useCartStore = create((set) => ({
  items: [],
  add: (item) => set((state) => ({ items: [...state.items, item] })),
  clear: () => set({ items: [] }),
}));

function CartBadge() {
  // Re-renders only when the number of items changes
  // highlight-next-line
  const count = useCartStore((state) => state.items.length);
  return <span>{count}</span>;
}

function AddButton({ product }) {
  const add = useCartStore((state) => state.add);
  return <button onClick={() => add(product)}>Add to cart</button>;
}

function CartSummary() {
  // error-start
  // A new object on every call: an infinite loop in Zustand 5
  // Error: Maximum update depth exceeded.
  const { items, clear } = useCartStore((state) => ({
    items: state.items,
    clear: state.clear,
  }));
  // error-end
  // correct-start
  const { items, clear } = useCartStore(
    useShallow((state) => ({ items: state.items, clear: state.clear }))
  );
  // correct-end
  // …
}
```

## Follow-up Questions

- Context or a store? Context for values that change rarely; a store for
  frequently changing data read in parts, see
  [Context and a Store](../hooks/context.md#context-and-a-store).
- Why not keep API data in Redux? Caching, refetching and invalidation would be
  written by hand. With Redux, RTK Query does it.
- What is state colocation? Keeping state as close as possible to where it is
  used: fewer re-renders and easier deletion.
- Why put filters in the URL? The link can be shared, the back button works, and
  the state survives a reload.
- How does Zustand work without a provider? The store lives in a module variable
  outside React, and components subscribe to it through `useSyncExternalStore`.

## Common Mistakes

- A global store for everything, including the text of an input.
- Copying server data into `useState` or a store and syncing it with effects.
- Storing derived data.
- Context for data that changes on every keystroke.
- A Zustand selector that returns a new object or array without `useShallow`.

## See Also

- [State](../basics/state.md)
- [When Does a Component Re-render?](../rendering/re-renders.md)
