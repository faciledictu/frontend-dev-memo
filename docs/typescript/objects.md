---
sidebar_position: 2
description: Object shapes, type vs interface, optional and readonly properties
---

# Objects and Interfaces

The shape of an object is described with a **type alias** or an **interface**.
TypeScript is **structurally typed**: a value fits a type if it has the required
properties, regardless of how it was declared.

`type` vs `interface`:

- For object shapes they are almost interchangeable; pick one and be consistent.
- Only an **interface** supports **declaration merging**: two declarations with
  the same name are combined. It is extended with `extends`.
- Only a **type alias** can name unions, tuples, primitives, and mapped or
  conditional types. Object types are combined with `&`.

## `object` Type

In TypeScript, `object` is a type that represents any non-primitive type,
including arrays, functions, and plain objects created with `{}`.

```typescript
let obj: object;

obj = {}; // Valid
obj = { key: 'value' }; // Valid
obj = []; // Valid
obj = function () {}; // Valid

obj = 42; // Error, 42 is a primitive type
```

:::note

The global `Object` type (with a capital O) is a different thing: it matches
almost any value, including primitives, and should not be used.

:::

## Shape of Objects

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

## Interfaces

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

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

type Cat = Animal & { indoor: boolean };

const myDog: Dog = {
  species: 'Canine',
  breed: 'Labrador',
  bark() {
    console.log('Woof!');
  },
};
```

Declaration merging works only for interfaces. It is used to add fields to types
from libraries and to globals such as `Window`.

```typescript
interface Settings {
  theme: string;
}

interface Settings {
  locale: string;
}

const settings: Settings = { theme: 'dark', locale: 'en' };
```

## Property Modifiers

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

bob.id = 3; // Error: Cannot assign to 'id' because it is a read-only property.
```

## Index Signatures

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
