---
sidebar_position: 3
description:
  Encapsulation, inheritance, polymorphism and abstraction with TypeScript
  examples, composition over inheritance
tags: [junior, middle]
---

# OOP Principles

Object-oriented programming (OOP) organizes a program around **objects**. An
object is a thing that **holds data** (its state, in fields) and **knows how to
work with it** (its behavior, in methods): a `cart` object has `items` and an
`addItem()` method. A **class** is a template for creating objects of one kind;
each object created from it is an **instance**. Instead of functions that change
shared data from outside, objects change their own state and talk to each other
through methods. OOP is commonly described by four principles:
**encapsulation**, **abstraction**, **inheritance** and **polymorphism**. Modern
code uses inheritance sparingly and prefers **composition**.

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
| Static member  | Belongs to the class itself, not to instances: `Array.from`, `Number.isInteger`                  |

### The Four Principles in Plain Words

Think of a car:

- **Abstraction**: you drive with a steering wheel and pedals; you do not need
  to know how the engine works.
- **Encapsulation**: the engine is under the hood; you cannot change the fuel
  mixture by hand, only through the pedal, so the car stays in a working state.
- **Inheritance**: an electric car is a car: it gets everything a car has and
  adds a battery.
- **Polymorphism**: you press "accelerate" in any car, and each one does it its
  own way — petrol or electric.

### The Four Principles

| Principle     | Strict meaning                                                                                                                                                                                                                                           | In TypeScript / JavaScript                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Encapsulation | Data and the operations on it are bundled in one object, and **the internal state can only be changed through its methods** (information hiding), so the object keeps its **invariants** (rules that must always hold, e.g. a balance is never negative) | `#field` (enforced at runtime), `private` / `protected` (compile time only), getters and setters |
| Abstraction   | Working with an object through **what it does** (its interface), ignoring **how** it does it; the model keeps only the details that matter for the task                                                                                                  | `interface`, `abstract class`, a module's public API                                             |
| Inheritance   | A class (subclass) is defined as an extension of another (superclass): it gets its fields and methods and can add or **override** them. Models an "is a" relation                                                                                        | `class Admin extends User`, `super`, single inheritance only                                     |
| Polymorphism  | **One interface, many implementations**: code written for a type works with any object of that type, and each object responds in its own way                                                                                                             | Overriding methods, interfaces, duck typing                                                      |

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

The classification is Christopher Strachey's (1967), refined by Cardelli and
Wegner (1985); ad hoc polymorphism also covers **coercion** (`'5' * 2` converts
the string). When people say "polymorphism" in OOP, they usually mean subtype
polymorphism.

- Subtype polymorphism works through **dynamic dispatch** (late binding): which
  method runs is decided at runtime by the actual object, not by the declared
  type of the variable. In JavaScript it is the prototype chain lookup.
- JavaScript is **duck-typed** ("if it walks like a duck…"): any object with the
  right methods fits, no common base class needed.
- TypeScript checks types **structurally** — by the shape of the object, not by
  its declared class. Exception: classes with `private`, `protected` or `#`
  members are compatible only with themselves and their subclasses.

### Access Modifiers

| Modifier           | Accessible from              | Enforced                 |
| ------------------ | ---------------------------- | ------------------------ |
| `public` (default) | Anywhere                     | —                        |
| `protected`        | The class and its subclasses | By TypeScript only       |
| `private`          | The class itself             | By TypeScript only       |
| `#field`           | The class itself             | By JavaScript at runtime |

### Coupling and Cohesion

The two measures behind most design advice, including SOLID and composition over
inheritance:

- **Cohesion**: how closely the parts **inside** a module belong together. High
  cohesion is good: a `Cart` class holds cart logic, not email sending.
- **Coupling**: how much a module depends on **other** modules. Low coupling is
  good: a change in one module does not force changes in others.

### Classes and Prototypes in JavaScript

- JavaScript is **prototype-based**: an object inherits directly from another
  object (its prototype) through the prototype chain.
- `class` is mostly syntax on top of prototypes: methods live on
  `ClassName.prototype`, and `extends` links the prototypes. Classes also add
  their own rules: they must be called with `new`, their bodies are in strict
  mode, and they support `#private` fields. See
  [Prototypes](../../javascript/prototypes.md) and
  [Classes](../../javascript/classes.md).
- A class can extend only **one** class; shared behavior from several sources is
  added with composition or mixins.

### Composition over Inheritance

"Favor object composition over class inheritance" is a principle from the GoF
book "Design Patterns" (1994). Inheritance is the strongest coupling between two
classes: the subclass depends on the internals of the base class.

- **Fragile base class**: a change in the base class can break every subclass.
- **One axis of variation**: a hierarchy splits objects by one criterion; a
  `Button` that is both `IconButton` and `ToggleButton` does not fit a tree.
- **Composition** ("has a" instead of "is a"): an object holds other objects and
  delegates work to them, so parts are combined and replaced freely.
- In React, components are composed through `children` and props, and logic is
  shared through hooks; the (legacy) React docs say the team found no use cases
  for component inheritance hierarchies.
- Inheritance still fits a true "is a" relation with a stable base: `Error`
  subclasses, framework base classes.

### Where OOP Comes From

- **Simula** (1960s) introduced classes and objects; **Smalltalk** (1970s, Alan
  Kay, who coined the term "object-oriented") made "everything is an object,
  objects communicate by messages" the core idea.
- C++, Java and C# made class-based OOP mainstream; JavaScript followed **Self**
  with prototypes.

## Example

```typescript
// Encapsulation: the count changes only through increment()
class Counter {
  #count = 0; // not accessible outside the class

  increment(): number {
    return ++this.#count;
  }
}

// Abstraction, inheritance and polymorphism
abstract class Shape {
  abstract readonly name: string;
  abstract area(): number;

  describe(): string {
    return `${this.name} with area ${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  readonly name = 'Circle';
  readonly radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  readonly name = 'Rectangle';
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

// One call, different behavior: dynamic dispatch picks the right area()
const shapes: Shape[] = [new Circle(1), new Rectangle(2, 3)];
// highlight-next-line
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
- What is a mixin? A class factory
  `const Serializable = (Base) => class extends Base { … }` that adds behavior
  to any base class.
- What does `instanceof` check? By default, whether `Class.prototype` is in the
  object's prototype chain (`static [Symbol.hasInstance]` can override it), so
  it fails across realms (iframes; use `Array.isArray`) and for duck-typed
  objects. See [Prototypes](../../javascript/prototypes.md).

## Common Mistakes

- Defining encapsulation only as "private fields": its point is that the state
  changes only through the object's methods.
- Mixing up abstraction and encapsulation.
- Calling a component that wraps another component "inheritance": that is
  composition.
- Building deep hierarchies for code reuse where a function or a hook would do.
- Equating polymorphism with overloading: overloading is ad hoc polymorphism; in
  OOP "polymorphism" usually means subtype polymorphism, a method chosen by the
  object at runtime.

## See Also

- [SOLID Principles](./solid.md)
- [Prototypes](../../javascript/prototypes.md)
- [Design Patterns](../patterns.md)
