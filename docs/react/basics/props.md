---
sidebar_position: 2
description:
  Passing data and callbacks, default values, children, typing and prop drilling
---

# Props

**Props** are the arguments of a component: the parent passes data and callbacks
to the child. Props are **read-only**. Data flows **one way**: down through
props, and back up through callback props. To change what a child shows, the
parent re-renders and passes new props.

Applies to: React 19.

## Details

- **Any value** can be a prop: primitives, objects, functions, JSX elements.
- **`children`** is the content between the opening and the closing tag. It is
  the main tool of composition: `<Card><Avatar /></Card>`.
- **Default values** are set in destructuring: `{ size = 'm' }`. The default is
  used for a missing prop and for `undefined`, but not for `null`.
- **`defaultProps`** on function components was removed in React 19 (it still
  works for classes).
- **Spread** passes an object as props: `<Button {...props} />`. Rest syntax
  collects the remaining ones: `{ variant, ...rest }`.
- **`key`** is not a prop: the component can't read it. **`ref`** is a regular
  prop of function components since React 19, see
  [Refs](../hooks/refs.md#ref-as-a-prop).

### Typing

- Props are typed with **TypeScript**: a `type` or an `interface` for the props
  object. See [Typing React](../../typescript/react.md).
- The **`prop-types`** package checked props at runtime in development. React 19
  ignores `propTypes` silently, so it remains only in legacy code.

### Reverse Data Flow

A child can't change its props. To report something, it calls a function that
the parent passed down, and the parent updates its own state. Moving state to
the closest common parent is called
[lifting state up](./state.md#where-state-lives).

### Prop Drilling

**Prop drilling** is passing a prop through components that don't use it only to
reach a deep child. Ways to avoid it:

- composition: pass a ready element (`children` or another prop) instead of the
  data for it;
- [context](../hooks/context.md);
- a store such as [Redux](../state-management/redux.md).

## Example

```tsx
import { useState, type ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
};

function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Counter() {
  const [count, setCount] = useState(0);

  // Data goes down as props, the event comes back through a callback
  return (
    <Button onClick={() => setCount(count + 1)}>Clicked {count} times</Button>
  );
}
```

## Follow-up Questions

- What is the difference between props and state? Props come from the parent and
  are read-only; [state](./state.md) is owned and changed by the component
  itself.
- Why are props read-only? With one-way data flow there is a single owner of
  every value, so it is clear where a change comes from.
- Does a component re-render when its props change? It re-renders when its
  parent re-renders, whether or not the props changed. Comparing props is an
  optimization: [`memo`](../performance/optimization.md#memoization).

## Common Mistakes

- Mutating a prop: `props.items.push(item)` changes the parent's data without a
  re-render.
- Copying a prop into state (`useState(props.value)`): the state does not follow
  later changes of the prop.
- Relying on `defaultProps` or `propTypes` in function components on React 19.
- Passing a new object or function to a memoized child on every render.
