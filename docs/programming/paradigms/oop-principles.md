---
sidebar_position: 3
description:
  Encapsulation, inheritance, polymorphism and abstraction with TypeScript
  examples, composition over inheritance
---

# OOP Principles

Object-oriented programming models a program as **objects** that combine data
and the methods that work on it. Four principles: **encapsulation** — hide the
internal state, expose a controlled interface; **inheritance** — a class reuses
and extends another class (`extends`); **polymorphism** — different classes are
used through one interface, and each behaves its own way; **abstraction** —
depend on what an object does, not how. Modern code prefers **composition over
inheritance**: build behavior from small parts instead of deep class
hierarchies.

## Details

| Principle     | In TypeScript                                                                   | Gives                                          |
| ------------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| Encapsulation | `private` / `protected` (compile time), `#field` (runtime), getters and setters | Invariants are protected; internals can change |
| Inheritance   | `class B extends A`, `super`, method overriding                                 | Reuse of a base implementation                 |
| Polymorphism  | An interface or base class, several implementations                             | Callers do not depend on concrete classes      |
| Abstraction   | `interface`, `abstract class`                                                   | A contract without implementation details      |

### Composition over Inheritance

- Inheritance couples the subclass to the internals of the base class: a change
  in the base can break every subclass ("fragile base class").
- A hierarchy fixes one axis of variation; a `Button` that is both `Icon` and
  `Toggle` does not fit a tree.
- Composition combines independent pieces: in React, components are composed
  through `children` and props, and logic is shared through hooks. React never
  uses inheritance between components.

## Example

```typescript
// Encapsulation
class Counter {
  #count = 0; // not accessible outside the class

  increment(): number {
    return ++this.#count;
  }
}

// Inheritance and polymorphism
abstract class Shape {
  abstract area(): number;

  describe(): string {
    return `${this.constructor.name} with area ${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number
  ) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }
}

const shapes: Shape[] = [new Circle(1), new Rectangle(2, 3)];
shapes.forEach((shape) => console.log(shape.describe()));
// Circle with area 3.14
// Rectangle with area 6.00

const counter = new Counter();
counter.increment();
console.log(counter.increment()); // 2
```

## Follow-up Questions

- `private` or `#field`? `private` is checked only by the compiler and is a
  normal property at runtime; `#field` is enforced by JavaScript itself.
- Interface or abstract class? An interface is only a type and disappears after
  compilation; an abstract class can hold shared implementation and exists at
  runtime.

## Common Mistakes

- Calling a component that wraps another component "inheritance": that is
  composition.
- Building deep hierarchies for code reuse where a function or a hook would do.

## See Also

- [SOLID Principles](./solid.md)
- [Design Patterns](../patterns.md)
