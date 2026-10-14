---
sidebar_position: 8
description:
  route.ts, HTTP methods, dynamic segments, Route Handler vs Server Action
---

# Route Handlers

A **Route Handler** is a `route.ts` file in `app/` that exports functions named
after HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`).
Each takes a Web `Request` (or `NextRequest`) and returns a `Response`. It is
the App Router replacement for API Routes (`pages/api`) and is used for
endpoints called by something other than your own UI: webhooks, mobile apps,
OAuth callbacks, files.

Applies to: Next.js 16.

## Details

- The URL comes from the folder: `app/api/users/[id]/route.ts` → `/api/users/1`.
  The `api/` prefix is a convention, not a requirement.
- A folder cannot have both `route.ts` and `page.tsx`.
- The second argument holds `params`; like in pages it is a **promise**.
- Query string: `request.nextUrl.searchParams`. Body: `await request.json()` or
  `await request.formData()`.
- `cookies()` and `headers()` from `next/headers` work here, and cookies can be
  set.
- Responses: `Response.json(data, { status })`, `NextResponse.json()`,
  `NextResponse.redirect(new URL(...))`, or a stream.
- Caching: `GET` handlers are not cached by default since Next.js 15. In the
  previous model, `export const dynamic = 'force-static'` caches one. With Cache
  Components, `GET` handlers are prerendered like pages, and `'use cache'` goes
  into a helper function.

### Route Handler vs Server Action

|              | Route Handler                           | Server Action                                 |
| ------------ | --------------------------------------- | --------------------------------------------- |
| Called by    | Any HTTP client                         | Your React components (forms, event handlers) |
| HTTP methods | Any                                     | `POST` only                                   |
| URL          | Explicit, from the file path            | Generated ID, sent to the page that uses it   |
| Returns      | Any `Response`: JSON, files, streams    | A serializable value plus an updated UI       |
| Typical use  | Webhooks, a public API, OAuth callbacks | Mutations from forms and buttons              |

Both are public endpoints: check the session and validate the input in each one.

## Example

```typescript title="app/api/users/[id]/route.ts"
import { NextResponse, type NextRequest } from 'next/server';
import { getUser, updateUser } from '@/lib/users';
import { verifySession } from '@/lib/dal';

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const session = await verifySession();
  const { id } = await params;
  if (session.userId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await request.json();
  return NextResponse.json(await updateUser(id, data));
}
```

## Common Mistakes

- Calling your own Route Handler with `fetch` from a Server Component. That is
  an extra HTTP round trip on the same server; call the data function directly.
- Using a Route Handler for a form in your own app, where a Server Action is
  simpler and works without JavaScript.

## See Also

- [Server Actions](./server-actions.mdx)
- [Authentication](../authentication.md)
- [API Routes in the Pages Router](../page-router/forms.md)
