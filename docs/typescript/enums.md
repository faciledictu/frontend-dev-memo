---
sidebar_position: 6
description: Numeric, string and const enums, and why unions often replace them
---

# Enums

An **enum** is a named set of constants. Unlike most of TypeScript, an enum is
**not erased** at compile time: it becomes a real JavaScript object. For this
reason modern code often uses a **union of string literals** or an **`as const`
object** instead.

Applies to: TypeScript 5.8+ (for `erasableSyntaxOnly`).

## Details

### Kinds of Enums

- **Numeric.** Members are numbered from `0` or from the given initializer. They
  have a **reverse mapping** from value to name. Any expression of type `number`
  can be assigned to a numeric enum, so they are less type-safe. Only a literal
  that is not a member value (`99`) is rejected.
- **String.** Every member needs an initializer. There is no reverse mapping. A
  plain string is not assignable: you have to write `Status.Active`.
- **`const enum`.** Has no object at runtime: the compiler inlines the values
  where they are used. Tools that compile one file at a time (Babel, SWC,
  `isolatedModules`) can't inline a `const enum` declared in another file.

### Why Enums Are Avoided

- They generate runtime code, while almost all the rest of TypeScript is only
  types.
- They can't be removed by "type stripping", which is how Node.js runs
  TypeScript files directly. With `erasableSyntaxOnly` enabled an enum is a
  compile error.
- A union of literals gives the same checks and autocompletion with no runtime
  code.

### Alternatives

- A union type, when only the type is needed:
  `type Status = 'active' | 'blocked'`.
- An `as const` object, when the values are also needed at runtime, for example
  to iterate over them.

## Example

```typescript
enum Direction {
  Up = 1,
  Down,
  Left,
}

console.log(Direction.Down); // 2
console.log(Direction[2]); // 'Down' (reverse mapping)

enum Status {
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
}

const current: Status = Status.Active;
// error-start
const other: Status = 'ACTIVE';
// Error: Type '"ACTIVE"' is not assignable to type 'Status'.
// error-end
```

The same without an enum:

```typescript
const Role = {
  Admin: 'admin',
  User: 'user',
} as const;

type Role = (typeof Role)[keyof typeof Role]; // 'admin' | 'user'

const role: Role = 'admin';
console.log(Object.values(Role)); // ['admin', 'user']
```

## Follow-up Questions

- What does an enum compile to? An object filled inside an immediately invoked
  function; a numeric enum gets both `name → value` and `value → name` keys.
- When is an enum still a reasonable choice? In a codebase that already uses
  them, or when the values come from a backend that describes them as an enum.
- What is the difference between `enum` and `const enum`? A `const enum` leaves
  no object at runtime and can't be iterated.

## Common Mistakes

- "Enums exist only at compile time." Only `const enum` does.
- "String enums have a reverse mapping." Only numeric ones.
- Iterating over a numeric enum with `Object.keys()` and getting both names and
  values.
