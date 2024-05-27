---
sidebar_position: 10
---

# Classes

Classes in JavaScript are a blueprint for creating objects with predefined
properties and methods. They were introduced in ECMAScript 6 (ES6) and provide a
more convenient and clearer syntax for object-oriented programming compared to
traditional prototype-based inheritance.

Class syntax enables the creation of OOP-like, modular, reusable, and
maintainable code in modern JavaScript.

## Basic Syntax

Here's the basic syntax for defining a class in JavaScript:

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

JavaScript allows one class to extend another, enabling the creation of a
hierarchy of classes that share common functionality. The extends keyword is
used to create a subclass.

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

ECMAScript 2022 introduced supports private fields and methods using the #
prefix. Private fields and methods are only accessible within the class they are
defined.

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

JavaScript does not have a built-in concept of **protected** properties are
properties that are accessible within the class and its subclasses but not
outside. However, you can simulate protected properties using naming conventions
(such as a leading underscore) and by controlling access through getters and
setters.

## instanceof Operator

Used to check if an object is an instance of a specific class or constructor
function.

```javascript
// assuming this code is executed after the code given above

console.log(dog1 instanceof Animal); // true
console.log(dog1 instanceof Dog); // true
console.log(dog1 instanceof Car); // false
```

## Static Methods

Static methods are defined on the class itself, not on instances of the class.
They are often used for utility functions related to the class.

```javascript
class MathUtilities {
  static add(a, b) {
    return a + b;
  }
}

console.log(MathUtilities.add(5, 3)); // Output: 8
```
