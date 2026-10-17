---
sidebar_position: 2
description: var, let and const, hoisting and the temporal dead zone
---

# Variables

Variables are declared with `var`, `let` or `const`. They differ in **scope**,
**reassignment** and behavior **before the declaration**.

|                        | `var`       | `let`            | `const`          |
| ---------------------- | ----------- | ---------------- | ---------------- |
| Scope                  | function    | block            | block            |
| Reassignment           | yes         | yes              | no               |
| Redeclaration          | yes         | no               | no               |
| Initializer            | optional    | optional         | required         |
| Access before the line | `undefined` | `ReferenceError` | `ReferenceError` |
| Global object property | yes         | no               | no               |

Use `const` by default, `let` when the variable is reassigned, and avoid `var`.

## Details

### Declaration and Initializer

```javascript
var myVariable = 10;
// `var myVariable` is the declaration, `= 10` is the initializer
```

Identifier names:

- can include letters, digits, `_` and `$`;
- can't begin with a digit;
- are case-sensitive (`myVar` and `MyVar` are different variables);
- are written in camelCase by convention.

### `var`[^1]

- Scoped to the **function**, or global when declared outside any function.
  Blocks (`if`, `for`) do not limit it.
- Without an initializer the value is `undefined`.
- At the top level of a script it adds a property to the global object. In a
  module it is module-scoped.

### `let` and `const`[^2]

- Scoped to the **block**: a pair of curly braces, including `if` and `for`.
- `const` can't be reassigned, so the initializer is required.
- `const` does not make the value immutable. The variable holds a reference to
  the object, and the object itself can still be changed.

### Hoisting and the Temporal Dead Zone

- All declarations are registered when the scope is created, before any code
  runs. This is called hoisting[^3].
- `var` is hoisted with the value `undefined`. The assignment stays in place.
- `let` and `const` are hoisted too, but can't be read until the declaration is
  executed. This period is the **temporal dead zone (TDZ)**.
- The TDZ depends on the order of **execution**, not on the position in the
  file. A function may use a variable declared below it if it is called after
  the declaration.

See [Execution Context](./execution-context.md).

## Example

```javascript
function show() {
  console.log(value);
}

// error-next-line
show(); // ReferenceError: Cannot access 'value' before initialization
const value = 1;
show(); // 1

const user = { name: 'Ann' };
// correct-next-line
user.name = 'Bob'; // OK: the same object is mutated
// error-next-line
user = {}; // TypeError: Assignment to constant variable.
```

## Follow-up Questions

- What does a loop with `var` and `setTimeout` print? See
  [Closures](./closures.md).
- How do you make an object immutable? See [Objects](./objects.md).
- What happens when you assign to an undeclared variable? In strict mode it is a
  `ReferenceError`; otherwise a global variable is created.

## Common Mistakes

- "`const` makes the value constant." Only the binding is constant.
- "`let` and `const` are not hoisted." They are, but they stay in the TDZ.
- "`var` is block-scoped." It ignores blocks and is visible in the whole
  function.

[^1]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var

[^2]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations

[^3]: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
