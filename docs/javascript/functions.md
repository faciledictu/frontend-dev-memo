---
sidebar_position: 3
description: Function Declarations, Function Expressions, and Arrow Functions
---

# Functions

## Function Keyword (regular functions)

### Function Declarations

Function declarations define named functions that can be called later in your
code, even before the function declaration itself. They start with the
`function` keyword followed by the function name, a list of parameters in
parentheses, and the function body enclosed in curly braces.

Function declarations are hoisted, meaning they can be declared below the code
that uses them.

### Function Expressions

Function expressions define functions as part of an expression, allowing them to
be assigned to variables. They can be anonymous (without a name) or named. After
declaration they can be invoked by variable name.

## Arrow Functions

Arrow functions use another syntax with the arrow `=>` symbol. They are always
anonymous, meaning they can only be assigned to a variable or used to declare
callbacks in-place. Unlike regular functions, arrow functions don't have their
own `this` keyword. Instead, they inherit it from the outer lexical environment.
This is why they can't be used as constructors. Additionally, arrow functions
don't have their own `arguments` array-like object.
