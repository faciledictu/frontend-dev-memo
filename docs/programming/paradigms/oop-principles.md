---
sidebar_position: 3
description:
  Encapsulation, inheritance, polymorphism and abstraction with TypeScript
  examples, composition over inheritance
---

# OOP Principles

Object-oriented programming (OOP) organizes a program around **objects**. An
object is a thing that **holds data** (its state, in fields) and **knows how to
work with it** (its behavior, in methods): a `cart` object has `items` and an
`addItem()` method. A **class** is a template for creating objects of one kind;
each object created from it is an **instance**. Instead of functions that change
shared data from outside, objects change their own state and talk to each other
through methods. OOP is described by four principles: **encapsulation**,
**abstraction**, **inheritance** and **polymorphism**. Modern code uses
inheritance sparingly and prefers **composition**.

## Details

### Basic Terms

| Term           | Meaning                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------ |
| Object         | State (fields) + behavior (methods) as one unit                                                  |
| Class          | A template that describes the fields and methods of its instances                                |
| Instance       | An object created from a class: `new Cart()`                                                     |
| Constructor    | The method that initializes a new instance                                                       |
| Interface      | A set of methods and properties an object must have, without implementation (in TS, only a type) |
| Abstract class | A class that cannot be instantiated; it may contain both implemented and `abstract` methods      |
| Static member  | Belongs to the class itself, not to instances: `Math.max`, `Array.from`                          |

### The Four Principles

| Principle     | Strict meaning                                                                                                                                                                       | In TypeScript / JavaScript                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Encapsulation | Data and the operations on it are bundled in one object, and **the internal state can only be changed through its methods** (information hiding), so the object keeps its invariants | `#field` (enforced at runtime), `private` / `protected` (compile time only), getters and setters |
| Abstraction   | Working with an object through **what it does** (its interface), ignoring **how** it does it; the model keeps only the details that matter for the task                              | `interface`, `abstract class`, a module's public API                                             |
| Inheritance   | A class (subclass) is defined as an extension of another (superclass): it gets its fields and methods and can add or **override** them. Models an "is a" relation                    | `class Admin extends User`, `super`, single inheritance only                                     |
| Polymorphism  | **One interface, many implementations**: code written for a type works with any object of that type, and each object responds in its own way                                         | Overriding methods, interfaces, duck typing                                                      |

**Abstraction vs encapsulation** (a frequent question): abstraction decides
**what to show** — the interface; encapsulation **protects what is hidden** —
the state behind that interface. An interface is abstraction; a `#private` field
is encapsulation.

### Kinds of Polymorphism

| Kind                | Idea                                                   | Example                                                  |
| ------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| Subtype (inclusion) | A subtype is used where the base type is expected      | `shape.area()` for a `Circle` or a `Rectangle`           |
| Parametric          | The same code works for any type                       | Generics: `Array<T>`, `function first<T>(items: T[]): T` |
| Ad hoc              | Different implementations for different argument types | Function overloads in TS, `+` for numbers and strings    |

When people say "polymorphism" in OOP, they usually mean subtype polymorphism.
JavaScript is **duck-typed** ("if it walks like a duck…"): any object with the
right methods fits, no common base class needed; TypeScript checks this
**structurally** — by the shape of the object, not by its declared class.

### Classes and Prototypes in JavaScript

- JavaScript is **prototype-based**: an object inherits directly from another
  object (its prototype) through the prototype chain.
- `class` is syntax on top of prototypes: methods live on `ClassName.prototype`,
  and `extends` links the prototypes. See
  [Prototypes](../../javascript/prototypes.md) and
  [Classes](../../javascript/classes.md).
- A class can extend only **one** class; shared behavior from several sources is
  added with composition or mixins.

### Composition over Inheritance

Inheritance is the strongest coupling between two classes: the subclass depends
on the internals of the base class.

- **Fragile base class**: a change in the base class can break every subclass.
- **One axis of variation**: a hierarchy splits objects by one criterion; a
  `Button` that is both `IconButton` and `ToggleButton` does not fit a tree.
- **Composition** ("has a" instead of "is a"): an object holds other objects and
  delegates work to them, so parts are combined and replaced freely.
- In React, components are composed through `children` and props, and logic is
  shared through hooks; the React docs recommend composition instead of
  inheritance between components.
- Inheritance still fits a true "is a" relation with a stable base: `Error`
  subclasses, framework base classes.

### Where OOP Comes From

- **Simula** (1960s) introduced classes and objects; **Smalltalk** (1970s, Alan
  Kay) made "everything is an object, objects communicate by messages" the core
  idea.
- C++, Java and C# made class-based OOP mainstream; JavaScript followed **Self**
  with prototypes.

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
- What is method overriding vs overloading? Overriding: a subclass replaces a
  method of the base class (subtype polymorphism). Overloading: several
  signatures of one function for different arguments (ad hoc polymorphism); in
  TypeScript only the signatures are overloaded, the implementation is one.
- Is OOP possible without classes? Yes: JavaScript objects with methods and
  closures, or prototypes via `Object.create`, give encapsulation and
  polymorphism without `class`.

## Common Mistakes

- Defining encapsulation only as "private fields": its point is that the state
  changes only through the object's methods.
- Mixing up abstraction and encapsulation.
- Calling a component that wraps another component "inheritance": that is
  composition.
- Building deep hierarchies for code reuse where a function or a hook would do.

## See Also

- [SOLID Principles](./solid.md)
- [Prototypes](../../javascript/prototypes.md)
- [Design Patterns](../patterns.md)
