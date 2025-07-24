---
sidebar_position: 20
---

# Redux Overview\*

## What is Redux and Why Use It in React Native?

Redux is a predictable state container for JavaScript applications. In React
Native, Redux is used to manage application state in a centralized store,
enabling consistent behavior, time-travel debugging, and easier testing.

## How Redux Works

- **Store**: Holds the application state.
- **Actions**: Plain objects describing what happened.
- **Reducers**: Functions that specify how the state changes in response to
  actions.
- **Dispatch**: Sends actions to the store.
- **Subscribe**: Listens for state changes.

## Core Principles

- **Single Source of Truth**
- **State is Read-Only**
- **Changes via Pure Functions**

## Redux vs Context API

- Context API is suitable for light state needs (e.g., theme, locale).
- Redux excels at large-scale apps with complex state logic, devtools support,
  middleware, and performance optimizations.

## Selectors

Selectors are functions used to extract and compute derived data from the store.
Using libraries like Reselect helps memoize selectors and avoid unnecessary
re-renders.

## Async Logic: Thunks vs Sagas

- **redux-thunk**: Allows writing action creators that return a function.
  Simpler and widely used.
- **redux-saga**: Uses generator functions for side effects. Better for complex
  flows, retry logic, and cancellation.

## Middleware

Middleware intercepts dispatched actions before they reach the reducer. Use it
for logging, async processing, crash reporting, etc.

## Persisting State

Use libraries like `redux-persist` to save parts of the Redux store to local
storage or AsyncStorage in React Native.

## Scalability Patterns

- Feature-based folder structure
- `ducks` pattern or Redux Toolkit slices
- Normalize large nested state (e.g., with normalizr)
- Use selectors and RTK Query for derived and remote state

## Optimistic Updates

Update the UI immediately after a user action, then reconcile with server
response. Use temporary state and rollback logic if needed.

## Redux Toolkit (RTK)

- Reduces boilerplate with `createSlice`, `createAsyncThunk`, and
  `configureStore`
- Encourages best practices by default (immutable updates with Immer)
- Includes RTK Query for API management

## RTK Query

- Handles caching, data fetching, and mutations
- Auto-generates hooks like `useGetPostsQuery`
- Simplifies error handling and cache invalidation

## Testing Redux Logic

- **Reducers**: Unit test with inputs and expected state outputs
- **Thunks/Sagas**: Use `redux-mock-store` or saga test utils
- **Components**: Use `Provider` and mock store for integration testing

## Best Practices

- Use Redux Toolkit for all new code
- Co-locate logic in feature slices
- Use middleware sparingly and purposefully
- Memoize selectors
- Avoid large monolithic reducers
- Use RTK Query or services layer for API handling

## When Not to Use Redux

- Simple apps or local state only
- When Context API or component state is sufficient
- For highly decoupled UI states with no global dependency
