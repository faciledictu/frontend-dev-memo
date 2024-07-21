---
sidebar_position: 3
---

# Working with Errors

An error is an object that represents something that went wrong during the
execution of your code. Errors can originate from different sources, such as:

- Programming mistakes (e.g., syntax errors, type errors)
- External factors (e.g., network issues, file system errors)
- Logical errors (e.g., incorrect calculations, invalid inputs)

## Types of Errors

- **Commont JavaScript Errors**:

  Standard JavaScript errors like TypeError, SyntaxError, etc.

- **Errors, Specific for Node.js**:

  **System Errors**: Errors related to system resources (e.g., ENOTFOUND,
  ECONNREFUSED).

  **Operational Errors**: Errors related to expected failures during runtime
  (e.g., trying to read a non-existent file).

## Creating and Throwing Errors

In JavaScript, you can create an error using the `Error` constructor and throw
it using the throw statement.

```typescript
function doSomething(value) {
  if (value < 0) {
    throw new Error('Value must be non-negative');
  }
  // Rest of the code
}
```

## Error Handling

For basics or exception handling in JavaScript read
[Error Handling](/docs/javascript/errors.md).

Handling errors in asynchronous code can be a bit trickier. Here are the common
patterns:

1. In Callbacks

   For functions that use callbacks, the convention is to pass the error as the
   first argument

   ```typescript
   fs.readFile('path/to/file', (err, data) => {
     if (err) {
       return console.error('File read error:', err);
     }
     console.log('File data:', data);
   });
   ```

2. In Promises

   With promises, you can use `.catch` to handle errors:

   ```typescript
   doSomethingAsync()
     .then((result) => {
       console.log('Result:', result);
     })
     .catch((error) => {
       console.error('Async error:', error);
     });
   ```

   If you are working with promises using `async/await` syntax, use
   `try...catch`:

   ```typescript
   async function handleAsyncTask() {
     try {
       const result = await doSomethingAsync();
       console.log('Result:', result);
     } catch (error) {
       console.error('Async error:', error);
     }
   }
   ```

### Global Error Handling

In Node.js, you can use `process.on` method to catch unhandled exceptions and
promise rejections.

```typescript
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', promise, 'reason:', reason);
});
```

### Error Handling in Express.js

In an Express.js application, error handling is typically done using middleware.

```typescript
import express, { Request, Response, NextFunction } from 'express';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

const app = express();

app.get('/resource', (req: Request, res: Response, next: NextFunction) => {
  // Simulate a "not found" error
  next(new NotFoundError('Resource not found'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

const statusCode = err?.statusCode ?? 500;
const message = err?.message ?? 'Internal Server Error';


  res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```
