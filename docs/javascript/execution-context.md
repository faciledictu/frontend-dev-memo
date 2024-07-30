---
sidebar_position: 3.5
---

# Execution context

Execution context is the environment in which the JavaScript code is executed.
It defines the state of the JavaScript engine, including variables, objects, and
functions, at a particular point in time.

## Types of Execution Context

There are three main types of execution contexts in JavaScript

### Global Execution Context

- Created when the JavaScript code is initially run.

- It is the default or base execution context.

- In the browser, it is associated with the global object (i.e., window).

### Function Execution Context

- Created whenever a function is called.

- Each function call gets its own execution context.

- Contains arguments, local variables, this value, and the function’s specific
  scope chain.

### Eval Execution Context

Created when the `eval()` function is used to execute code. Code executed inside
`eval()` runs in its own execution context.

## Phases

Each execution context goes through two main phases.

### Creation Phase

The creation of the variable object (VO), the scope chain, and setting the value
of this. Hoisting occurs: variables and function declarations are moved to the
top of their scope.

### Execution Phase

The code is interpreted and executed (assignments happen and functions are
invoked).

## Components of Execution Context

### Variable Object (VO)

Contains function arguments, inner variable and function declarations.

In the global context, it’s the global object. In a function, it’s the
activation object (AO).

### Scope Chain

Consists of the current execution context’s VO and its parent execution
contexts’ VOs. Determines the visibility of variables and functions.

### this Keyword

Special value that depends on how the function was called (e.g., as a method,
constructor, or globally).
