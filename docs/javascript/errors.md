---
sidebar_position: 19
---

# Error Handling

Exceptions in JavaScript are events that disrupt the normal flow of code
execution when an error occurs.

When an exception is thrown, the normal flow of the program is interrupted, and
control is transferred to the nearest enclosing `try...catch` block that can
handle the exception.

JavaScript exceptions can be divided to 2 categories: built-in exceptions
(Error, TypeError, ReferenceError, SyntaxError etc.) and custom exceptions, that
can be created using the `throw` statement.

## `throw` Statement

```javascript
function getAccess(age) {
  if (age < 18) {
    throw new Error('You must be at least 18 years old.');
  }
  return 'Access granted';
}
```

## `try...catch` Statement

JavaScript provides mechanisms to handle runtime errors using `try...catch`
blocks.

```javascript
function tryToGetAccess() {
  try {
    const result = getAccess(age);
    console.log(result);
  } catch (error) {
    console.error('An error occurred:', error.message);
  } finally {
    console.log('This will run regardless of the try/catch result.');
  }
}

tryToGetAccess(20); // Access granted

tryToGetAccess(16); // An error occurred: You must be at least 18 years old
```

- If `getAccess()` runs without errors, `Access granted` is logged to the
  console.

- If `getAccess()` throws an error, the catch block logs the error message to
  the console.
