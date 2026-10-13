---
sidebar_position: 3
description: Function Declarations, Function Expressions, and Arrow Functions
---

# Functions

A function can be created as a **function declaration**, a **function
expression** or an **arrow function**. Declarations are **hoisted** and can be
called above the line where they are written. Arrow functions have **no own
`this` and `arguments`** and can't be called with `new`.

## Details

### Regular vs Arrow Functions

|                       | Regular function        | Arrow function             |
| --------------------- | ----------------------- | -------------------------- |
| `this`                | set by how it is called | taken from the outer scope |
| `arguments`           | yes                     | no, use rest parameters    |
| `new`                 | can be a constructor    | `TypeError`                |
| `prototype` property  | yes                     | no                         |
| `bind`/`call`/`apply` | change `this`           | can't change `this`        |

See [`this`](./this-keyword.md).

### Function Declarations

Start with the `function` keyword and a name. They are hoisted together with the
body, so they can be called before the declaration.

### Function Expressions

A function created as part of an expression, usually assigned to a variable. It
can be anonymous or named. The variable follows the rules of
[`var`, `let` and `const`](./variables.md), so the function can't be called
before the assignment.

### Arrow Functions

A shorter syntax with `=>`. They are always expressions: assigned to a variable
or passed as a callback. With a single expression as the body, the result is
returned implicitly.

### Parameters

- **Default values** are used when the argument is `undefined`.
- **Rest parameters** (`...rest`) collect the remaining arguments into a real
  array.

### Related Terms

- **First-class functions**: functions are objects. They can be stored in
  variables, passed as arguments and returned.
- **Higher-order function**: takes a function as an argument or returns one
  (`map`, `filter`, `bind`).
- **IIFE**: a function expression that is called immediately,
  `(function () { ... })()`. It was used to create a private scope before
  modules and block-scoped variables.

## Example

```javascript
console.log(sum(1, 2)); // 3

function sum(a, b) {
  return a + b;
}

// multiply(2); // ReferenceError: Cannot access 'multiply' before initialization
const multiply = (a, b = 2, ...rest) => a * b + rest.length;

console.log(multiply(3)); // 6
console.log(multiply(3, 3, 'x', 'y')); // 11

new multiply(1); // TypeError: multiply is not a constructor
```

## Follow-up Questions

- When should an arrow function not be used? As an object method or a
  constructor, and when the callback needs its own `this`.
- What is a pure function? It returns the same result for the same arguments and
  has no side effects.
- What is a closure? See [Closures](./closures.md).

## Common Mistakes

- "Function expressions are hoisted like declarations." Only the variable is
  hoisted, not the function.
- "Arrow functions are just a shorter syntax." They also differ in `this`,
  `arguments` and `new`.
