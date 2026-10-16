---
sidebar_position: 4
description:
  The as syntax, as const, satisfies, non-null assertion and type guards
---

# Type Assertions

A **type assertion** (`value as Type`) tells the compiler to treat a value as a
given type. It is **not a conversion**: nothing is checked or changed at
runtime, so a wrong assertion moves the error from compile time to production.
Use it when you really know more than the compiler (for example, the type of a
DOM element). For external data, prefer **type guards** or validation.

## Details

### Syntax

- `value as Type` is the main form.
- `<Type>value` is the old form. It conflicts with JSX and is not allowed in
  `.tsx` files.
- An assertion is allowed only between related types. To force an unrelated one,
  a double assertion is needed: `value as unknown as Type`. This switches the
  checks off completely.

### Related Operators

- **`as const`** makes a literal read-only and keeps the narrowest type:
  `['a', 'b'] as const` is `readonly ['a', 'b']`, not `string[]`.
- **`satisfies`** checks that a value matches a type but keeps the inferred type
  of the value. Unlike `as`, it can't hide an error.
- **Non-null assertion `value!`** removes `null` and `undefined` from the type.
  It is also unchecked.

### Type Guards Instead of Assertions

A type guard performs a real runtime check, and the compiler narrows the type
from it: `typeof`, `instanceof`, `in`, a function returning `value is Type`, or
a schema validator such as Zod for API responses. See
[Type Narrowing and Type Guards](./narrowing.md).

## Example

Assertions and their safer relatives:

```typescript
const input = document.querySelector('#email') as HTMLInputElement;

const sizes = ['s', 'm', 'l'] as const;
type Size = (typeof sizes)[number]; // 's' | 'm' | 'l'

type Theme = Record<string, string | number>;

const theme = {
  color: 'red',
  gap: 8,
} satisfies Theme;

// correct-next-line
theme.gap.toFixed(); // OK: `gap` is still a number, not `string | number`
```

A type guard for data from an API:

```typescript
interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error('Invalid user data');
  }

  return data; // narrowed to User
}
```

## Follow-up Questions

- What is the difference between `as` and `satisfies`? `as` changes the type and
  can hide a mistake; `satisfies` only checks and keeps the inferred type.
- Why is `const user = {} as User` dangerous? The object has none of the
  required fields, but the compiler believes it does.
- When is an assertion justified? DOM queries, values checked in a way the
  compiler can't see, and tests.

## Common Mistakes

- Calling it "type casting" and expecting a conversion:
  `'5' as unknown as number` is still a string.
- Asserting the result of `response.json()` and trusting it without validation.
- Using `!` to silence the compiler instead of handling `null`.
