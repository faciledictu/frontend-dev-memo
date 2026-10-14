---
sidebar_position: 11
description:
  A function that remembers the variables of the scope it was created in
---

# Closures

A **closure** is a function together with the **lexical environment** it was
created in. The function keeps access to the variables of its outer scope even
after the outer function has finished. Every function in JavaScript is a
closure; the term matters when the function **outlives** its outer scope.

## Details

### Where Closures Are Used

- **Private state**: variables that can be changed only through the returned
  functions.
- **Function factories** and helpers such as `once`, `memoize`,
  [`debounce`](./debounce-throttle.md).
- **Callbacks**: event handlers, timers and promise callbacks that use variables
  of the surrounding code.

### What to Watch For

- **The closure sees the variable, not a copy of its value.** It reads the value
  that the variable has at the time of the call.
- **Memory.** Everything the closure references stays in memory while the
  closure itself is reachable. A forgotten handler or timer that references a
  large object is a typical leak. See
  [Garbage Collection](./garbage-collection.md).

## Example

```javascript
function createCounter() {
  let count = 0;

  return {
    increment: () => ++count,
    reset: () => {
      count = 0;
    },
  };
}

const counter = createCounter();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.count); // undefined: the variable is private
```

## Follow-up Questions

What does this code print and how do you fix it?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}
// 3 3 3
```

- `var` creates one variable for the whole loop. All three callbacks close over
  it and run after the loop has ended.
- Fix: `let i` creates a new variable for every iteration, so the output is
  `0 1 2`.

Other questions:

- Why does a closure work at all? A function keeps a reference to the
  environment where it was defined. See
  [Execution Context](./execution-context.md).
- Write `once(fn)` or `memoize(fn)`. Both keep their state in a closure.

## Common Mistakes

- "A closure stores a snapshot of the values." It stores a reference to the
  variables.
- "A closure is a function inside a function." Nesting is not required; what
  matters is the access to outer variables.
