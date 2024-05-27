---
sidebar_position: 9
---

# Inheritance

Prototypal inheritance is a fundamental concept in JavaScript, where objects can
inherit properties and methods from other objects. In JavaScript, each object
has a prototype property, which refers to another object. When you try to access
a property or method on an object, JavaScript will first look for it on the
object itself. If the property or method is not found on the object itself, the
search will proceed to the object's prototype. If the property or method is not
found there, the search will continue up the prototype chain until it reaches
the property or method or reaches the end of the chain.

The end of the chain is the prototype of `Object` is `null`.

`Object.create(proto, [propertiesObject])` creates a new object with the
specified prototype object and properties.

```javascript
const proto = {
  greet: function () {
    console.log('Hello!');
  },
};

const obj = Object.create(proto);
obj.greet(); // Hello!
```

Prototypal inheritance is a powerful feature of JavaScript that allows for code
reuse and object-oriented programming paradigms.

## `prototype` property

`prototype` is a regular property of constructor functions. It is an object that
will become the prototype of all instances created by that constructor. This
property is used to define properties and methods that should be shared by all
instances of a particular constructor function.

When you create a new object using a constructor function with the new keyword,
the object's prototype is set to the constructor's `prototype` property.

For example, `Person.prototype` defines a method sayHello that is available to
all instances of `Person`.

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function () {
  console.log(`Hello, my name is ${this.name}`);
};

let alice = new Person('Alice');
alice.sayHello(); // Output: "Hello, my name is Alice"
```

## How to access to object's prototype

Every object in JS has [[Prototype]] internal property that contains a link to
the object's prototype. This property is not directly accessible in the same way
as regular properties. However there is a standard way to access or modify it
using certain like `Object.getPrototypeOf(obj)` and
`Object.setPrototypeOf(obj)`.

:::tip The common way to access object prototype

Most of environment exposes objects' prototypes via the `__proto__` property.
This is a common way of accessing it, although it's not standard.

:::

```javascript
function Dog(name) {
  this.name = name;
}

Dog.prototype.bark = function () {
  console.log('Woof!');
};

const rex = new Dog('Rex');

rex.bark(); // Woof!

// Getting prototype
console.log(Object.getPrototypeOf(rex) === Dog.prototype); // true
// Using __proto__
console.log(rex.__proto__ === Dog.prototype); // true

/// Setting prototype
Object.setPrototypeOf(rex, Object.prototype);
/// The same thing using __proto__
rex.__proto__ = Object.prototype;

rex.bark(); // TypeError: rex.bark is not a function
```

:::note No prototype

An object with a null prototype does not inherit any properties or methods.

```javascript
const strangeObject = Object.create(null);

strangeObject.toString() // TypeError: strangeObject.toString is not a function
strangeObject.__proto__ // 'undefined' (not 'null', because __proto__ property doesn't exist)

```

:::
