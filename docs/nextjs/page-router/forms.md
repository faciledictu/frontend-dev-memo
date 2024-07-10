---
sidebar_position: 8
---

# Working with Forms

## API Routes

Next.js allows you to create API routes where you can define server-side
functions to handle data fetching and mutations. API routes are typically
created inside the pages/api directory, and each file within this directory
defines a separate route.

These routes can handle requests, perform operations like database queries, and
return data to the client.

```javascript title="pages/api/hello.js"
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello, world!' });
}
```

## Server-Only Forms

You need to create certain API-endpont to handle recieved data on the server.

```typescript title="api/submit.ts"
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;
  const id = await createItem(data);
  res.status(200).json({ id });
}
```

Then create the form and handle the submission.

```javascript
import { FormEvent } from 'react';

export default function Page() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    });

    // Handle response if necessary
    const data = await response.json();
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Data Validation

If you need to validate the data on client, you can use HTML attibutes like
`required` and `type=email`.

For more complex data, you may consider validate them on server using schema
validation libraries like _zod_.

Here is updated api endpoint.

```typescript title="api/submit.ts"
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const schema = z.object({
  // ...
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = schema.parse(req.body);
  // ...
}
```

## Error Handling

You can use React state to set an error message if form submission request
fails.

```tsx
import { useState } from 'react';

function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: formData,
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error);
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      setError('Something went wrong');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      {isSuccess && <p>Registration successful!</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        Register
      </button>
    </form>
  );
}

export default RegisterForm;
```
