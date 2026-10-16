---
sidebar_position: 8
description:
  keyof, typeof, indexed access, mapped, conditional and template literal types,
  infer
tags: [middle, senior]
---

# Type Operators

TypeScript can **build types from other types**:

- **`keyof T`** — the union of the keys of `T`;
- **`typeof value`** — the type of a value, in a type position;
- **indexed access `T[K]`** — the type of a property;
- **mapped types** `{ [K in keyof T]: … }` — a new object type built key by key;
- **conditional types** `T extends U ? X : Y` — a type-level `if`, with
  **`infer`** to extract a part of a type;
- **template literal types** `` `on${string}` `` — string literal types built
  from other ones.

[Utility types](./utility-types.md) like `Partial` and `ReturnType` are written
with these operators.

Applies to: TypeScript 7.0.

## Details

### `keyof`, `typeof` and Indexed Access

- `keyof { id: number; name: string }` is `'id' | 'name'`. For a type with a
  string index signature, `keyof` is `string | number`: numeric keys are allowed
  in JavaScript objects too.
- `typeof` in a type position takes the type of a variable or a property:
  `typeof config`, `ReturnType<typeof fetchUser>`. It does not work on arbitrary
  expressions such as calls.
- `T['id']` is the type of one property, `T[keyof T]` is the union of all value
  types, `T[number]` is the element type of an array or a tuple.
- Together they derive types from values: `(typeof ROLES)[number]` for
  `const ROLES = ['admin', 'user'] as const`.

### Mapped Types

- `{ [K in Keys]: Type }` iterates over a union of keys.
- Modifiers: `readonly` and `?` add, `-readonly` and `-?` remove.
- `{ [K in keyof T]: … }` is **homomorphic**: it keeps the `readonly` and `?`
  modifiers of `T`.
- **Key remapping** with `as` renames or filters keys:
  ``[K in keyof T as `get${Capitalize<K & string>}`]``. A key mapped to `never`
  is removed.

### Conditional Types

- `T extends U ? X : Y` picks `X` if `T` is assignable to `U`.
- **Distributive**: when `T` is a bare type parameter and receives a union, the
  condition is applied to each member separately, and the results are joined.
  `NonNullable` and `Exclude` rely on this.
- To switch distribution off, wrap both sides in a tuple: `[T] extends [U]`.
- A bare type parameter that receives `never` gives `never`, because `never` is
  an empty union.
- **`infer X`** declares a type variable inside the condition and captures the
  matching part: `T extends Promise<infer V> ? V : T`. A constraint narrows it:
  `infer N extends number`.

### Template Literal Types

- `` `${A}-${B}` `` with unions produces every combination:
  `` `${'s' | 'm'}-${'x' | 'y'}` `` is `'s-x' | 's-y' | 'm-x' | 'm-y'`.
- Built-in helpers: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.
- Used for event names, CSS values and typed string keys such as
  `` `/users/${number}` ``.

## Example

```typescript
const user = { id: 1, name: 'Ann', email: 'ann@example.com' };

type User = typeof user; // { id: number; name: string; email: string }
type UserKey = keyof User; // 'id' | 'name' | 'email'
type UserValue = User[UserKey]; // string | number

const ROLES = ['admin', 'editor', 'viewer'] as const;
type Role = (typeof ROLES)[number]; // 'admin' | 'editor' | 'viewer'

// Mapped type with key remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};
type UserGetters = Getters<User>; // { getId: () => number; getName: …; getEmail: … }

// Conditional type with infer
type Unwrap<T> = T extends Promise<infer V> ? V : T;
type A = Unwrap<Promise<string>>; // string
type B = Unwrap<number>; // number

// Distributive vs non-distributive
type ToArray<T> = T extends unknown ? T[] : never;
type C = ToArray<string | number>; // string[] | number[]

type ToArrayWhole<T> = [T] extends [unknown] ? T[] : never;
type D = ToArrayWhole<string | number>; // (string | number)[]
```

<details>
<summary>Utility types written by hand</summary>

```typescript
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyRecord<K extends PropertyKey, V> = { [P in K]: V };
type MyExclude<T, U> = T extends U ? never : T;
type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;

// Keep only the keys whose values are functions
type MethodKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => unknown ? K : never;
}[keyof T];

type Api = { url: string; get(): void; post(): void };
type ApiMethods = MethodKeys<Api>; // 'get' | 'post'
```

</details>

## Follow-up Questions

- What is a distributive conditional type? A conditional type over a bare type
  parameter is applied to each member of a union separately.
- How do you get the type of array elements? `T[number]`, or
  `T extends (infer E)[] ? E : never`.
- What is the difference between `keyof typeof obj` and `keyof obj`? `keyof`
  works on types, so a value needs `typeof` first: `keyof typeof obj`.
  `keyof obj` is a syntax error.
- How do you remove a key in a mapped type? Remap it to `never` with `as`.

## Common Mistakes

- Expecting `ToArray<string | number>` to give `(string | number)[]`: the
  conditional type distributes.
- Using a value where a type is expected (`keyof user`) or a type where a value
  is expected.
- Writing complex type-level code where a plain type would do: it is harder to
  read, slower to check and gives worse error messages.

## See Also

- [Utility Types](./utility-types.md)
- [Generics](./generics.md)
