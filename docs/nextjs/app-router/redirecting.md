---
sidebar_position: 7
---

# Redirecting

## Client Side

To redirect on the client side, you can use the `useRouter`.

If you need to redirect inside an event handler in a Client Component, you can
use the push method from the useRouter hook.

```jsx
'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  );
}
```

## Server Side

### `redirect` and `permanentRedirect`

Server-side redirection can be handled using the redirect function from
next/navigation in server components or API routes.

```jsx
import { redirect } from 'next/navigation';

export default function Page() {
  // Your condition here
  if (true) {
    redirect('/new-page'); // Redirect to the new page
  }

  return <div>Redirecting...</div>;
}
```

`redirect` returns a 307 (Temporary Redirect) status code by default. When used
in a Server Action, it returns a 303 (See Other), which is commonly used for
redirecting to a success page as a result of a POST request.

`permanentRedirect` returns a 308 (permanent redirect) status code by default.

permanentRedirect is often used after a mutation or event that changes an
entity's canonical URL, such as updating a user's profile URL after they change
their username.

### Middleware Redirection

You can use middleware to perform redirects before the request reaches the final
destination. Middleware is useful for authentication, logging, or other
cross-cutting concerns.

```jsx
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  if (url.pathname === '/old-page') {
    url.pathname = '/new-page';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/old-page'],
};
```
