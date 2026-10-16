---
sidebar_position: 1
description: Components, elements and JSX, purity, fragments
---

# Components

A **component** is a function that takes **props** and returns a description of
the UI: **React elements**, usually written in **JSX**. Components are
independent and reusable, and they are composed into a tree. During rendering a
component must be **pure**: the same props, state and context give the same
output, with no side effects.

## Details

### Component, Element, JSX

| Term      | What it is                                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Component | A function (or a class) such as `Button`. Its name starts with a capital letter                                                     |
| Element   | A plain immutable object `{ type, props, key }` that describes what to render. Cheap to create                                      |
| JSX       | Syntax sugar for creating elements: `<Button size="l" />` compiles to `jsx(Button, { size: 'l' })`                                  |
| Instance  | What React keeps for a component at a position in the tree: its state and effects (a [fiber](../rendering/reconciliation.md#fiber)) |

A lowercase tag (`<div>`) is an HTML element; a capitalized one (`<Button>`) is
a component.

### What a Component Can Return

- A React element or a fragment.
- A string or a number (rendered as text).
- An array of these (each item needs a [`key`](./lists-and-keys.md)).
- `null`, `undefined`, `true` or `false`: nothing is rendered.
- A [portal](./portals.md).

### Purity

- Rendering must not change anything that existed before it: props, state,
  variables outside the component, the DOM.
- Requests, timers and subscriptions go to event handlers or
  [effects](../hooks/side-effects.md).
- The reason: React can call a component several times, pause a render or throw
  its result away (`StrictMode`,
  [concurrent rendering](../performance/concurrent-rendering.md)).
- Local mutation is fine: creating an array during render and pushing into it.

### Fragments

- JSX needs a single root. A **fragment** (`<>…</>`) groups elements without an
  extra DOM node.
- The short syntax takes no props. A fragment in a list needs the explicit form:
  `<Fragment key={id}>`.

### Function and Class Components

Function components with hooks are the standard. Classes are legacy; the only
common thing that still needs one is an
[error boundary](./patterns.md#error-boundaries). See
[Class Components](./class-components.md).

## Example

```jsx
import { Fragment } from 'react';

function PostTitle({ title }) {
  return <h2>{title}</h2>;
}

function PostBody({ body }) {
  return <p>{body}</p>;
}

export default function Blog({ posts }) {
  if (posts.length === 0) {
    return null;
  }

  return posts.map((post) => (
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  ));
}
```

## Follow-up Questions

- What is the difference between a component and an element? A component is a
  function; an element is the object it returns. `<Button />` creates an
  element, it does not call `Button`.
- Why must component names be capitalized? JSX treats lowercase tags as HTML
  elements.
- Why are function components preferred over classes? Less code, no `this`,
  logic is reused with [custom hooks](../hooks/hooks.mdx#custom-hooks), and new
  features are built for hooks.

## Common Mistakes

- Defining a component inside another component: it is a new function on every
  render, so React remounts it and its state is lost.
- Calling a component as a function (`Button()`) instead of `<Button />`: its
  hooks become hooks of the caller.
- Mutating props or outer variables during render.

## See Also

- [Props](./props.md)
- [Rendering and Reconciliation](../rendering/reconciliation.md)
