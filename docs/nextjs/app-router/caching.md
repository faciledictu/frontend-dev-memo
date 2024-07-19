---
sidebar_position: 8
---

# Caching

Caching in Next.js helps reduce the load on your server and improve the
performance of your application by storing data that doesn't change frequently.
This way, subsequent requests for the same data can be served from the cache
instead of fetching it again from the server.

## Revalidation

### Time-based Revalidation

You can use the `next.revalidate` option with the `fetch` function to specify the
cache lifetime of a resource, ensuring that data is revalidated at a timed
interval.

```jsx
export async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: {
      revalidate: 60 // Cache the response and revalidate every 60 seconds
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  return data;
}
```

### On-Demand Revalidation

`revalidatePath` function allows you to manually trigger a revalidation of
a specific path. This is useful when you know the underlying data has changed
and you want to update the cached content immediately.

`revalidateTag` function enables you to revalidate specific tags
associated with your data, providing a more granular control over which parts of
your cache to update.

```jsx
import { revalidatePath } from 'next/cache';

export async function updateData() {
  // Perform data update logic

  // Revalidate the specific path
  await revalidatePath('/path-to-revalidate');
}
```

## Opting out of caching

You can opt out of caching by:

- Using the `Request` object with the GET method.
- Using any of the other HTTP methods.
- Using Dynamic Functions like `cookies` and `headers`.
- The Segment Config Options manually specifies dynamic mode.
