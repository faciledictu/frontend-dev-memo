---
sidebar_position: 1
description: Imperative vs declarative programming, with examples in JavaScript
---

# Programming Paradigms

A paradigm is a style of structuring code. **Imperative** code says **how**: a
sequence of statements that change state step by step (loops, assignments).
**Declarative** code says **what** result is wanted and leaves the steps to a
library or the language: `map` / `filter` instead of a loop, SQL, CSS, JSX.
**Procedural** and **object-oriented** programming are imperative styles;
**functional** programming is declarative. JavaScript is multi-paradigm and
mixes all of them.

## Details

|              | Imperative                          | Declarative                                   |
| ------------ | ----------------------------------- | --------------------------------------------- |
| Describes    | Steps to perform                    | The desired result                            |
| State        | Mutated in place                    | New values are produced                       |
| Control flow | Explicit: `for`, `if`, `break`      | Hidden in functions and the runtime           |
| Examples     | C, a `for` loop, direct DOM updates | SQL, CSS, HTML, `map` / `filter`, JSX, React  |
| Styles       | Procedural, object-oriented         | Functional, logic, markup and query languages |

- Declarative code is built on imperative code: `Array.prototype.map` is a loop
  inside.
- React is declarative: a component describes what the UI looks like for a
  state, and React computes the DOM updates; `document.createElement` and
  `appendChild` are the imperative way.

## Example

The same task: the names of active users, uppercased.

```javascript
const users = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
  { name: 'Carol', active: true },
];

// Imperative: how to build the result
const names = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].active) {
    names.push(users[i].name.toUpperCase());
  }
}

// Declarative: what the result is
const activeNames = users
  .filter((user) => user.active)
  .map((user) => user.name.toUpperCase());

console.log(names, activeNames); // [ 'ALICE', 'CAROL' ] [ 'ALICE', 'CAROL' ]
```

## Common Mistakes

- Calling recursion declarative: a recursive function still describes the steps;
  what matters is whether the code states the result or the procedure.
- Saying that declarative code has no imperative parts: they are hidden in the
  library, not removed.

## See Also

- [Functional Programming](./fp.md)
- [OOP Principles](./oop-principles.md)
