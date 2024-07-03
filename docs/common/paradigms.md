---
sidebar_position: 5
---

# Programming Paradigms

Programming paradigms refer to the fundamental styles or approaches to
programming. They dictate how we structure and organize our code to solve
problems.

## Imperative Programming

Imperative programming focuses on describing _how_ to achieve a task
_step-by-step_. It emphasizes changing program state through statements that
modify mutable variables and data structure.

- Uses statements like assignments, loops, and control structures (if-else,
  switch).
- Directly specifies the sequence of operations and their effects on state.
- Often closely tied to the underlying machine architecture and execution model.

Examples include languages like C, Python (to some extent), and Java.

```javascript
// Example: Computing factorial imperatively

function factorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Example usage:
console.log(factorial(5)); // Output: 120
```

## Declarative Programming

Declarative programming focuses on describing _what_ you want to achieve without
explicitly detailing how to achieve it. It emphasizes expressing the logic of a
computation without describing its control flow.

- Emphasizes what should be accomplished
- Often uses expressions and declarations rather than statements
- Avoids explicit control flow and mutable state
- Often more abstract and high-level

Examples include functional programming languages (like Haskell, Lisp) and SQL
(for database queries).

```javascript
// Example: Computing factorial declaratively using recursion

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

// Example usage:
console.log(factorial(5)); // Output: 120
```
