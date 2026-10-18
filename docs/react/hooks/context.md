---
sidebar_position: 4
description:
  createContext, providers, useContext and use, re-renders of consumers
tags: [junior, middle]
---

# React Context

**Context** passes a value to components at any depth without handing it through
props at every level: `createContext`, a provider and `useContext` (or `use`).
It is a **delivery mechanism**, not state management: the state itself lives in
`useState` or `useReducer` of the component that renders the provider. When the
value changes, **every component that reads the context re-renders**.

Applies to: React 19.3.

## Details

### API

| Step    | React 19                       | Before / legacy                                                            |
| ------- | ------------------------------ | -------------------------------------------------------------------------- |
| Create  | `createContext(defaultValue)`  | The same                                                                   |
| Provide | `<ThemeContext value={theme}>` | `<ThemeContext.Provider value={theme}>` (still works)                      |
| Read    | `useContext(ThemeContext)`     | `<ThemeContext.Consumer>` (a render prop), `static contextType` in classes |
| Read    | `use(ThemeContext)`            | —                                                                          |

- A component reads the value of the **nearest provider above** it. Providers
  can be nested to override the value for a subtree.
- `defaultValue` is used only when there is **no provider** above.
- `use(Context)` can be called in a condition or after an early return;
  `useContext` can't.

### Re-renders

- Consumers re-render when the value changes by `Object.is`. `memo` does not
  stop it.
- There are no selectors: a component that needs one field re-renders when any
  field of the value changes.
- An object created in the provider's render (`value={{ user, logout }}`) is new
  every time, so every consumer re-renders whenever the provider's parent does.
  The value is wrapped in `useMemo` to keep **the same reference**, not because
  it is expensive to compute.
- **Split contexts**: one for the state and one for the functions that change
  it; one for rarely changing data and one for frequently changing data.

### Context and a Store

- Context fits values that change rarely: theme, locale, the current user.
  Shared state that changes often and is read in parts belongs in a store with
  selectors, see
  [When a Store Is Needed](../state-management/overview.md#when-a-store-is-needed).
- Before reaching for context, check if
  [composition](../basics/patterns.md#composition) solves the prop drilling.

## Example

```jsx
import { createContext, use, useCallback, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // The same object until `theme` changes
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = use(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeButton />
    </ThemeProvider>
  );
}
```

## Follow-up Questions

- Does context replace Redux? It replaces passing props. It has no selectors,
  middleware or DevTools; with frequently changing state it re-renders too much.
- Why wrap the value in `useMemo`? To keep the reference stable so consumers
  don't re-render when the provider's parent re-renders for another reason.
- How to avoid re-rendering all consumers? Split the context, keep the provider
  as low as possible, or move the state to a store.
- What does a component get without a provider? The default value from
  `createContext`.
- How does a child update the context? The provider puts the setter or
  `dispatch` into the value, or into a second context for the actions.

## Common Mistakes

- Calling context "a state manager".
- Passing a new object as the value on every render.
- One large context for the whole app state.
- Forgetting the provider and silently working with the default value, for
  example `createContext({ user: null, login: () => {} })` with a no-op `login`.
  A custom hook that throws, as in the example, catches it.

## See Also

- [Props: prop drilling](../basics/props.md#prop-drilling)
- [Hooks](./hooks.mdx)
