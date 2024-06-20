---
sidebar_position: 2
---

# Objects and Interfaces

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

Global `Object` type (with capital O) is another thing.

:::

## Shape of Objects

Shapes of JavaScript objects can be defined in TypeScript by using one of those
syntax.

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

Interfaces can also be extended to create new interfaces that inherit properties
from their parents.

```typescript
// Basic Animal interface
interface Animal {
  species: string;
  age: number;
}

// Extending Animal to create a Mammal interface
interface Mammal extends Animal {
  hasFur: boolean;
}

// Extending Mammal to create a Dog interface
interface Dog extends Mammal {
  breed: string;
  bark(): void;
}

// Creating an object of type Dog
let myDog: Dog = {
  species: 'Canine',
  age: 5,
  hasFur: true,
  breed: 'Labrador',
  bark() {
    console.log('Woof! Woof!');
  },
};

// Using the object
console.log(myDog.species); // Output: Canine
console.log(myDog.breed); // Output: Labrador
myDog.bark(); // Output: Woof! Woof!
```

:::note

Unlike classes, interfaces do not provide implementations of methods.

:::

## Property Modifiers

Optional Properties: use a question mark `?` to denote optional properties.
Read-only Properties: use the `readonly` modifier to make properties immutable.

```typescript
interface User: {
    readonly id: number;
    age?: number; // age is optional
    name: string;
};

const bob: User = {
  id: 1,
  name: "Bob",
  age: 30
};

const alice: User = {
  id: 2,
  name: "Alice"
};

bob.id = 3; // Error: Cannot assign to 'id' because it is a read-only property.
```

## Index Signatures

Ypu can define objects with properties whose names are not known ahead of time.

```typescript
let dictionary: {
  [key: string]: string;
};

dictionary = {
  key1: 'value1',
  key2: 'value2',
};
```
