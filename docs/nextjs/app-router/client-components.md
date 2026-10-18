---
sidebar_position: 4
description:
  "'use client' as a boundary, Server Components as children, serializable
  props, context providers"
tags: [middle]
---

# Client Components

A **Client Component** can use state, effects, event handlers and browser APIs.
It is **prerendered to HTML on the server** like any component and then
**hydrated** in the browser, so its code is sent to the client. The
**`'use client'`** directive at the top of a file marks a **boundary**, not a
single component: the file and everything it imports become client code.

Applies to: Next.js 16.4, React 19.3.

## Details

- Put the boundary as **low** in the tree as possible: make the button
  interactive, not the whole page.
- A Client Component **cannot import** a Server Component, but it can **render
  one passed as `children`** or another prop. The Server Component is rendered
  on the server and arrives as ready output.
- Props passed from a Server Component to a Client Component must be
  **serializable**: primitives, plain objects, arrays, `Date`, `Map`, `Set`,
  promises, JSX. Functions are not allowed, except Server Actions.
- Context does not work in Server Components. A provider is a Client Component
  that wraps `children` in the layout; the pages inside stay Server Components.
- `'use client'` is needed only in files that are entry points from the server
  side. Components imported by a Client Component are client code already.
- Third-party components that use client hooks but lack `'use client'` are
  wrapped in your own file that has it.

## Example

A context provider rendered in a Server Component layout:

```tsx title="app/theme-provider.tsx"
'use client';

import { createContext, useState } from 'react';

type Theme = 'light' | 'dark';

export const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
}
```

```tsx title="app/layout.tsx"
import { ThemeProvider } from './theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* children are still Server Components */}
        {/* highlight-next-line */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Follow-up Questions

- Does `'use client'` mean the component renders only in the browser? No, it is
  prerendered on the server too. To skip the server render, call
  `use(browser())` (`browser` from `react-dom`) inside `<Suspense>`, or use
  `next/dynamic` with `ssr: false` inside a Client Component.
- Why can't you pass `onClick` from a Server Component? A function cannot be
  serialized into the RSC Payload; only Server Actions are passed, as
  references.
- How do you put a Server Component inside a client modal? Pass it as
  `children`: `<Modal><ServerContent /></Modal>`.

## Common Mistakes

- Marking every file with `'use client'` "to be safe": more JavaScript, and data
  fetching moves to the client.
- Reading `window` during render: the component also renders on the server. Use
  it in `useEffect`, event handlers or behind `use(browser())`.
- Wrapping `<html>` in the provider instead of `{children}`: the client boundary
  moves up for no reason.

## See Also

- [Server Components](./server-components.mdx)
- [Context in React](../../react/hooks/context.md)
