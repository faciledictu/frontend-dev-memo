---
sidebar_position: 4
---

# Client Components

By default, components are server components, but ou can split your application
into interactive (client) and non-interactive (server) parts.

Client Components are designed to run entirely in the browser, allowing for
interactive user experiences.

- **Interactivity.** Client Components can include interactive JavaScript logic,
  such as event handlers and dynamic state changes.

- **Hydration.** They support hydration, meaning the initial HTML is rendered by
  the server, and the JavaScript logic is activated on the client side.

## Creating Client Component

You can specify client components using the `'use client'` directive at the top
of the file.

```jsx title="ClientComponent.js"
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Count: {count}</p>
    </div>
  );
}
```

```jsx title="ServerComponent.js"
import ClientComponent from './ClientComponent';

export default function ServerComponent() {
  return (
    <div>
      <h1>Server Component</h1>
      <ClientComponent />
    </div>
  );
}
```

## Using Context Providers

Context Providers like Redux or React Context are commonly used for state
management across your application. To use these within Client Components,
follow these steps.

1. Set up your provider as you normally would in a React application, but add
   `'use client'` directive.

```tsx title="context/ThemeContext.js"
'use client';

import { createContext } from 'react';

export const ThemeContext = createContext({});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}
```

2. Your Server Component will now be able to directly render your provider since
   it's been marked as a Client Component.

```tsx title="app/layout.tsx"
import ThemeProvider from './theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```
