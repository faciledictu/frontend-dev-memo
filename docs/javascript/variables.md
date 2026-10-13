---
sidebar_position: 2
---

# Variables

In JavaScript, there are three keywords used to declare variables: `var`, `let`,
and `const`. A keyword is followed by an identifier name and optionally by a
value.

```javascript
var myVariable = 10;
// `var myVariable` is the declaration, `= 10` is the initializer
```

**A declaration** consists of a keyword followed by an identifier name. **An
initializer** includes an equal sign followed by an initial value.

Identifier names must follow certain rules:

- They can include letters, digits, `_` (underscore) and `$` (dollar sign).
- They can’t begin with a digit.
- They are case-sensitive (`myVar` and `MyVar` are different variables).
- The standard convention is to use camelCase identifiers in JS code.

## Keyword `var`[^1]

`var` is used to declare a variable with an optional initializer. If a variable
is declared without an initializer, it is automatically assigned the value
`undefined`.

When a `var` variable is declared at the top level of code (outside any
function), it’s considered a global variable and is accessible to any code at
any level. In module mode, it becomes module-scoped.

Such variables can also be local, when declared within a function body. In such
cases, they are only accessible within that function.

`var` variables are hoisted (however, it's not an official term)[^3], which
means declarations are lifted, and any code located above the declaration can
access them. Only declarations are hoisted, not initial values.

:::note[Note]

Unlike `let` or `const`, `var` variables can be redeclared in the same scope. If
`var` is declared as a global variable, it adds a property to the global object.

:::

## Keywords `let` and `const`[^2]

Introduced in ES6, `let` and `const` allow you to declare variables that can be
not only global or local but also block-scoped. A block is a portion of code
delimited by a pair of curly braces. If a `const` or `let` variable is declared
within any block (e.g., inside `if` or `for` statement), they are only available
inside this block.

For `let` variables, an initializer is optional, similar to `var`.

Keyword `const` declares a constant whose value can’t be reassigned after its
creation. So an initializer is required. It's worth noting that objects
(including arrays) stored in `const` variables still can be mutated. This
happens because the variable holds only a reference to the object, and while the
reference remains constant, the object's properties can be changed or new ones
can be created.

Variables declared with `let` and `const` can only be accessed after their
declaration.

:::note[Note]

We can say `const` and `let` are in temporal dead zone from the start of the
block to the place where they are declared. They can be accessed by code that is
located before the declaration in the file but executed after it. For example, a
function is declared before a variable that is used in this function. If we call
the function before the variable declaration, the function will have access to
the variable. So only the order of execution matters.

:::

[^1]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var

[^2]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations

[^3]: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
