---
sidebar_position: 19
description:
  throw, try...catch...finally, custom errors and errors in async code
---

# Error Handling

An error is thrown with **`throw`** and handled with
**`try...catch...finally`**. A thrown error interrupts the normal flow and goes
up the call stack to the nearest `catch`. If there is none, it becomes an
uncaught error. `finally` runs in any case.

Errors are objects of the **`Error`** class or its subclasses: built-in
(`TypeError`, `ReferenceError`, `SyntaxError`, `RangeError`) or custom ones
created by extending `Error`.

## Details

- An error object has `name`, `message`, `stack` and an optional `cause`.
- `throw` accepts any value, but always throw `Error` objects: only they have a
  stack trace.
- `try...catch` is synchronous. It does not catch an error thrown later inside a
  callback, for example in `setTimeout`.
- In asynchronous code a rejected promise is handled with `.catch()` or with
  `try...catch` around `await`. See [Promises and async/await](./promises.mdx).
- Unhandled errors can be observed globally: the `error` and
  `unhandledrejection` events of `window`.
- Catch only what you can handle. Rethrow the rest, so errors are not swallowed.

## Example

```javascript
class ValidationError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'ValidationError';
  }
}

function getAccess(age) {
  if (typeof age !== 'number') {
    throw new TypeError('Age must be a number');
  }
  if (age < 18) {
    throw new ValidationError('You must be at least 18 years old');
  }
  return 'Access granted';
}

function tryToGetAccess(age) {
  try {
    console.log(getAccess(age));
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('Denied:', error.message);
    } else {
      throw error; // not ours to handle
    }
  } finally {
    console.log('Done');
  }
}

tryToGetAccess(20); // Access granted, Done
tryToGetAccess(16); // Denied: You must be at least 18 years old, Done
// error-next-line
tryToGetAccess('16'); // Done, then Uncaught TypeError: Age must be a number
```

Wrapping a low-level error and keeping the original one in `cause`:

```javascript
async function loadUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  } catch (error) {
    throw new Error('Failed to load user', { cause: error });
  }
}
```

## Follow-up Questions

- What happens with `return` inside `try` if there is `finally`? `finally` still
  runs, and a `return` in `finally` overrides the previous one.
- Does `try...catch` catch a rejected promise? Only if the promise is awaited
  inside `try`.
- How do errors work in React? Rendering errors are caught by error boundaries,
  not by `try...catch`.

## Common Mistakes

- An empty `catch` block: the error disappears and the bug becomes invisible.
- Throwing strings (`throw 'error'`): there is no stack trace and `instanceof`
  checks don't work.
- Wrapping a `setTimeout` or a promise without `await` in `try...catch` and
  expecting it to catch the error.
