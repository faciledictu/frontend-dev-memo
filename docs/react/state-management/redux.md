---
sidebar_position: 3
description:
  Store, actions and reducers, Redux Toolkit slices, React Redux hooks and
  memoized selectors
tags: [middle]
---

# Redux

**Redux** keeps the app-wide state in a single **store**. The state is
read-only: the UI **dispatches actions** (plain objects that describe what
happened), pure functions called **reducers** compute the next state, and
subscribed components re-render with the data they select. Modern Redux is
written with **Redux Toolkit** (RTK): `configureStore`, `createSlice` and RTK
Query for server data.

Applies to: Redux Toolkit 2, React Redux 9, Reselect 5.

## Details

### Data Flow

1. An event handler calls `dispatch(action)`.
2. **Middleware** can intercept the action: thunks, listeners, RTK Query,
   logging.
3. The root **reducer** returns the next state without mutating the previous
   one.
4. The store notifies subscribers. Every `useSelector` runs its selector again
   and re-renders the component if the result changed by `===`.

### Three Principles

- **Single source of truth**: one store with one state tree.
- **State is read-only**: the only way to change it is to dispatch an action.
- **Changes are made with pure functions**: a reducer is
  `(state, action) => newState` with no side effects.

### Redux Toolkit

| API                        | What it does                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `configureStore`           | Creates the store with DevTools, thunk middleware and development checks for mutations              |
| `createSlice`              | Generates a reducer and action creators from one object. "Mutating" code is safe thanks to Immer    |
| `createAsyncThunk`         | Wraps an async function and dispatches `pending`, `fulfilled` and `rejected` actions                |
| `createSelector`           | A memoized selector, re-exported from Reselect                                                      |
| `createEntityAdapter`      | Normalized state (`ids` + `entities`) with ready CRUD reducers and selectors                        |
| `createListenerMiddleware` | Reactions to actions: a lighter replacement for sagas                                               |
| `createApi` (RTK Query)    | Data fetching and caching: generated hooks such as `useGetPostsQuery`, cache invalidation with tags |

### React Redux

- `<Provider store={store}>` makes the store available to the tree.
- `useSelector(selector)` reads a piece of state and subscribes to it.
- `useDispatch()` returns `dispatch`.
- In TypeScript, typed versions are created once:
  `useSelector.withTypes<RootState>()`.

### Selectors and Reselect

- A selector is a function `(state) => value`. Components do not depend on the
  state shape, and derived data is not stored.
- `useSelector` compares the result by reference. A selector that returns a new
  array or object (`filter`, `map`, `{ ...}`) causes a re-render after **every**
  action that changes any part of the state. React Redux warns about such
  selectors in development.
- `createSelector(inputSelectors, resultFn)` fixes it: `resultFn` runs again
  only when one of the input results changes, otherwise the cached reference is
  returned.
- Since Reselect 5 the default cache is `weakMapMemoize`: it keeps a result for
  every set of arguments, so one selector works for `selectById(state, 1)` and
  `selectById(state, 2)`. Before v5 the cache held only the last call (now
  `lruMemoize`).
- An alternative for small objects: `useSelector(selector, shallowEqual)`.

### Async Logic

| Tool                | Use it for                                                     |
| ------------------- | -------------------------------------------------------------- |
| RTK Query           | Server data: fetching, caching, refetching. The default choice |
| Thunks              | Imperative logic with access to `dispatch` and `getState`      |
| Listener middleware | Reacting to actions: debounce, analytics, cancellation         |
| `redux-saga`        | Legacy code bases; generator-based flows                       |

### Redux and Alternatives

| Tool      | Fits                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------ |
| Redux     | A lot of shared client state with complex update logic; DevTools with action history, middleware |
| RTK Query | Server state in a project that already uses Redux                                                |

Redux is not needed when the state is local or when most of it is a cache of
server data. How to choose: [Where to Keep State](./overview.md).

## Example

A slice with reducers and selectors:

```typescript
// todosSlice.ts
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from './store';

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

const initialState: { items: Todo[] } = { items: [] };

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action: PayloadAction<Todo>) {
      // Immer turns this "mutation" into an immutable update
      state.items.push(action.payload);
    },
    todoToggled(state, action: PayloadAction<string>) {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) {
        todo.done = !todo.done;
      }
    },
  },
});

export const { todoAdded, todoToggled } = todosSlice.actions;
export default todosSlice.reducer;

export const selectTodos = (state: RootState) => state.todos.items;

// `filter` runs again only when `items` changes
export const selectDoneTodos = createSelector([selectTodos], (items) =>
  items.filter((item) => item.done)
);
```

The store and typed hooks:

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import todosReducer from './todosSlice';

export const store = configureStore({
  reducer: { todos: todosReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

A component:

```tsx
// App.tsx
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store';
import {
  selectDoneTodos,
  selectTodos,
  todoAdded,
  todoToggled,
} from './todosSlice';

function Todos() {
  const todos = useAppSelector(selectTodos);
  const doneCount = useAppSelector(selectDoneTodos).length;
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(
      todoAdded({ id: crypto.randomUUID(), title: 'New todo', done: false })
    );
  };

  return (
    <>
      <button onClick={handleAdd}>Add</button>
      <p>Done: {doneCount}</p>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => dispatch(todoToggled(todo.id))}>
            {todo.done ? <s>{todo.title}</s> : todo.title}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Todos />
    </Provider>
  );
}
```

## Follow-up Questions

- Why Redux Toolkit instead of plain Redux? It removes the boilerplate of action
  types and action creators, mutates drafts safely through Immer, and includes
  thunks, DevTools and serializability checks by default.
- What is a thunk? A function `(dispatch, getState) => …` dispatched instead of
  an action; the thunk middleware calls it, so it can run async code and
  dispatch real actions.
- Why must reducers be pure and the state immutable? Changes are detected by
  reference comparison, and DevTools can replay actions only if the same input
  always gives the same output.
- What is middleware? A function `(store) => (next) => (action) => …` between
  `dispatch` and the reducer; it can delay, change, cancel or dispatch actions.
- What is normalized state? Entities are stored by ID (`{ ids, entities }`)
  instead of nested arrays, so an item is updated in one place.
  `createEntityAdapter` does it.
- How to test Redux code? Reducers as pure functions; components with a real
  store created by `configureStore` inside `Provider`, not with a mocked one.
- When does a component connected with `useSelector` re-render? When the
  selector result changes by reference after an action.

## Common Mistakes

- Mutating the state outside of `createSlice` (in a selector, a component or a
  hand-written reducer).
- In a `createSlice` reducer, both mutating the draft and returning a new value:
  Immer throws. Do one or the other.
- Returning a new object or array from a `useSelector` selector without
  memoization.
- Selecting the whole state: `useSelector((state) => state)` re-renders on every
  action.
- Putting non-serializable values (`Date`, `Map`, class instances, promises) in
  the state or in actions. RTK warns about it; exceptions are configured with
  `serializableCheck.ignoredActions`.
- Keeping server data, form inputs and other local state in Redux.
- Generating random IDs or reading the time inside a reducer: it is a side
  effect.

## See Also

- [State](../basics/state.md#usereducer) — `useReducer` uses the same reducer
  idea locally.
- [React Context](../hooks/context.md)
- [Where to Keep State](./overview.md)
