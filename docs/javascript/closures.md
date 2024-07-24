---
sidebar_position: 8
---

# Closures

A closure is a function bundled together with its lexical environment, meaning
it retains access to variables from its parent scope even after the parent
function has finished executing.

Closures solve the problem of maintaining state in JavaScript, particularly in
scenarios like callbacks, event handlers, and asynchronous code. They allow
functions to 'remember' and access the variables from their enclosing scope,
even when they're invoked outside of that scope. This makes closures invaluable
for tasks like data privacy, encapsulation, and creating modular code
structures.

```javascript
const outerFunction = () => {
  let message = 'First message';

  const inner = (newMessage) => {
    console.log('Previous:', message);
    message = newMessage;
    console.log('New:', message);
  };

  // Return the inner function, which maintains a reference to message
  return inner;
};

// Invoke outerFunction and assign its return value to closureExample
const closureExample = outerFunction();

closureExample('New message');
// Previous: First message
// New: New message

closureExample('Another message');
// Previous: New message
// New: Another message
```

## Potential problems

Code with closures can be complex and hard to read.

**Long-lived state:** The outer variable persists across multiple calls and its
lifecycle is tied to the closure, not the function itself.

**Memory leaks:** If closures retain references to large objects or variables
that are no longer needed, they can prevent those objects from being
garbage-collected. For example:

```javascript
function createClosure() {
  const bigData = new Array(1000000).fill('x'); // A large array

  return function () {
    console.log(bigData.length);
  };
}

const leakyClosure = createClosure();
// The closure still retains a reference to bigData

leakyClosure();
// Even after this call, bigData remains in memory
// because it's referenced by the closure
```
