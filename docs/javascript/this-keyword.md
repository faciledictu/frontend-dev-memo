---
sidebar_position: 5
description: What the `this` keyword refers to in JavaScript
---

# The `this` Keyword

`this` is the **context of a call**. In a regular function it is defined by
**how the function is called**, not where it is declared[^1]:

- `obj.method()`: the object before the dot
- `fn()`: `undefined` in strict mode, the global object otherwise
- `new Fn()`: the newly created object
- `fn.call(obj)`, `fn.apply(obj)`, `fn.bind(obj)`: the passed value
- arrow function: no own `this`, it is taken from the outer scope

## Details

### Strict Mode

In non-strict mode `this` is always an object[^2]:

1. If `this` is `undefined` or `null`, it gets substituted with `globalThis`.
2. If `this` is any other primitive value, it is wrapped in the corresponding
   object.

In strict mode `this` is passed as is. Modules and classes are always
strict[^3].

### Global `this`

Outside of any function, at the top level of a script, `this` refers to the
global object (`globalThis`) in both strict and non-strict mode. At the top
level of a module `this` is always `undefined`.

### Regular Functions

- **A standalone call**: `this` is `undefined` in strict mode and the global
  object in non-strict mode.

```javascript
'use strict';

function showThis() {
  console.log(this);
}

showThis(); // undefined
```

- **A method call**: `this` is the object before the dot.

```javascript
function showThis() {
  console.log(this);
}

const obj1 = {
  a: 1,
  showThis,
};

obj1.showThis(); // { a: 1, showThis: [Function: showThis] }
obj1['showThis'](); // Different syntax, same result
```

- **A callback**: `this` depends on the API that calls it. For example, in a
  handler passed to `addEventListener()` it is the element the handler is
  attached to.

```javascript
function showThis() {
  console.log(this);
}

setTimeout(showThis);
// Depends on the host. E.g.:
// in browser: Window object
// in node: Timeout object
```

- **A constructor call** with `new`: `this` is the newly created object. See
  [Prototypes](./prototypes.md).

```javascript
function ShowThis() {
  this.a = 1;
  console.log(this);
}

new ShowThis(); // ShowThis {a: 1}
```

- **`bind()`, `call()` and `apply()`** set `this` explicitly. See
  [bind, call and apply](./bind-call-apply.md).

```javascript
'use strict';
function showThis() {
  console.log(this);
}

showThis.apply(1); // 1
```

### Arrow Functions

Arrow functions don't have their own `this`. They take it from the scope where
they were defined (not called!), the same way closures read outer variables. It
can't be changed with `bind()`, `call()` or `apply()`.

```javascript
const obj1 = {
  a: 1,
  regular() {
    return this;
  },
  arrow: () => this,
};

console.log(obj1.regular() === obj1); // true
console.log(obj1.arrow() === obj1); // false: `this` of the surrounding code
```

## Example

Losing the context when a method is passed as a callback:

```javascript
const user = {
  nickname: 'Ann',
  greet() {
    console.log(`Hi, ${this?.nickname}`);
  },
};

user.greet(); // Hi, Ann

const greet = user.greet;
greet(); // Hi, undefined: called without an object

setTimeout(user.greet); // Hi, undefined: the same problem
setTimeout(() => user.greet()); // Hi, Ann
setTimeout(user.greet.bind(user)); // Hi, Ann
```

## Follow-up Questions

- How do you keep the context of a method? Wrap the call in an arrow function,
  use `bind()`, or define the method as an arrow function in a class field.
- What is `this` in a class method used as an event handler? The same rules
  apply: without binding it is lost.
- Which rule wins? `new`, then `bind`/`call`/`apply`, then the method call, then
  the default.

## Common Mistakes

- "`this` is the object where the function is declared." For regular functions
  only the call matters.
- "An arrow function used as an object method gets the object as `this`." An
  object literal does not create a scope, so `this` comes from the code around
  the object.
- "At the top level in strict mode `this` is `undefined`." In a script it is the
  global object; it is `undefined` only in modules.

[^1]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

[^2]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#securing_javascript

[^3]: https://tc39.es/ecma262/#sec-strict-mode-code
