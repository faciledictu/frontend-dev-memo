---
sidebar_position: 11
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

## Basic Syntax

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
person1.greet(); // Output: Hello, my name is John and I am 30 years old.
```

## Inheritance

The `extends` keyword creates a subclass. A subclass constructor must call
`super()` before using `this`.

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

## Private and Protected Properties and Methods

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

## `instanceof` Operator

It checks whether an object is an instance of a specific class or constructor
function.

```javascript
// assuming this code is executed after the code given above

console.log(dog1 instanceof Animal); // true
console.log(dog1 instanceof Dog); // true
console.log(dog1 instanceof Car); // false
```

## Static Methods

Static methods and fields are defined on the class itself, not on instances.
They are used for utility functions and factories.

```javascript
class MathUtilities {
  static add(a, b) {
    return a + b;
  }
}

console.log(MathUtilities.add(5, 3)); // Output: 8
```
