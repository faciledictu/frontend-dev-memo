---
sidebar_position: 2
---

# Variables

In JavaScript, there are three keywords used to declare variables: `var`, `let`,
and `const`. A keyword is followed by an identifier name and optionally by a
value.

<!-- prettier-ignore -->
```javascript
// declaration     // initializer
var myVariable     = 10;
```

**A declaration** consist of keyword followed by an identifier name is called .
**An initializer** includes an equal sign followed by an initial value.

Identifier names must follow certain rules:

- They can include letters, digits, `_`underscore and `$` dollar signs.
- They can’t begin with a digit.
- They are case-sensitive (`myVar` and `MyVar` are different variables).
- The standard convention is to use CamelCase-styled identifiers in JS code.

## Keyword `var`[^5]

`Var` is used to declare a variable with an optional initializer. If a variable
is declared without an initializer, it is automatically assigned the value
`undefined`.

When a `var` variable is declared at the top level of code (outside any
function), it’s considered a global variable and is accessible to any code at
any level. If the code is runnin in a module mode it becames module-scoped.

Variable of this type can also be local, which occurs when they are declared
within a function body. In such cases, they are only accessible within that
function.

`var` variables are hoisted (however it's not official term)[^7], that means
declarations are lifted, and any code located above the declaration can access
them. Although only declarations are hoisted, not initial values.

:::note Note

Unlike `let` or `const`, `var` variables can be redeclared in the same scope. If
`var` is declared as a global variable, it adds a property of global object.

:::

## Keywords `let` and `const`[^6]

Introduced in ES6, `let` and `const` allow you to declare variables that can be
not only global or local but also block-scoped. A block is to a portion of code
delimited by a pair of curly braces. If the `const` or `let` variable are
declared within any block (e.g., inside `if` or `for` statement), they are only
avaliable inside this block.

For `let` variables, an initializer is optional, similar for `var`.

Keyword `const` declares a constant whose value can’t be reassigned after its
creation. So for them an initializer is necessary. It's worth noting that
objects (including arrays) stored in `const` variables still can be mutated.
This happens because variable holds only a reference to the object, and while
the remains constant, the object's properties can be changed or new ones can be
created.

Variables declared with `let` and `const` can only be accessed after their
declaration.

:::note Note

We can say `const` and `let` are in temporal dead zone from the start of the
block to the place where they are declared. They can be accessed by the code,
that located before the declaration in the file but executed after. For example,
the function is declared before the variable, that is used in this function. If
we call the function before the variable declaration, the function will have
access to the variable. So only the order of execution matters.

:::

[^5]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var

[^6]:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations

[^7]: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
