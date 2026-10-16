---
sidebar_position: 9
description:
  Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract,
  NonNullable, ReturnType, Parameters, Awaited and NoInfer
tags: [junior, middle]
---

# Utility Types

**Utility types** are built-in generic types that transform other types, so a
related type is derived instead of written by hand and stays in sync with the
original. The most used:

- for objects: **`Partial`**, **`Required`**, **`Readonly`**, **`Pick`**,
  **`Omit`**, **`Record`**;
- for unions: **`Exclude`**, **`Extract`**, **`NonNullable`**;
- for functions and promises: **`ReturnType`**, **`Parameters`**, **`Awaited`**.

They are ordinary types written with
[mapped and conditional types](./type-operators.md), not compiler magic.

Applies to: TypeScript 7.0.

## Details

### Objects

| Type           | What it does                             | Typical use                                  |
| -------------- | ---------------------------------------- | -------------------------------------------- |
| `Partial<T>`   | all properties optional                  | update payloads, options with defaults       |
| `Required<T>`  | all properties required (removes `?`)    | config after defaults are applied            |
| `Readonly<T>`  | all properties `readonly`                | props, state, values that must not change    |
| `Pick<T, K>`   | only the keys `K`; `K` must be keys of T | a smaller view of a type                     |
| `Omit<T, K>`   | all keys except `K`; `K` is not checked  | input types without `id` or server fields    |
| `Record<K, V>` | an object with keys `K` and values `V`   | dictionaries, a lookup by every union member |

- `Partial` and `Readonly` are **shallow**: nested objects keep their types.
- `Readonly` is compile-time only. At runtime the object can still be changed;
  use `Object.freeze` for that.
- `Record<'a' | 'b', V>` requires **every** key. For a dictionary with any
  string key, `Record<string, V>` returns `V` on access, not `V | undefined`,
  unless [`noUncheckedIndexedAccess`](./tsconfig.md) is on.

### Unions

| Type             | What it does                             | Example                                          |
| ---------------- | ---------------------------------------- | ------------------------------------------------ |
| `Exclude<U, E>`  | removes members of `U` assignable to `E` | `Exclude<'a' \| 'b' \| 'c', 'a'>` → `'b' \| 'c'` |
| `Extract<U, E>`  | keeps members of `U` assignable to `E`   | `Extract<string \| number, number>` → `number`   |
| `NonNullable<T>` | removes `null` and `undefined`           | `NonNullable<string \| null>` → `string`         |

`Pick` and `Omit` work on **keys** of an object; `Exclude` and `Extract` work on
**members** of a union.

### Functions and Promises

| Type                       | What it does                                  |
| -------------------------- | --------------------------------------------- |
| `ReturnType<F>`            | the return type of a function type            |
| `Parameters<F>`            | the parameter types as a tuple                |
| `Awaited<T>`               | the value of a promise, unwrapped recursively |
| `ConstructorParameters<C>` | the parameters of a class constructor         |
| `InstanceType<C>`          | the type of an instance of a class            |
| `NoInfer<T>`               | blocks inference from this position (TS 5.4)  |

- They take a **type**, so a function value needs `typeof`:
  `ReturnType<typeof fetchUser>`.
- `Awaited<ReturnType<typeof fetchUser>>` is the type of the data an async
  function resolves to.
- String helpers (`Uppercase`, `Capitalize` and others) are described in
  [Type Operators](./type-operators.md#template-literal-types).

## Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

type CreateUserInput = Omit<User, 'id' | 'createdAt'>; // name, email
type UpdateUserInput = Pick<User, 'id'> & Partial<CreateUserInput>;
type UserPreview = Pick<User, 'id' | 'name'>;

type Role = 'admin' | 'editor' | 'viewer';
const permissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
}; // a missing role is a compile error

async function fetchUser(id: number) {
  return { id, name: 'Ann' };
}

type FetchUserArgs = Parameters<typeof fetchUser>; // [id: number]
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>; // { id: number; name: string }

// NoInfer: the default must be one of the options, not widen them
function pick<T extends string>(options: T[], fallback: NoInfer<T>) {
  return options[0] ?? fallback;
}

pick(['s', 'm', 'l'], 'm');
// error-next-line
pick(['s', 'm', 'l'], 'xl'); // Error: Argument of type '"xl"' is not assignable to parameter of type '"l" | "m" | "s"'.
```

<details>
<summary>Pitfalls of Omit</summary>

```typescript
interface User {
  id: number;
  name: string;
}

// A wrong key in Omit is not an error: K is not checked against the keys
type WithoutName = Omit<User, 'fullName'>; // still has `name`

// Omit on a union is not distributive: it keeps only the common keys
type Shape =
  | { kind: 'circle'; radius: number; color: string }
  | { kind: 'square'; size: number; color: string };

type Uncolored = Omit<Shape, 'color'>; // { kind: 'circle' | 'square' }

// error-next-line
const c: Uncolored = { kind: 'circle', radius: 1 }; // Error: Object literal may only specify known properties, and 'radius' does not exist in type 'Uncolored'.

// A distributive version applies Omit to each member
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

const ok: DistributiveOmit<Shape, 'color'> = { kind: 'circle', radius: 1 };
```

</details>

## Follow-up Questions

- How is `Partial` implemented? `{ [K in keyof T]?: T[K] }`, a mapped type; see
  [Type Operators](./type-operators.md).
- What is the difference between `Omit` and `Exclude`? `Omit` removes keys from
  an object type; `Exclude` removes members from a union. `Omit` is built on
  `Pick` and `Exclude`.
- How do you make a deep `Partial`? A recursive mapped type:
  `{ [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }`.
  Functions and arrays need special cases, so libraries like `type-fest` are
  often used.
- How do you get the type of a component's props?
  `ComponentProps<typeof Button>`; see [Typing React](./react.md).

## Common Mistakes

- `ReturnType<fetchUser>` instead of `ReturnType<typeof fetchUser>`.
- Expecting `Readonly` to freeze an object at runtime, or to be deep.
- Using `Omit` on a discriminated union and losing the members.
- `Partial<User>` for a form that needs some fields: it makes every field
  optional, including the required ones.

## See Also

- [Type Operators](./type-operators.md)
- [Generics](./generics.md)
- [Type Narrowing](./narrowing.md)
