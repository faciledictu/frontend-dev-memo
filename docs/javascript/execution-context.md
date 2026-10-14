---
sidebar_position: 4
description: What the engine creates to run code, hoisting and the scope chain
---

# Execution Context

An **execution context** is the environment the engine creates to run a piece of
code: the global code, a module, or a single function call. It keeps track of
**which variables are visible** (the lexical environment) and **what `this`
is**. Contexts live on the **call stack**: calling a function pushes a new
context, returning from it pops the context.

## Details

### Types

- **Global**: one per script, created before any code runs. Top-level `var` and
  function declarations become properties of the global object; `let`, `const`
  and `class` do not.
- **Function**: a new one for every **call**, not for every function.
- **Module**: each ES module has its own. Top-level `this` is `undefined` and
  declarations are not global.
- **Eval**: for code passed to `eval()`. Rarely relevant.

### What a Context Holds

- **Environment records** that store the identifiers:
  - `LexicalEnvironment` for `let`, `const`, `class` and block scopes;
  - `VariableEnvironment` for `var` and function declarations.
- A reference from each environment to its **outer environment**. This is the
  scope chain.
- The **`this` binding**. See [`this`](./this-keyword.md).

Variable Object and Activation Object are the ES3 names for the same idea. Since
ES5 the specification uses environment records.

### Two Phases

1. **Creation.** Before any line runs, the engine registers all declarations of
   the scope:
   - function declarations are ready to call;
   - `var` variables are set to `undefined`;
   - `let`, `const` and `class` exist but are uninitialized (the temporal dead
     zone).
2. **Execution.** The code runs line by line and assignments happen.

The creation phase is what is called **hoisting**. Nothing is moved in the code.
See [Variables](./variables.md).

### Scope Chain

To resolve a name, the engine looks in the current environment, then in the
outer one, and so on up to the global environment. If the name is not found, it
throws a `ReferenceError`.

The outer environment is the place where the function was **defined**, not where
it was called. This is lexical scope, and it is what makes
[closures](./closures.md) work.

## Example

Creation phase:

```javascript
console.log(a); // undefined
console.log(typeof f); // 'function'
// error-next-line
console.log(b); // ReferenceError: Cannot access 'b' before initialization

var a = 1;
let b = 2;
function f() {}
```

Lexical scope:

```javascript
const x = 'global';

function show() {
  console.log(x);
}

function run() {
  const x = 'local';
  show();
}

run(); // 'global'
```

## Follow-up Questions

- What is the call stack? The stack of execution contexts. Recursion without an
  exit overflows it: `RangeError: Maximum call stack size exceeded`.
- How is a closure related to the execution context? A function keeps a
  reference to the environment it was created in, so that environment outlives
  its context. See [Closures](./closures.md).
- What is the difference between scope and context? Scope is about which
  variables are visible. In everyday speech "context" usually means the value of
  `this`.
- How does asynchronous code get on the stack? See
  [Event Loop](./event-loop.md).

## Common Mistakes

- "Declarations are moved to the top of the scope." They are registered during
  the creation phase; the code is not rearranged.
- "`let` and `const` are not hoisted." They are, but reading them before the
  declaration throws.
- "A context is created for each function." It is created for each call.
- Describing the context through Variable Object and Activation Object. These
  terms are from ES3.
