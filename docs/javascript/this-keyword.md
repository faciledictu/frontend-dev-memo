---
sidebar_position: 5
description: What is ’this’ keyword used for in JavaScript
---

# The ‘this’ Keyword

The `this` keyword in JavaScript is a special identifier that references the
context in which the code is executing[^1].

Its behavior can vary depending on whether the code is running in strict mode or
not[^2].

1. In non-strict mode, `this` always refers to an object. If `this` is
   `undefined` or `null`, it gets substituted with `globalThis`.
2. If `this` points to any other primitive value, that value will be wrapped in
   the corresponding object.

## Global This

Outside of any function, at the top level of a script, `this` refers to the
global object (`globalThis`) in both strict and non-strict mode. At the top
level of a module `this` is always `undefined` (modules also always run in
strict mode[^3]).

## Inside regular functions

For regular functions, `this` is always defined at the time of invocation:

- **For standalone function calls**, `this` is `undefined` in _strict mode_ and
  the global object (`globalThis`) in _non-strict mode_.

```javascript
'use strict';

function showThis() {
  console.log(this);
}

showThis(); // undefined
```

- **For calling as a method** `this` points to the related object (i.e., the
  object preceding the dot)

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

- **When a function is called as a callback**, `this` can be `undefined` or
  another value, depending on the API. For example, when a callback passed to
  `addEventListener()` is invoked, `this` usually refers to the DOM element that
  triggered the event.

```javascript
function showThis() {
  console.log(this);
}

setTimeout(showThis);
// Depends on the host. E.g.:
// in browser: Window object
// in node: Timeout object
```

- **In constructors**, if a function is invoked with the `new` keyword, `this`
  refers to the newly created object. Its internal [[Prototype]] property is set
  to the `prototype` property of the constructor function.

```javascript
function ShowThis() {
  this.a = 1;
  console.log(this);
}

new ShowThis(); // ShowThis {a: 1}
```

- **When using the methods `.bind()`, `.apply()` and `.call()`**, `this` can be
  explicitly redefined by passing its value as an argument.

```javascript
'use strict';
function showThis() {
  console.log(this);
}

showThis.apply(1); // 1
```

## Inside arrow functions

Arrow functions don't have their own `this`. They inherit it from the lexical
environment where they were defined (not called!), the same way closures do.

```javascript
'use strict';
const showThis = () => {
  console.log(this);
};

const obj1 = {
  a: 1,
  showThis,
};

obj1.showThis(); // undefined
```

[^1]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

[^2]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#securing_javascript

[^3]: https://tc39.es/ecma262/#sec-strict-mode-code
