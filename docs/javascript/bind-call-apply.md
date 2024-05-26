---
sidebar_position: 5
desctiption: bind(), call(), apply()
---

# Function.prototype Methods

There are methods of `Function` prototype, they allow invoking a function with
explicitly bound `this` and applied arguments.

## `bind`

The bind method returns a bound function. This is a new function with the same
body as the original, but with its `this` keyword set to the provided value.
Additionally, it allows you to specify a sequence of arguments, which will
precede any provided when the new function is called. This method can be used
for creating partially applied functions.

```javascript
function showThisAndArgs(...args) {
  console.log(this, ...args);
}

const binded = showThisAndArgs.bind({}, 'a', 'b');

binded('c'); // {} a b c
```

## `call` and `apply`

Unlike `bind`, these methods are used to invoke a function immediately. They
both accept `this` value as the first argument. The difference between these
methods lies in how they take arguments for the function being called. The
`call` method receives arguments provided individually, while the `apply` method
accepts arguments provided as an array.

```javascript
function showThisAndArgs(...args) {
  console.log(this, ...args);
}

showThisAndArgs.call({}, ['a', 'b']); // {} a b
showThisAndArgs.apply({}, 'a', 'b'); // {} a b
```
