---
sidebar_position: 5
description:
  typeof, instanceof, in, equality, discriminated unions, type predicates and
  assertion functions
tags: [junior, middle]
---

# Type Narrowing and Type Guards

**Narrowing** is how the compiler refines a wide type, such as a union or
`unknown`, to a more specific one inside a branch of code. It follows **control
flow**: after a runtime check, the type in the branch matches what the check
proved.

A **type guard** is the check itself: `typeof`, `instanceof`, `in`, a comparison
or a function that returns **`value is Type`**. A **discriminated union** is a
union whose members share a literal field (`kind`, `type`, `status`); checking
that field narrows to one member.

Applies to: TypeScript 7.0.

## Details

### Built-in Guards

| Check                   | Narrows                                     | Watch out                                               |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `typeof x === 'string'` | primitives, `function`, `object`            | `typeof null` is `'object'`: `null` stays in the type   |
| `x instanceof Date`     | instances of a class                        | does not work for interfaces and types: they are erased |
| `'swim' in x`           | union members that have (or may have) a key | on an `object` adds the key with type `unknown`         |
| `x === 'a'`, `x === y`  | to the literal or the common type           | —                                                       |
| `x != null`             | removes both `null` and `undefined`         | `!== null` removes only `null`                          |
| `if (x)` (truthiness)   | removes `null`, `undefined`, `false`        | also drops `0`, `''` and `NaN` at runtime               |
| `Array.isArray(x)`      | to an array type                            | on `unknown` gives `any[]`                              |
| assignment `x = 'a'`    | to the type of the assigned value           | —                                                       |
| `switch (x.kind)`       | each `case` to its union member             | —                                                       |

### Discriminated Unions

- Each member has a property with a **literal type**: `{ kind: 'circle' }`,
  `{ kind: 'square' }`.
- `if (shape.kind === 'circle')` or `switch (shape.kind)` narrows the whole
  object, so the fields of that member become available.
- It also works after destructuring: `const { kind } = shape`.
- An **exhaustive check** with `never` in `default` turns a forgotten member
  into a compile error (see [Basic Types](./basic-types.md#special-types)).
- The common model for API states, reducer actions and component props:
  `{ status: 'success'; data: T } | { status: 'error'; error: Error }`.

### User-Defined Type Guards

- A **type predicate**: a function returning `value is Type`. The compiler does
  not check its body; it trusts the result. A wrong predicate is as unsafe as
  [`as`](./type-assertions.md).
- Since TypeScript 5.5 a predicate is **inferred** for simple functions without
  a return type annotation: `(x) => x !== undefined` gets the predicate
  `x is T`. That is why `items.filter((x) => x !== undefined)` returns `T[]`.
- An **assertion function** returns `asserts value is Type` or
  `asserts condition`. It throws if the check fails, and after the call the type
  is narrowed for the rest of the scope. It must be called through a name with
  an explicit type: a function declaration, or a `const` with a type annotation.

### When Narrowing Is Lost

- **In callbacks**, for a `let` variable or a parameter that is reassigned after
  the callback is created: the callback may run later, after the value changed.
  A `const` always stays narrowed; since TypeScript 5.4 so does a `let` or a
  parameter that is not reassigned after the callback is created.
- **Through a function annotated as returning `boolean`**: the compiler does not
  look inside, so `isString(x): boolean` narrows nothing. Without the annotation
  a simple check gets an inferred predicate (TypeScript 5.5); a complex body
  does not.
- **For the object when a property is checked**: `if (res.data !== null)`
  narrows `res.data`, but not `res` itself. The object is narrowed only when it
  is a union and the property is its discriminant.

## Example

```typescript
type Shape =
  { kind: 'circle'; radius: number } | { kind: 'square'; size: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2; // shape: { kind: 'circle'; … }
    case 'square':
      return shape.size ** 2;
    default:
      return shape satisfies never; // error if a new kind is added
  }
}

function format(value: string | number | Date | null) {
  if (value == null) return '—';
  if (typeof value === 'string') return value.trim();
  if (value instanceof Date) return value.toISOString();
  return value.toFixed(2); // number
}

// typeof null is 'object'
function describe(value: object | string | null) {
  if (typeof value === 'object') {
    // error-next-line
    return value.toString(); // Error: 'value' is possibly 'null'.
  }
  return value;
}
```

<details>
<summary>Type predicates and assertion functions</summary>

```typescript
interface Fish {
  swim(): void;
}
interface Bird {
  fly(): void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return 'swim' in pet;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly(); // the else branch is narrowed too
  }
}

// Inferred type predicate
const ids = [1, undefined, 3].filter((id) => id !== undefined); // number[]

// Assertion function
function assertDefined<T>(
  value: T,
  message: string
): asserts value is NonNullable<T> {
  if (value == null) throw new Error(message);
}

function getRoot() {
  const root = document.getElementById('root'); // HTMLElement | null
  assertDefined(root, 'No #root element');
  return root; // HTMLElement
}

// Narrowing in a callback
function scheduleLog(value: string | null) {
  if (value === null) return;
  setTimeout(() => console.log(value.length)); // OK: value is never reassigned
}
```

</details>

## Follow-up Questions

- What is the difference between a type guard and a type assertion? A guard is a
  real runtime check, and the compiler narrows from it. An assertion (`as`)
  checks nothing; see [Type Assertions](./type-assertions.md).
- Why does `instanceof` not work with an interface? Interfaces are erased at
  compile time, and `instanceof` needs a constructor at runtime. Check a
  discriminant or a property with `in` instead.
- How do you validate an API response? A type predicate written by hand, or a
  schema validator (Zod, Valibot) that both checks and infers the type.
- What is `satisfies never` in `default`? An exhaustive check: if a member of
  the union is not handled, the remaining type is not `never` and the line
  fails.

## Common Mistakes

- Treating `typeof x === 'object'` as "a non-null object".
- `if (count)` for a number: `0` is falsy, so a valid value goes to the wrong
  branch. Compare with `null` or `undefined` instead.
- Writing a predicate that does not match its check, for example `x is User`
  that only checks `'id' in x`. The compiler trusts it.
- Using optional fields instead of a discriminated union:
  `{ data?: T; error?: Error }` allows both and neither.

## See Also

- [Type Assertions](./type-assertions.md)
- [Basic Types](./basic-types.md)
- [Typing React](./react.md)
