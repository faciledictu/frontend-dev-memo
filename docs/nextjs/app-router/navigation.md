---
sidebar_position: 2
---

# Navigation

- `Link` is a built-in component to provide prefetching and client-side
  navigation between routes. It is the recommended way to navigate between
  routes.

```javascript
import Link from 'next/link';

function MyComponent() {
  return (
    <Link href="/new-route">
      <a>Go to new route</a>
    </Link>
  );
}
```

- `useRouter()` hook allows you to access the router object, giving you control
  over navigation and route information.

```javascript
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

- for Server Components, use the `redirect` function instead

```typescript
import { redirect } from 'next/navigation';

async function fetchTeam(id: string) {
  const res = await fetch('https://...');
  if (!res.ok) {
    return;
  }
  return res.json();
}

export default async function Profile({ params }: { params: { id: string } }) {
  const team = await fetchTeam(params.id);
  if (!team) {
    redirect('/login');
  }

  // ...
}
```
