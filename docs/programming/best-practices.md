---
sidebar_position: 1
description:
  Naming, DRY / KISS / YAGNI and when DRY hurts, Clean Code principles, code
  smells
---

# Best Practices

Code is read far more often than it is written, so the goal is code that is
**easy to understand and safe to change**. **Naming**: names reveal intent,
verbs for functions, nouns for values, `is` / `has` for booleans. **DRY** (Don't
Repeat Yourself): one piece of knowledge lives in one place. **KISS** (Keep It
Simple, Stupid): the simplest solution that works. **YAGNI** (You Aren't Gonna
Need It): do not build what is not needed yet. Robert C. Martin's **Clean Code**
adds small single-purpose functions, comments that explain _why_, and explicit
error handling. **Code smells** (from Martin Fowler's "Refactoring") are signs
that code needs restructuring.

## Details

### Naming

- Names describe purpose and are as short as possible but no shorter:
  `elapsedMs`, not `t` or `timeElapsedInMillisecondsSinceStart`.
- Full words instead of abbreviations; single letters only for loop indices.
- Variables are nouns, collections are plural: `user`, `users`.
- Functions are verbs: `fetchUser`, `formatDate`. Predicates start with `is`,
  `has`, `can`, `should`: `isVisible`, `hasAccess`.
- Named constants instead of magic numbers: `MAX_RETRIES = 3`.
- One convention across the codebase. In JavaScript: `camelCase` for variables
  and functions, `PascalCase` for classes and components, `UPPER_SNAKE_CASE` for
  constants.

### DRY, KISS, YAGNI

| Principle | Means                                                   | Overdone, it becomes                                   |
| --------- | ------------------------------------------------------- | ------------------------------------------------------ |
| DRY       | One source of truth for each rule or piece of knowledge | A shared abstraction over code that only looks similar |
| KISS      | The simplest solution that solves the problem           | Rarely harmful                                         |
| YAGNI     | Build only what is needed now                           | Ignoring requirements that are already known           |

**When DRY hurts.** Two pieces of code that look the same but change for
different reasons are not duplication. Merging them into one function leads to
flags and branches for every caller. "Duplication is far cheaper than the wrong
abstraction" (Sandi Metz); the rule of three: extract on the third repetition,
when the common shape is clear.

### Other Principles

| Principle                       | Means                                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Separation of concerns          | Each part of the code deals with one concern: data, logic, presentation                              |
| Law of Demeter                  | A unit talks only to its direct collaborators: not `order.customer.address.city`                     |
| Composition over inheritance    | Combine small parts instead of building class hierarchies (see [OOP](./paradigms/oop-principles.md)) |
| Fail fast                       | Detect invalid state as early as possible and fail loudly instead of continuing silently             |
| Principle of least astonishment | Code behaves the way its name and context suggest                                                    |
| Boy Scout Rule                  | Leave the code a little cleaner than you found it                                                    |

### Clean Code

The main ideas of Robert C. Martin's "Clean Code":

| Topic          | Advice                                                                          |
| -------------- | ------------------------------------------------------------------------------- |
| Names          | Intention-revealing, searchable, not misleading                                 |
| Functions      | Small, do one thing, few parameters, no hidden side effects                     |
| Comments       | Explain _why_, not _what_; code that needs a "what" comment needs a better name |
| Formatting     | Consistent, automated (Prettier)                                                |
| Error handling | Exceptions instead of error codes, do not return or pass `null` without need    |
| Tests          | As clean as production code, one concept per test                               |
| Classes        | Small, one responsibility, encapsulated details                                 |
| Dependencies   | Separate construction from use, inject dependencies                             |

"Clean Code" (2008) is influential but not gospel: some advice, such as very
short functions and avoiding comments almost entirely, is debated, and the
examples are in Java. The ideas above are the widely accepted part.

### Code Smells

From Martin Fowler's "Refactoring" (with Kent Beck):

| Smell                  | Symptom                                                      |
| ---------------------- | ------------------------------------------------------------ |
| Duplicated code        | The same logic in several places                             |
| Long function          | Hard to name and understand at once                          |
| Large class            | Too many fields and methods ("god class")                    |
| Long parameter list    | Many arguments; group them into an object                    |
| Feature envy           | A method uses another object's data more than its own        |
| Inappropriate intimacy | A class depends on the internals of another                  |
| Primitive obsession    | Strings and numbers instead of small domain types            |
| Data clumps            | The same group of values passed around together              |
| Switch statements      | The same `switch` on a type repeated in many places          |
| Speculative generality | Hooks and parameters for cases that do not exist (see YAGNI) |
| Temporary field        | A field set only in some cases                               |
| Comments               | Comments that compensate for unclear code                    |

The second edition (2018) renames some of them: Insider Trading, Repeated
Switches.

## Follow-up Questions

- Does DRY conflict with KISS? Sometimes: an abstraction that removes
  duplication can make code harder to follow. Prefer clarity until the
  duplication is real.
- Are comments bad? No: comments that explain _why_ (a workaround, a business
  rule, a link to an issue) are valuable; comments that repeat the code are
  noise that goes stale.

## Common Mistakes

- Attributing the list of code smells to "Clean Code": it comes from
  "Refactoring".
- Applying DRY to code that is only accidentally similar.

## See Also

- [SOLID Principles](./paradigms/solid.md)
- [Programming Patterns](./patterns.md)
