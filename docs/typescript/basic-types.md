---
sidebar_position: 1
---

# Basic Types and Usage

## Primitives

There are seven primitives in TypeScript that reflect the same primitives in
JavaScript: `boolean`, `number`, `bigint`, `string`, `null`, `undefined`,
`symbol`.

```typescript
let isDone: boolean = false;

let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

let bigNumber: bigint = 123456789012345678901234567890n;

let color: string = 'blue';
color = 'red';

let empty: null = null;

let notAssigned: undefined;

let uniqueId: symbol = Symbol('id');
```

## Special Types

- `any` represents any type. Opt-out of type checking.

```typescript
let notSure: any = 4;
notSure = 'may be a string';
notSure = false;
```

- `unknown` represents any value, but requires type checking before being used.

```typescript
let value: unknown;
value = 'Hello';
if (typeof value === 'string') {
  console.log(value.toUpperCase()); // Safe to use as string
}
```

- `void` is used for functions that do not return any value.

```typescript
function warnUser(): void {
  console.log('This is my warning message');
}
```

:::note

In TypeScript, when a function is expected to return `void`, it means that the
function should not return a meaningful value. However, the function is still
allowed to return `undefined` implicitly or any value that is ignored.[^1]

This is a practical decision to accommodate common JavaScript patterns where the
return value is often irrelevant.

:::

- `never` represents values that never occur. Used for functions that always
  throw an error or never return.

```typescript
function error(message: string): never {
  throw new Error(message);
}
```

## Arrays

To specify arrays that can keep any number of values, the syntax `type[]` or
`Array<type>` is used, which work for any type.

```typescript
const list: number[] = [1, 2, 3];
const list: Array<number> = [1, 2, 3];
```

## Tuples

Represents an array with a fixed number of elements, where each element can have
a different type.

```typescript
const x: [string, number] = ['hello', 10];
```

## Union types

Union types allow a variable to hold more than one type.

```typescript
let value: number | string;
value = 42;
value = 'hello';
```

## Litteral types

Literal types let you specify exact values a string, number, or boolean must
have.

```typescript
let direction: 'up' | 'down' | 'left' | 'right';
direction = 'up';
```

## Usage

### Type Safety

TypeScript enforces type safety by ensuring that variables are used according to
their declared types. This helps catch errors at compile time, making the code
more robust and maintainable.

Trying to assign a value of the wrong type will result in a compilation error.

```typescript
let age: number = 30;
age = 'thirty'; // Error: Type 'string' is not assignable to type 'number'.
```

### Type Inference

TypeScript can infer types based on the assigned values, which reduces the need
for explicit type annotations in many cases:

```typescript
let score = 100; // inferred as number
let message = 'Welcome'; // inferred as string
```

### Type Aliases

Type aliases in TypeScript allow you to create a new name for an existing type.
This can help make your code more readable and manageable.

```typescript
type Direction: 'up' | 'down' | 'left' | 'right';

let direction1: Dicrection = 'up';

let direction2: Dicrection = 'left';

direction1 = 'down'

direction2 = 'up'
```

[^1]:
    https://stackoverflow.com/questions/58885485/why-does-typescript-have-both-void-and-undefined
