---
sidebar_position: 6
description:
  NEXT_PUBLIC_ variables inlined at build time vs server variables read at
  runtime, .env file order, one Docker image for several environments
tags: [junior, middle]
---

# Environment Variables

Next.js loads variables from `.env*` files into `process.env`. A variable is
available **only on the server** unless its name starts with **`NEXT_PUBLIC_`**:
then `next build` **inlines** its value into the JS bundle as a literal, so the
browser gets it, and it is **frozen at build time**. Server variables are read
at runtime, so the same build can run with different values. Nothing in
`NEXT_PUBLIC_` is secret.

Applies to: Next.js 16.4.

## Details

### Two Kinds of Variables

|                       | `NEXT_PUBLIC_API_URL`                    | `DATABASE_URL`                                                        |
| --------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| Where available       | Server and client code                   | Server only: Server Components, Route Handlers, Server Actions, Proxy |
| When the value is set | At `next build`: replaced with a literal | At runtime, when the server code reads it                             |
| Change it             | Rebuild                                  | Restart with a new value                                              |
| Secret                | Never: it is in the bundle               | Can be: it never reaches the browser                                  |

- In client code a server variable is `undefined`, not an error.
- Only a **static** reference is inlined: `process.env.NEXT_PUBLIC_API_URL`.
  `process.env[name]` and destructuring
  (`const { NEXT_PUBLIC_X } = process.env`) stay unreplaced and are `undefined`
  in the browser.
- A server variable read in a page that is prerendered at build time is also
  frozen into the HTML. To read the runtime value, the code must run on request
  (after `await connection()`, `cookies()` and similar).
- The `env` key in `next.config` is legacy: its values are always inlined into
  the bundle.

### `.env` Files

Lookup order; the first file that defines a variable wins:

1. `process.env`: variables already set in the shell, CI or hosting.
2. `.env.$(NODE_ENV).local`: `.env.development.local`, `.env.production.local`.
3. `.env.local`: not loaded when `NODE_ENV=test`, so tests are reproducible.
4. `.env.$(NODE_ENV)`.
5. `.env`.

- `NODE_ENV` is `development` for `next dev` and `production` for `next build`
  and `next start`.
- `.env*.local` files hold local overrides and secrets and are not committed;
  `.env`, `.env.development` and `.env.production` hold defaults and can be.
- Files are read from the project root, not from `src/`.
- `$OTHER_VAR` inside a value is expanded; `\$` is a literal dollar.
- Outside Next.js (a test runner, an ORM script) the same files are loaded with
  `loadEnvConfig()` from `@next/env`.

### One Build, Several Environments

The usual Docker setup builds one image and promotes it from staging to
production. `NEXT_PUBLIC_` values are already in that image, so staging and
production would get the same API URL. Options:

- Keep the value on the server: read it in a Server Component and pass it to the
  client as a prop, or expose it through a Route Handler.
- Build a separate image per environment.
- Generate a config file at container start and load it in the browser
  (`window.__ENV`), at the cost of an extra request or script.

## Example

```bash title=".env"
NEXT_PUBLIC_API_URL=https://api.acme.com
DATABASE_URL=postgres://localhost/acme
```

```tsx title="app/page.tsx"
import { connection } from 'next/server';
import { Checkout } from './checkout';

export default async function Page() {
  await connection(); // render on request: read the runtime value
  // highlight-next-line
  const region = process.env.PAYMENT_REGION; // server only, set per environment
  return <Checkout region={region} />;
}
```

```tsx title="app/checkout.tsx"
'use client';

export function Checkout({ region }: { region?: string }) {
  // Inlined at build time: the same in every environment that uses this build
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // error-next-line
  const dbUrl = process.env.DATABASE_URL; // undefined in the browser: no NEXT_PUBLIC_
  return <p>{`${apiUrl} · ${region} · ${dbUrl}`}</p>;
}
```

## Follow-up Questions

- Why is a `NEXT_PUBLIC_` variable changed on the server not visible in the
  browser? It was replaced with a literal at build time; the bundle does not
  read `process.env` at runtime.
- How do you keep a server variable from leaking? Read it only in modules marked
  `import 'server-only'`; passing it as a prop to a Client Component sends it to
  the browser.
- How is this different from React Native? The idea is the same (`EXPO_PUBLIC_`
  is inlined), but a mobile app has no server part: every value in it is public,
  see [Environment Configuration](../react-native/release/env.md).
- Why is `.env.local` ignored in tests? Tests should give the same results on
  every machine, so personal overrides are not loaded; use `.env.test`.

## Common Mistakes

- Putting a secret key in a `NEXT_PUBLIC_` variable "because the client needs
  it": call your server instead, which holds the secret.
- Changing a `NEXT_PUBLIC_` value in the hosting settings and expecting it to
  apply without a rebuild.
- Reading variables dynamically with `process.env[key]` in client code.
- Committing `.env.local` with secrets.

## See Also

- [Proxy](./proxy.md)
- [Server Components](./app-router/server-components.mdx)
- [Environment Configuration in React Native](../react-native/release/env.md)
