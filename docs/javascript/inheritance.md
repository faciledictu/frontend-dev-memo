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

## `[[Prototype]]` property

Every object has [[Prototype]] internal property that contains a link to the
object's prototype. This property is not directly accessible in the same way as
regular properties. However there is a standard way to access or modify it using
certain methods like `Object.getPrototypeOf(obj)` and
`Object.setPrototypeOf(obj)`.

:::tip The common way to access object prototype

Most of environment exposes objects' prototypes via the `__proto__` property.
This is a common way of accessing it, although it's not standard.

:::
