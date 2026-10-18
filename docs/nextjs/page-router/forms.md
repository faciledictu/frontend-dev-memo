---
sidebar_position: 4
description:
  API Routes in pages/api, submitting a form to an API Route, validation and
  errors
tags: [junior]
---

# API Routes and Forms

An **API Route** is a file in **`pages/api/`** that exports a
`handler(req, res)` in the Node.js style: `req.method`, `req.query`, `req.body`,
`req.cookies`, and `res.status().json()`. A form in the Pages Router is
submitted from the client with `fetch` to such a route; the route **validates**
the body and returns errors with a `4xx` status. In the App Router the same is
done with Route Handlers and Server Actions.

Applies to: Next.js 16.4 (Pages Router).

## Details

- One file handles all methods: branch on `req.method` and respond with `405` to
  the rest.
- `req.body` is parsed automatically for JSON and URL-encoded bodies. A
  `FormData` object is sent as `multipart/form-data`, which is **not** parsed:
  send JSON or turn off `bodyParser` and use a multipart parser.
- Validate on the server with a schema (Zod), even if the form has `required`
  and `type="email"`: client checks are only for UX.
- API Routes are server-only code: secrets and database access are safe here.
- Do not call your own API Route from `getStaticProps` or `getServerSideProps`:
  import the function directly.

## Example

```typescript title="pages/api/register.ts"
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createUser } from '@/lib/users';

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // highlight-next-line
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  await createUser(parsed.data);
  return res.status(201).json({ ok: true });
}
```

<details>
<summary>The form with loading and error states</summary>

```tsx title="components/RegisterForm.tsx"
import { useState, type FormEvent } from 'react';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const body = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }
      setIsSuccess(true);
    } catch {
      setError('Network error, try again');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) return <p>Registration successful!</p>;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}
      <input type="email" name="email" required />
      <input type="password" name="password" required minLength={8} />
      <button type="submit" disabled={isLoading}>
        Register
      </button>
    </form>
  );
}
```

</details>

## Follow-up Questions

- API Route or Route Handler? Node-style `req` / `res` in `pages/api` versus Web
  `Request` / `Response` in `app/**/route.ts`; one URL is served by one of them.
- How do you protect an API Route? Read the session from `req.cookies`, verify
  it and respond with `401` or `403`, see
  [Authentication](../authentication.md).
- How do you upload a file? Turn off `bodyParser` in `export const config` and
  parse `multipart/form-data` with a library, or use a Route Handler with
  `request.formData()`.

## Common Mistakes

- Sending a `FormData` body with `Content-Type: application/json`.

## See Also

- [Route Handlers](../app-router/route-handlers.md)
- [Server Actions](../app-router/server-actions.mdx)
- [Forms in React](../../react/basics/forms.md)
