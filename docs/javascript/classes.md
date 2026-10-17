---
sidebar_position: 13
description: Class syntax, inheritance, private fields and static methods
---

# Classes

A class is a template for creating objects with the same properties and methods.
Classes appeared in ES6 and are **syntax over prototypes**: methods are stored
in `ClassName.prototype`, and `extends` links the prototypes of two classes. See
[Prototypes](./prototypes.md).

Unlike constructor functions, classes:

- can be called only with `new`;
- are not available before the declaration (temporal dead zone);
- always run in strict mode;
- have non-enumerable methods.

## Details

### Basic Syntax

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(
      `Hello, my name is ${this.name} and I am ${this.age} years old.`
    );
  }
}

const person1 = new Person('John', 30);
person1.greet(); // Hello, my name is John and I am 30 years old.
```

### Fields, Getters and Setters

- **Public fields** (`count = 0;`) are own properties created for each instance
  before the constructor body runs. A field holding an **arrow function** keeps
  `this` when the method is passed as a callback.
- **`get` / `set`** define accessor properties on the prototype:
  `get fullName() {}` is read as `user.fullName`.

### Inheritance

The `extends` keyword creates a subclass. A subclass constructor must call
`super()` before using `this`. `super.speak()` calls the parent's method. A
subclass without a constructor gets `constructor(...args) { super(...args); }`
by default.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks.`);
  }
}

const dog1 = new Dog('Rex', 'German Shepherd');
dog1.speak(); // Rex barks.
```

### Private Members

ECMAScript 2022 introduced support for private fields and methods using the `#`
prefix. Private fields and methods are only accessible within the class where
they are defined.

```javascript
class Car {
  #engineStarted = false;

  startEngine() {
    this.#engineStarted = true;
    console.log('Engine started');
  }

  #checkEngine() {
    return this.#engineStarted;
  }

  status() {
    if (this.#checkEngine()) {
      console.log('The engine is running');
    } else {
      console.log('The engine is off');
    }
  }
}

const car1 = new Car();
car1.startEngine(); // Engine started
car1.status(); // The engine is running
```

JavaScript has no **protected** members (accessible in the class and its
subclasses only). A leading underscore (`_name`) is just a naming convention:
the property stays public.

### `instanceof`

It checks whether an object is an instance of a specific class or constructor
function.

```javascript
// assuming this code is executed after the code given above

console.log(dog1 instanceof Animal); // true
console.log(dog1 instanceof Dog); // true
console.log(dog1 instanceof Car); // false
```

### Static Members

Static methods and fields are defined on the class itself, not on instances.
They are used for utility functions and factories. A `static {}` block runs once
when the class is created.

```javascript
class MathUtilities {
  static add(a, b) {
    return a + b;
  }
}

console.log(MathUtilities.add(5, 3)); // 8
```

## Follow-up Questions

- Why must `super()` be called before `this` in a subclass constructor? The
  object is created by the base constructor; until `super()` returns there is no
  `this` (`ReferenceError`).
- How do you keep `this` in a class method used as a callback? Bind it in the
  constructor (`this.handle = this.handle.bind(this)`) or make it an arrow
  function field (`handle = () => {}`). See [`this`](./this-keyword.md).
- Can a class extend several classes? No; use composition or mixins. See
  [OOP Principles](../programming/paradigms/oop-principles.md).

## Common Mistakes

- "Classes are just syntax sugar, nothing else." They also require `new`, are in
  the TDZ, run in strict mode and have non-enumerable methods.
- Passing `obj.method` as a callback and losing `this` (React class components,
  `addEventListener`).
- "`_name` is private." Only `#name` is enforced; the underscore is a
  convention.

## See Also

- [Prototypes](./prototypes.md)
- [The `this` Keyword](./this-keyword.md)
- [OOP Principles](../programming/paradigms/oop-principles.md)
