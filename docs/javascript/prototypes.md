---
sidebar_position: 12
description: The prototype chain, __proto__ vs prototype, what new does
tags: [middle]
---

# Prototypes and Inheritance

Every object has a hidden link `[[Prototype]]` to another object, its
**prototype**. When a property is not found on the object itself, JavaScript
looks for it in the prototype, then in the prototype's prototype, and so on.
This is the **prototype chain**. It ends at `Object.prototype`, whose prototype
is `null`. This is how inheritance works in JavaScript; `class` is syntax on top
of it.

## Details

### `[[Prototype]]` and `prototype`

- **`[[Prototype]]`** is the internal link that every object has. Read it with
  `Object.getPrototypeOf(obj)`, change it with
  `Object.setPrototypeOf(obj, proto)`.
- **`__proto__`** is a legacy accessor for the same link. It works, but the
  methods above are preferred.
- **`prototype`** is a regular property of constructor functions and classes.
  The object stored there becomes the `[[Prototype]]` of every instance created
  with `new`. Shared methods are defined on it.

### What `new` Does

1. Creates an empty object.
2. Sets its `[[Prototype]]` to the constructor's `prototype`.
3. Calls the constructor with `this` pointing to the new object.
4. Returns the object, unless the constructor returns another object.

### Reading and Writing

- **Reading** a property walks the chain.
- **Writing** creates or changes an own property of the object and does not
  modify the prototype. Exceptions: an inherited setter is called instead, and
  an inherited read-only property makes the write fail.
- `Object.hasOwn(obj, key)` checks only own properties; the `in` operator checks
  the whole chain.

### Creating an Object With a Given Prototype

`Object.create(proto)` creates a new object with the specified prototype.
`Object.create(null)` creates an object without a prototype: it has no
`toString` and other inherited methods and is used as a clean dictionary.

## Example

```javascript
function Dog(name) {
  this.name = name;
}

Dog.prototype.bark = function () {
  console.log(`${this.name}: Woof!`);
};

const rex = new Dog('Rex');

rex.bark(); // Rex: Woof!

console.log(Object.getPrototypeOf(rex) === Dog.prototype); // true
console.log(rex.__proto__ === Dog.prototype); // true
console.log(Object.getPrototypeOf(Dog.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null

console.log(Object.hasOwn(rex, 'name')); // true
console.log(Object.hasOwn(rex, 'bark')); // false
console.log('bark' in rex); // true

const dictionary = Object.create(null);
// error-next-line
dictionary.toString(); // TypeError: dictionary.toString is not a function
```

## Follow-up Questions

- How are classes related to prototypes? Methods of a class are stored in
  `ClassName.prototype`, and `extends` links two prototypes. See
  [Classes](./classes.md).
- How does `instanceof` work? It checks whether `Constructor.prototype` is
  somewhere in the prototype chain of the object.
- Why is it a bad idea to extend built-in prototypes such as `Array.prototype`?
  The change is global and can conflict with other code and future versions of
  the language.

## Common Mistakes

- Mixing up `prototype` and `__proto__`: `prototype` belongs to the constructor,
  `__proto__` to the instance.
- "The chain ends at `Object`." It ends at `Object.prototype`, then `null`.
- "Methods are copied into every instance." Instances share them through the
  prototype.
