---
sidebar_position: 1
description: Render and commit phases, virtual DOM, diffing heuristics and Fiber
tags: [middle, senior]
---

# Rendering and Reconciliation

**Rendering** is React calling components to get a tree of elements (the
"virtual DOM"). **Reconciliation** is comparing this tree with the previous one
to find the minimal set of DOM changes. An update has two phases: **render**
(compute what changed; pure, can be interrupted) and **commit** (apply it to the
DOM; synchronous). A re-render of a component does not mean that the DOM was
touched.

## Details

### Render and Commit

1. **Trigger**: the initial render or a state update.
2. **Render phase**: React calls the component and, recursively, its children,
   and compares the result with the previous tree. Nothing is changed in the
   DOM. This work can be paused or thrown away.
3. **Commit phase**: React applies the DOM changes, sets refs and runs layout
   effects, all in one synchronous pass. `useEffect` callbacks run later,
   usually after the browser paints.

What triggers a re-render: see
[When Does a Component Re-render?](./re-renders.md)

### Virtual DOM

- It is the tree of React elements: plain JavaScript objects that describe the
  UI.
- "The DOM is slow, the virtual DOM is fast" is a myth. A DOM operation is
  cheap; what is expensive is unnecessary layout and paint, and keeping the DOM
  in sync with the state by hand.
- What it gives: the UI is written as a function of state, and React works out
  the DOM updates. It also makes other renderers possible (React Native).
- It is not free: diffing takes time. Svelte and Solid work without a virtual
  DOM.

### Diffing Heuristics

Comparing two arbitrary trees of n elements is O(n³). React does it in O(n) with
two assumptions:

1. **Elements of different types produce different trees.** If the type at a
   position changed (`<div>` → `<span>`, `<A>` → `<B>`), the old subtree is
   destroyed with its state and a new one is built.
2. **`key` identifies a child among its siblings.** With keys React matches list
   items by key and moves them; without keys it matches them by index.

Consequences:

- The same type at the same position keeps the DOM node and the component state;
  only the changed attributes and props are updated.
- An index as a `key` breaks when the list is reordered, filtered or prepended
  to: state and DOM stay with the position, not with the item. How to choose a
  key: [Lists and `key`](../basics/lists-and-keys.md).
- Changing the `key` on purpose resets a component.
- Trees are compared level by level: a subtree moved to another parent is
  recreated.

### Fiber

**Fiber** is the reconciler that React has used since version 16 (2017). A
**fiber** is an object that React keeps for every component instance and DOM
node: one unit of work.

| Field                        | Holds                                                                      |
| ---------------------------- | -------------------------------------------------------------------------- |
| `type`, `key`                | What to render, as in the element                                          |
| `child`, `sibling`, `return` | Links to the first child, the next sibling and the parent                  |
| `memoizedState`              | The state: for a function component, the linked list of its hooks          |
| `alternate`                  | The same fiber in the other tree (current ↔ work in progress)              |
| `lanes`                      | Priority of the pending updates. Lanes replaced the older expiration times |
| `flags`                      | What to do in the commit phase: insert, update, delete                     |

- The links form a linked list, so React walks the tree in a loop instead of
  recursion and can stop after any fiber and continue later.
- React builds a **work-in-progress** tree next to the **current** one and swaps
  them at commit.
- This is the base for [concurrent rendering](./concurrent-rendering.md),
  `Suspense` and error boundaries.

## Example

The type, the position and the `key` decide whether state is kept:

```jsx
import { useState } from 'react';

function Field({ label }) {
  const [text, setText] = useState('');

  return (
    <label>
      {label}
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </label>
  );
}

export default function Form() {
  const [isCompany, setIsCompany] = useState(false);

  return (
    <>
      <button onClick={() => setIsCompany(!isCompany)}>Switch</button>

      {/* Same type, same position: the text survives the switch */}
      {isCompany ? <Field label="Company" /> : <Field label="Name" />}

      {/* Different keys: the field is remounted and the text is reset */}
      {isCompany ? (
        <Field key="company" label="Company" />
      ) : (
        <Field key="name" label="Name" />
      )}
    </>
  );
}
```

## Follow-up Questions

- Does a re-render always update the DOM? No. If the render output is the same,
  the commit phase changes nothing.
- Why is the commit phase synchronous? A partially applied update would show an
  inconsistent UI.
- What is the difference between the virtual DOM and Fiber? The virtual DOM is
  the idea of describing the UI with objects; Fiber is the implementation of the
  reconciler that processes them.
- What happens when an element's type changes at the same position? React
  destroys the old subtree with its state and mounts the new one.

## Common Mistakes

- "The virtual DOM is faster than the real DOM."
- "React re-renders the whole tree from the root on every state change": it
  starts from the component whose state changed, see
  [re-renders](./re-renders.md).
- `key={Math.random()}` or `key={index}` for a dynamic list.

## See Also

- [When Does a Component Re-render?](./re-renders.md)
- [Lists and `key`](../basics/lists-and-keys.md)
- [Optimizing React Components](../performance/optimization.md)
- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
