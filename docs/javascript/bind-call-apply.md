---
sidebar_position: 6
description: bind(), call(), apply()
---

# bind, call and apply

Three methods of `Function.prototype` that set `this` explicitly:

- **`call(thisArg, a, b)`** calls the function immediately, arguments are passed
  **one by one**.
- **`apply(thisArg, [a, b])`** calls the function immediately, arguments are
  passed as **an array**.
- **`bind(thisArg, a, b)`** does not call the function. It returns a **new
  function** with `this` and the first arguments fixed.

## Details

- `bind` can fix arguments as well as `this`. This is partial application.
- A bound function can't be rebound: a second `bind` and `call`/`apply` do not
  change its `this`.
- Arrow functions ignore the `this` argument of all three methods.
- In non-strict mode `null` and `undefined` passed as `this` are replaced with
  the global object.
- With spread syntax, `fn.apply(obj, args)` and `fn.call(obj, ...args)` are
  interchangeable.

See [`this`](./this-keyword.md).

## Example

```javascript
function showThisAndArgs(...args) {
  console.log(this, ...args);
}

showThisAndArgs.call({}, 'a', 'b'); // {} a b
showThisAndArgs.apply({}, ['a', 'b']); // {} a b

const bound = showThisAndArgs.bind({}, 'a', 'b');

bound('c'); // {} a b c
bound.call({ x: 1 }, 'c'); // {} a b c
```

## Follow-up Questions

Write your own `bind`:

```javascript
function bind(fn, thisArg, ...boundArgs) {
  return function (...args) {
    return fn.apply(thisArg, [...boundArgs, ...args]);
  };
}
```

- Where is `bind` used in practice? To keep the context of a method passed as a
  callback and to fix the first arguments of a function.
- What does `bind` do when the bound function is called with `new`? The bound
  `this` is ignored and a new object is created; the fixed arguments are kept.

## Common Mistakes

- Mixing up `call` and `apply`. A mnemonic: `apply` and "array" both start with
  "a".
- "`bind` calls the function." It only returns a new one.
