---
sidebar_position: 4
description:
  Rendering lists with map, choosing a key, an index as a key, resetting state
  with a key
---

# Lists and `key`

A list is rendered by mapping an array to elements:
`items.map((item) => <Item key={item.id} item={item} />)`. **`key`** tells React
which item is which between renders: it matches old and new children by key, so
it can **move** an item together with its DOM node and state instead of
recreating it. A key must be **stable** (an item keeps its key) and **unique
among siblings**. An ID from the data is the usual choice; the **array index**
is safe only for a list that never changes order.

Applies to: React 19.3.

## Details

### Rules

- The key goes on the element **returned from `map`**: `<Todo key={id} />`, not
  on the `<li>` inside `Todo`.
- It must be unique only among the siblings of one parent. Two different lists
  can use the same keys.
- `key` is not a prop: the component can't read `props.key`. If it needs the ID,
  pass it again as another prop.
- A key is converted to a string, so `1` and `'1'` are the same key.
- Without a key React warns ("Each child in a list should have a unique "key"
  prop") and matches the items by index.
- With duplicate keys React warns, and items can be duplicated or lost on
  update.
- Several elements per item without a wrapper: `<Fragment key={id}>`. The short
  syntax `<>` can't take a key, see [Fragments](./components.md#fragments).

### Choosing a Key

| Source                                                        | Fits                         | Why                                                      |
| ------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------- |
| ID from the database                                          | Yes                          | Stable and unique                                        |
| ID generated when the item is created (`crypto.randomUUID()`) | Yes                          | Stored with the item, so it does not change              |
| Content (`key={name}`)                                        | If it is unique and constant | Editing the content remounts the item                    |
| Index                                                         | Only for a static list       | Shifts on insert, removal, sorting and filtering         |
| `Math.random()` or `crypto.randomUUID()` called in render     | No                           | A new key on every render: every item remounts each time |

### Index as a Key

- React keeps the state of a component and its DOM node (the value of an
  uncontrolled input, focus, scroll position, a running animation) **by key**.
- With index keys, inserting an item at the top gives every item the key of its
  neighbor. The props move to the new item, but the state and the DOM stay at
  the old position, so a typed note ends up next to another item.
- If the items have no state and no uncontrolled inputs, an index only costs
  extra work: every shifted item gets new props and is updated instead of one
  new node being inserted.

### `key` Outside of Lists

A key can be put on any element. A different key means a different component for
React: the old one is unmounted with its state and a new one is mounted.
`<ProfileForm key={userId} />` is the standard way to reset a form when the
selected user changes, see
[Diffing Heuristics](../rendering/reconciliation.md#diffing-heuristics).

## Example

Type a note in the first row, then press the button: with index keys the note
stays in the first row, next to the new task.

```jsx
import { useState } from 'react';

let nextId = 3;

function Todo({ todo }) {
  return (
    <li>
      {todo.text} <input placeholder="Note" />
    </li>
  );
}

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy milk' },
    { id: 2, text: 'Walk the dog' },
  ]);

  function addFirst() {
    setTodos([{ id: nextId++, text: 'New task' }, ...todos]);
  }

  return (
    <>
      <button onClick={addFirst}>Add to the top</button>
      <ul>
        {/* error-next-line */}
        {todos.map((todo, index) => (
          <Todo key={index} todo={todo} />
        ))}
      </ul>
      <ul>
        {/* correct-next-line */}
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </>
  );
}
```

## Follow-up Questions

- Why does React need keys at all? Without them it matches children by position:
  inserting an item at the top would update every item instead of inserting one
  node.
- Where does the key go when `map` returns a component? On the component
  element, not on the root element inside the component.
- Must a key be unique across the whole app? No, only among siblings.
- When is an index fine? When the list is static: never reordered, filtered or
  inserted into.
- Why not generate the key in render? A new key on every render remounts every
  item: state, focus and input values are lost, and the work grows.
- How to reset the state of a component? Change its `key`.

## Common Mistakes

- The key on an element inside the component instead of the element returned
  from `map`.
- `key={Math.random()}` to silence the warning.
- An index as a key for a list that can be sorted, filtered or prepended to.
- Reading `props.key` in the child.
- "Keys are a performance optimization": they are about identity, see
  [Optimizing React Components](../performance/optimization.md#follow-up-questions).

## See Also

- [Rendering and Reconciliation](../rendering/reconciliation.md)
- [List Virtualization](../performance/virtualization.md)
