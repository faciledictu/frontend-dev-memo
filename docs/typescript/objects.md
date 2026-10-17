---
sidebar_position: 2
description:
  Object shapes, interfaces, optional and readonly properties, index signatures
tags: [junior]
---

# Objects and Interfaces

The shape of an object is described with a **type alias** or an **interface**.
TypeScript is **structurally typed**: a value fits a type if it has the required
properties, regardless of how it was declared.

For object shapes the two are almost interchangeable; the differences are on a
separate page: [Type vs Interface](./type-vs-interface.md).

## Details

### `object` Type

In TypeScript, `object` is a type that represents any non-primitive type,
including arrays, functions, and plain objects created with `{}`.

```typescript
let obj: object;

// correct-start
obj = {};
obj = { key: 'value' };
obj = [];
obj = function () {};
// correct-end

// error-next-line
obj = 42; // Error: Type 'number' is not assignable to type 'object'.
```

:::note

The global `Object` type (with a capital O) and the empty type `{}` are
different things: they match any value except `null` and `undefined`, including
primitives, and should not be used for "any object".

:::

### Shape of Objects

Shapes of JavaScript objects can be defined in TypeScript by using one of these
syntaxes.

```typescript
// Inline, anonymous
const person: { name: string; age: number } = {
  name: 'John',
  age: 30,
};

// Using type aliases, named
type User = {
  name: string;
  age: number;
};

const user: User = {
  name: 'Alice',
  age: 25,
};
```

### Interfaces

Another way of defining the structure of an object is to use named interfaces.

```typescript
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: 'John',
  age: 30,
};
```

An interface can extend other interfaces. With type aliases the same is done
with an intersection.

```typescript
interface Animal {
  species: string;
}

// highlight-next-line
interface Dog extends Animal {
  breed: string;
  bark(): void;
}

// highlight-next-line
type Cat = Animal & { indoor: boolean };

const myDog: Dog = {
  species: 'Canine',
  breed: 'Labrador',
  bark() {
    console.log('Woof!');
  },
};
```

Only interfaces support declaration merging, which is used to add fields to
library types and globals such as `Window`; see
[Type vs Interface](./type-vs-interface.md#declaration-merging).

### Property Modifiers

- Optional properties: use a question mark `?` to denote optional properties.
- Read-only properties: use the `readonly` modifier to forbid reassignment. It
  is a compile-time check only and it is shallow.

```typescript
interface User {
  readonly id: number;
  age?: number; // age is optional
  name: string;
}

const bob: User = {
  id: 1,
  name: 'Bob',
  age: 30,
};

const alice: User = {
  id: 2,
  name: 'Alice',
};

// error-next-line
bob.id = 3; // Error: Cannot assign to 'id' because it is a read-only property.
```

### Index Signatures

An index signature describes objects whose property names are not known ahead of
time. `Record<string, string>` is a shorter way to write the same type.

```typescript
let dictionary: {
  [key: string]: string;
};

dictionary = {
  key1: 'value1',
  key2: 'value2',
};
```

## Follow-up Questions

- What is structural typing? Compatibility is decided by shape, not by the
  declared name: any object with `name: string` and `age: number` is a `User`.
- Why is an extra property an error in a literal but not in a variable? Excess
  property checking applies only to a fresh object literal assigned directly; a
  value stored in a variable may have more properties than the type lists.
- What is the difference between `prop?: string` and `prop: string | undefined`?
  The first may be omitted; the second must be present, even as `undefined`.
  With [`exactOptionalPropertyTypes`](./tsconfig.md) the first rejects an
  explicit `undefined`.
- Is `readonly` the same as `const`? `const` forbids reassigning the variable,
  `readonly` forbids reassigning the property. Both are compile-time only.

## Common Mistakes

- Expecting `readonly` to freeze the object at runtime or to apply to nested
  objects.
- Reading `dictionary.missing` from an index signature and getting `string`, not
  `string | undefined`, unless `noUncheckedIndexedAccess` is on.

## See Also

- [Type vs Interface](./type-vs-interface.md)
- [Utility Types](./utility-types.md)
- [tsconfig and Strict Mode](./tsconfig.md)
