---
sidebar_position: 3
description:
  Declaration merging, extends vs intersection, implicit index signatures and
  which one to choose
tags: [junior, middle]
---

# Type vs Interface

For object shapes a **type alias** and an **interface** are almost
interchangeable. The differences:

- only an **interface** supports **declaration merging**: two declarations with
  the same name are combined into one;
- only a **type alias** can name **unions**, tuples, primitives and **mapped or
  conditional types**;
- an interface is extended with **`extends`**, a type with an **intersection
  `&`**; `extends` reports conflicting properties, `&` silently turns them into
  `never`.

Pick one for object shapes and stay consistent. A common rule: `interface` for
objects, `type` for everything else.

Applies to: TypeScript 7.0.

## Details

|                                         | `interface`                     | `type`                                |
| --------------------------------------- | ------------------------------- | ------------------------------------- |
| Object shape                            | yes                             | yes                                   |
| Union, tuple, primitive, mapped         | no                              | yes                                   |
| Extending                               | `extends`, conflicts are errors | `&`, conflicts become `never`         |
| Declaration merging                     | yes                             | no: `Duplicate identifier`            |
| `implements` in a class                 | yes                             | yes, if it is an object type          |
| Assignable to `Record<string, unknown>` | no: no implicit index signature | yes                                   |
| Name in error messages and hover        | always the interface name       | sometimes expanded into the structure |
| Recursive definitions                   | yes                             | yes                                   |

### Declaration Merging

Declarations of an interface with the same name in the same scope are merged.
This is how library and global types are extended:

- adding a property to `Window` (`declare global { interface Window { … } }`);
- **module augmentation**: adding fields to a library type, for example a theme
  type in a styling library
  (`declare module 'library' { interface Theme { … } }`) or `Express.Request`
  (`declare global { namespace Express { … } }`).

The flip side: an interface can be extended by accident if another file declares
the same global name.

### `extends` vs `&`

- `interface B extends A` checks that `B` is compatible with `A`. A property
  with an incompatible type is an error at the declaration.
- `A & B` always succeeds. If both have `id`, one as `string` and one as
  `number`, the property becomes `string & number`, which is `never`, and the
  error appears only where a value is created.
- The compiler caches relations between interfaces, while intersections are
  recomputed. In large codebases `extends` checks faster; the TypeScript
  performance guide recommends interfaces over intersections.

### Implicit Index Signature

A type alias of an object literal type is assignable to a type with an index
signature, such as `Record<string, unknown>`. An interface is not, because it
can be extended later by merging, so the compiler can't be sure about the other
keys. This shows up when an object is passed to a function that accepts
`Record<string, unknown>`.

## Example

```typescript
interface Animal {
  name: string;
  id: string;
}

// error-start
interface Dog extends Animal {
  id: number;
}
// Error: Interface 'Dog' incorrectly extends interface 'Animal'.
//   Types of property 'id' are incompatible.
// error-end

// error-next-line
type Cat = Animal & { id: number }; // no error here: `id` becomes `never`

// error-next-line
const cat: Cat = { name: 'Tom', id: 1 }; // Error: Type 'number' is not assignable to type 'never'.

// Only a type alias can name a union
type Status = 'idle' | 'loading' | 'error';

// Declaration merging
interface Settings {
  theme: string;
}

interface Settings {
  locale: string;
}

const settings: Settings = { theme: 'dark', locale: 'en' };

// Implicit index signature
function logAll(values: Record<string, unknown>) {
  console.log(Object.keys(values));
}

type PointType = { x: number; y: number };
interface PointInterface {
  x: number;
  y: number;
}

const p1: PointType = { x: 1, y: 2 };
const p2: PointInterface = { x: 1, y: 2 };

// correct-next-line
logAll(p1);
// error-start
logAll(p2);
// Error: Argument of type 'PointInterface' is not assignable to parameter of type 'Record<string, unknown>'.
//   Index signature for type 'string' is missing in type 'PointInterface'.
// error-end
```

## Follow-up Questions

- How do you add a property to `window`? Declaration merging inside
  `declare global { interface Window { analytics: Analytics } }` in a module
  file.
- Can a class implement a type alias? Yes, if it is an object type. A union
  can't be implemented.
- Can an interface extend a type alias? Yes, if the alias is an object type or
  an intersection of object types.
- Why does `Record<string, unknown>` accept a `type` but not an `interface`? An
  interface is open to merging, so it gets no implicit index signature.

## Common Mistakes

- "Interfaces are for classes, types are for data." Both work for both.
- "Types are faster" or "interfaces are always faster." Only intersections are
  slower than `extends`; a plain object type and an interface check the same.
- Expecting `A & B` to report conflicting properties like `extends` does.
- Declaring the same interface name in two global scripts and getting a merged
  type by accident.

## See Also

- [Objects and Interfaces](./objects.md)
- [Type Operators](./type-operators.md)
