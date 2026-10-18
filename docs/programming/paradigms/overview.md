---
sidebar_position: 1
description: Imperative vs declarative programming, with examples in JavaScript
tags: [junior, middle]
---

# Programming Paradigms

A **paradigm** is a way of thinking about a program: what it is made of and how
it is described. The main split is between **imperative** programming — the
program is a **sequence of commands** that change the state step by step ("take
the first user, check it, add it to the list, move to the next") — and
**declarative** programming — the program describes **what result is wanted**
("active users' names"), and the language or a library decides how to compute
it. **Procedural** and **object-oriented** programming are kinds of imperative
programming; **functional** and **logic** programming are kinds of declarative.
A paradigm is a property of code, not only of a language: JavaScript is
**multi-paradigm**, and the same task can be written in any of these styles.

## Details

### Imperative vs Declarative

|              | Imperative                     | Declarative                                   |
| ------------ | ------------------------------ | --------------------------------------------- |
| Describes    | Steps to perform               | The desired result                            |
| State        | Changed in place (assignments) | New values are produced from old ones         |
| Control flow | Explicit: `for`, `if`, `break` | Hidden in functions and the runtime           |
| Examples     | A `for` loop, `appendChild`, C | `map` / `filter`, JSX, SQL, CSS, HTML, regexp |

### The Main Paradigms

| Paradigm        | Kind        | The program is…                                                              | Examples                                |
| --------------- | ----------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| Procedural      | Imperative  | Procedures (functions) that run commands over shared data                    | C, Pascal, a plain JS script            |
| Object-oriented | Imperative  | Objects that hold state and expose methods; objects send each other messages | Java, C#, Smalltalk, JS classes         |
| Functional      | Declarative | Expressions built from pure functions over immutable values                  | Haskell, Elm, Clojure, JS array methods |
| Logic           | Declarative | Facts and rules; the runtime searches for answers                            | Prolog, Datalog                         |
| Reactive        | Declarative | Values that depend on other values and update automatically when they change | Spreadsheets, RxJS, signals, MobX       |

Event-driven programming (code reacts to events: clicks, messages, timers) is
how the browser and Node.js run code, whatever the style of the handlers.

### Things That Are Easy to Get Wrong

- Declarative code is built on imperative code: `Array.prototype.map` is a loop
  inside, React calls `appendChild` for you. The imperative part is hidden, not
  removed.
- Functional and declarative are not synonyms: functional programming is one
  declarative style; SQL and CSS are declarative but not functional.
- Object-oriented code is not automatically imperative in every line, and
  functional code is not "code without objects": the paradigm is about how state
  and control flow are handled.
- React is declarative: a component describes what the UI looks like for a given
  state, and React works out the DOM updates.

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

## Follow-up Questions

- FP vs OOP? OOP bundles state with the methods that change it and hides it
  inside objects; FP keeps data and functions separate, avoids changing state
  and passes it explicitly. OOP models entities with identity well (a user
  session, a UI widget); FP fits data transformations (filters, reducers). Most
  JavaScript code mixes both.
- Is JavaScript functional or object-oriented? Both: it has first-class
  functions and closures (functional) and objects with prototypes and classes
  (object-oriented), and it is imperative at its core (mutable variables,
  loops).
- What is structured programming? The discipline behind procedural code (Edsger
  Dijkstra, late 1960s): programs are built only from sequence, branching (`if`)
  and loops, without arbitrary `goto` jumps.
- Is React purely declarative? No: refs and effects (`ref.current.focus()`,
  `useEffect`) are imperative escape hatches for what a description of the UI
  cannot express.

## Common Mistakes

- Calling recursion declarative or imperative by itself: it is neither. A
  recursive definition can be declarative (`factorial(n)` **is**
  `n * factorial(n - 1)`), while recursion that drives mutations step by step is
  imperative.
- Saying that declarative code has no imperative parts: they are hidden in the
  library, not removed.
- "JavaScript is not OOP because it has no real classes." It is object-oriented
  through prototypes; `class` is syntax on top, see
  [OOP Principles](./oop-principles.md).

## See Also

- [Functional Programming](./fp.md)
- [OOP Principles](./oop-principles.md)
