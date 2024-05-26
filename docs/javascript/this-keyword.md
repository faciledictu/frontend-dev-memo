---
sidebar_position: 4
description: What is ’this’ keyword used for in JavaScript
---

# The ‘this’ Keyword

The `this` keyword in JavaScript is a special idetifier that references the
context in which the code is executing[^8].

Its behavior can vary depending on whether the code is running in strict mode or
not[^9].

1. In non-strict mode this always should refer to an object. If this is
   `undefined` or `null`, `this` gets substituted with `globalThis`.
2. If this points to any other primitive value, that value will be wrapped in
   the corresponding object.

## Global This

Outside of any function, `this` refers to `globalThis`, which is `undefined` in
strict mode or the 'global object' in non-strict mode. In code running at a
top-level of a module `this` is always 'undefined' because modules always run in
strict mode[^10].

## Inside regular functions

For regular functions, `this` is always defined at the time of invocation:

- **For standalone function calls**, `this` refers to `globalThis` (as mentioned
  earlier: `undefined` for _strict mode_ and _global object_ for _non-strict_).

```javascript
'use strict';

function showThis() {
  console.log(this);
}

showThis(); // undefined
```

- **For calling as a method** `this` points to the related object (i.e. the
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

- **When a function is calling as a callback** this can refers to `undefined` or
  other value, depends of the API. For example, when a callback passed to
  `addEventListener()` is invoked, `this` usually refers to the DOM element that
  triggered the event.

```javascript
function showThis() {
  console.log(this);
}

setTimeout(showThis);
// Depends on the Host. E. g.:
// in browser: Window object
// in node: Timeout object
```

- **In constrictors**, if function is invoked with the `new` keyword, `this`
  will refer to newly created object. Its internal [[Prototype]] property set to
  the `prototype` propery of the constructor function.

```javascript
function ShowThis() {
  this.a = 1;
  console.log(this);
}

new ShowThis(); // ShowThis {a: 1}
```

- **When using the methods `.bind()`, `.apply()` and `.call()`.**, these can
  explicitly redefine `this` by passing its value as an argument.

```javascript
'use strict';
function showThis() {
  console.log(this);
}

showThis.apply(1); // 1
```

### Inside arrow function

Arrow functions don't have their own this. They inherit it from that lexical
environment, where they were defined (not called!). It works the same way as
closure.

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

[^8]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
[^9]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#securing_javascript
[^10]: https://tc39.es/ecma262/#sec-strict-mode-code
