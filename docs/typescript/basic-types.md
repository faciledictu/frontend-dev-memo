---
sidebar_position: 1
description:
  Primitives, any, unknown, never, void, arrays, tuples, unions and literals
tags: [junior]
---

# Basic Types

TypeScript adds **static types** to JavaScript: they are checked at compile time
and erased from the output. The basic set:

- the seven **primitives** of JavaScript;
- **`any`**, **`unknown`**, **`never`** and **`void`**;
- **arrays** and **tuples**;
- **unions** and **literal types**, usually named with a **type alias**.

The most common question is the difference between the special types:

| Type      | What can be assigned to it | What you can do with it                |
| --------- | -------------------------- | -------------------------------------- |
| `any`     | anything                   | anything, checks are off               |
| `unknown` | anything                   | nothing until it is narrowed           |
| `never`   | nothing                    | nothing: it never has a value          |
| `void`    | `undefined`                | nothing: the function returns no value |

## Details

### Primitives

TypeScript has seven primitive types, matching the primitives in JavaScript:
`boolean`, `number`, `bigint`, `string`, `null`, `undefined`, `symbol`.

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

### Special Types

- `any` represents any type and opts out of type checking. It spreads: anything
  derived from an `any` value is `any` too.

```typescript
let notSure: any = 4;
notSure = 'may be a string';
notSure = false;
```

- `unknown` represents any value, but requires a type check before use. It is
  the safe replacement for `any`.

```typescript
let value: unknown;
value = 'Hello';
// highlight-next-line
if (typeof value === 'string') {
  console.log(value.toUpperCase()); // Safe to use as string
}
```

- `void` is used for functions that return no value.

```typescript
function warnUser(): void {
  console.log('This is my warning message');
}
```

:::note

A callback typed as returning `void` may still return a value: it is simply
ignored.[^1] This is why `items.forEach((item) => list.push(item))` compiles,
although `push` returns a number.

:::

- `never` represents values that never occur: the result of a function that
  always throws or never returns, and what is left of a union when every variant
  has been handled (an exhaustive check).

```typescript
function fail(message: string): never {
  throw new Error(message);
}

type Shape = 'circle' | 'square';

function area(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return 3.14;
    case 'square':
      return 1;
    default: {
      // A compile error appears here if a new variant is added to Shape
      // highlight-next-line
      const unreachable: never = shape;
      return unreachable;
    }
  }
}
```

### Arrays

Arrays of any length are typed with `type[]` or `Array<type>`. Both work for any
element type.

```typescript
const list: number[] = [1, 2, 3];
const sameList: Array<number> = [1, 2, 3];
```

### Tuples

A tuple represents an array with a fixed number of elements, where each element
can have a different type.

```typescript
const x: [string, number] = ['hello', 10];
```

### Union Types

A union type allows a value to be one of several types. To use something that
only one of the variants has, the type has to be [narrowed](./narrowing.md)
first, for example with `typeof`.

```typescript
let value: number | string;
value = 42;
value = 'hello';
```

### Literal Types

Literal types let you specify the exact value a string, number, or boolean must
have.

```typescript
let direction: 'up' | 'down' | 'left' | 'right';
direction = 'up';
```

### Type Inference

TypeScript infers types from the assigned values, so most local variables need
no annotation. A `const` gets a literal type, a `let` gets the wider one.

```typescript
let score = 100; // inferred as number
const max = 100; // inferred as 100

// error-next-line
score = 'high'; // Error: Type 'string' is not assignable to type 'number'.
```

### Type Aliases

A type alias gives a name to any type: a union, a tuple, a function or an object
shape. For object shapes see [Objects and Interfaces](./objects.md).

```typescript
type Direction = 'up' | 'down' | 'left' | 'right';

let current: Direction = 'up';
current = 'down';
```

## Follow-up Questions

- What is the difference between `any` and `unknown`? Both accept any value;
  with `any` you can also do anything, with `unknown` nothing until it is
  narrowed. See [Type Narrowing](./narrowing.md).
- Where does `never` come from? A function that always throws, the `default` of
  an exhaustive `switch`, and an impossible type such as `string & number`.
- What is the difference between `void` and `undefined` as a return type? `void`
  says the result is ignored, so a callback typed `() => void` may return
  anything; `undefined` is a value the caller can use.
- Do types exist at runtime? No, they are erased. Runtime checks are plain
  JavaScript: `typeof`, `instanceof`, `Array.isArray`.

## Common Mistakes

- `any` for data from outside (`response.json()`, `JSON.parse`) instead of
  `unknown` plus a type guard.
- `Number`, `String`, `Boolean` with a capital letter as types: these are the
  wrapper objects; the primitives are lowercase.
- Annotating what is inferred (`const count: number = 0`) while leaving function
  parameters without types.

## See Also

- [Objects and Interfaces](./objects.md)
- [Type Narrowing and Type Guards](./narrowing.md)
- [Enums](./enums.md)

[^1]:
    [TypeScript FAQ: Why are functions returning non-void assignable to function returning void?](https://github.com/microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void)
