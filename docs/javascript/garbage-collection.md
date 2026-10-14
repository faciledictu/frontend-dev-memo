---
sidebar_position: 13
description: How memory is freed in JavaScript and where leaks come from
---

# Garbage Collection

Memory in JavaScript is managed automatically. The **garbage collector (GC)**
frees objects that are no longer **reachable**: those that can't be accessed
from the **roots** (global variables, the call stack, active closures) through
any chain of references. It runs on its own schedule and can't be called from
code.

GC does not protect from memory leaks: an object that is still referenced by
mistake is reachable, so it is never freed.

## Details

### Algorithms

- **Mark and sweep** is used by all modern engines. The collector starts from
  the roots, marks every object it can reach and frees the rest.
- **Reference counting** frees an object when the number of references to it
  drops to zero. It can't handle cyclic references (two objects that reference
  each other), so engines do not rely on it.
- **Generations.** V8 splits the heap into a young and an old generation. Most
  objects die young, so the young generation is collected often and quickly, and
  the survivors are moved to the old one.

### Typical Memory Leaks

- Intervals that are never cleared.
- Event listeners that are not removed, especially on `window` and `document`.
- Closures that hold large objects. See [Closures](./closures.md).
- Detached DOM nodes: removed from the page but still referenced from code.
- Caches and global collections that only grow.
- Accidental global variables.

### Weak References

`WeakMap` holds its keys weakly and `WeakSet` its values: an entry does not keep
the object alive. `WeakRef` does the same for a single object. They are used for
caches and metadata attached to objects.

## Example

```javascript
let user = { name: 'Ann' };
let admin = user;

user = null; // still reachable through `admin`
admin = null; // unreachable, can be collected

// A cycle is not a problem for mark and sweep
let a = {};
let b = { a };
a.b = b;

a = null;
b = null; // both objects are unreachable and will be collected
```

## Follow-up Questions

- How do you find a memory leak? Compare heap snapshots in the Memory tab of
  DevTools and look for objects that keep growing. See
  [Debugging](../web-platform/tools/debugging.md).
- How do you avoid leaks in a component? Clear timers, remove listeners and
  abort requests when the component is destroyed.

## Common Mistakes

- "The garbage collector prevents memory leaks." Only for unreachable objects.
- "Assigning `null` frees the memory." It only removes one reference; the memory
  is freed later, and only if no other references are left.
- "Cyclic references leak." Not with mark and sweep.
