---
sidebar_position: 4
description:
  Sessions in cookies, Data Access Layer, Proxy, protecting Server Actions
tags: [middle, senior]
---

# Authentication in Next.js

Next.js has no built-in authentication: you use a library (Auth.js, Better Auth,
Clerk) or keep your own session. The session lives in an **`HttpOnly` cookie**.
The main rule: **check access on the server, next to the data**: in a **Data
Access Layer** that every page, Server Action and Route Handler goes through.
**Proxy** (formerly Middleware) does only an optimistic check and a redirect; it
is not protection on its own.

Applies to: Next.js 16.4, App Router.

The general theory (sessions vs JWT, OAuth, where to keep a token) is in
[Authentication and Authorization](../web-platform/network/authentication.md).

## Details

### Where to Check Access

| Place                          | What it does                                                                                                    | Enough on its own?                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Proxy (`proxy.ts`)             | Optimistic check: is there a session cookie? If not, redirect to `/login`. No database queries                  | No: a matcher can miss a path, and it does not see the data |
| Data Access Layer              | `verifySession()` before every query; returns only what this user may see                                       | Yes, this is the real check                                 |
| Server Actions, Route Handlers | Call `verifySession()` and check the rights at the start of each one                                            | Yes, they are public HTTP endpoints                         |
| Layout                         | Unreliable: a shared layout is not re-rendered on client navigation, so its check does not run for the new page | No                                                          |
| Client components              | Hide buttons and links                                                                                          | No, this is UX                                              |

A Proxy-only check has failed before: CVE-2025-29927 let a crafted internal
header skip Middleware entirely.

### Session

- **Stateless:** the session data (user ID, expiration) is signed or encrypted
  into the cookie itself, for example a JWT made with `jose`. Nothing to store,
  but hard to revoke.
- **Database session:** the cookie holds only a random session ID; the data is
  in a database. Easy to revoke, one query per check.
- Cookie flags: `HttpOnly`, `Secure`, `SameSite=Lax`, an expiration date.
- `cookies()` from `next/headers` is async. With it, cookies can be **set or
  deleted only in Server Actions and Route Handlers**, never while rendering;
  Proxy sets them through `response.cookies`.

### Pages Router

- Check the session in `getServerSideProps` and return
  `{ redirect: { destination: '/login', permanent: false } }`.
- In API Routes read `req.cookies` and respond with `401`.
- A client-side check (a HOC with `useEffect` and `router.push`) renders the
  protected page before redirecting and protects nothing.

## Example

A session check reused by the whole Data Access Layer. `cache` from React runs
it once per server render, however many components call it (it does not
deduplicate calls in Server Actions and Route Handlers):

```typescript title="lib/dal.ts"
import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from './session'; // verifies the signature, e.g. with jose
import { db } from './db';

export const verifySession = cache(async () => {
  const token = (await cookies()).get('session')?.value;
  const session = await decrypt(token);
  if (!session) redirect('/login');
  return { userId: session.userId };
});

export async function getInvoices() {
  const { userId } = await verifySession();
  return db.invoice.findMany({
    where: { ownerId: userId },
    select: { id: true, amount: true, status: true }, // a DTO, not whole rows
  });
}
```

<details>
<summary>Login with a Server Action and Proxy</summary>

```typescript title="app/actions/auth.ts"
'use server';

import { redirect } from 'next/navigation';
import { createSession } from '@/lib/session'; // sets the HttpOnly cookie
import { findUser } from '@/lib/users';

type LoginState = { error?: string; email?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const user = await findUser(email, password);
  // Return the email: React resets the form after the action
  if (!user) return { error: 'Invalid email or password.', email };

  await createSession(user.id);
  redirect('/dashboard');
}
```

```tsx title="app/login/login-form.tsx"
'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {});

  return (
    <form action={formAction}>
      <input name="email" type="email" defaultValue={state.email} required />
      <input name="password" type="password" required />
      {state.error && <p role="alert">{state.error}</p>}
      <button disabled={isPending}>Log in</button>
    </form>
  );
}
```

```typescript title="proxy.ts"
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Optimistic: only checks that the cookie exists
  if (!request.cookies.has('session')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = { matcher: ['/dashboard/:path*'] };
```

</details>

## Follow-up Questions

- Why is Proxy not enough? It runs before routing and only for paths in its
  matcher. A Server Action is a POST request to the page that uses it, so a
  matcher change or a moved action silently loses the check.
- How do you protect a Server Action? Check the session and the rights inside
  it, validate the arguments (Zod), and never take the user ID from the form.
- Why not check auth in a layout? On client navigation between pages a shared
  layout is not re-rendered, so the check does not run for the new page.
- Where is the user ID taken from in a mutation? From the session on the server,
  not from the request body.
- How does a Client Component get the current user? It cannot import the Data
  Access Layer (`server-only`): a parent Server Component reads the user and
  passes a DTO as props or through a context provider.
- Why not `await cookies()` at the top of a layout? The whole segment waits for
  it before streaming. Read the session in a nested Server Component inside
  `<Suspense>`, such as the user menu.

## Common Mistakes

- Only checking in Proxy or only hiding links in the UI.
- A database session lookup in Proxy: it runs on every request, prefetches
  included. Only read the cookie there.
- Reading a token from `FormData` or `localStorage` and trusting it.
- Returning whole database records to the client: the Data Access Layer should
  return DTOs with only the fields the user may see.
- Importing `useActionState` from `react-dom`: it is exported from `react`.

## See Also

- [Server Actions](./app-router/server-actions.mdx)
- [Route Handlers](./app-router/route-handlers.md)
- [Authentication and Authorization](../web-platform/network/authentication.md)
