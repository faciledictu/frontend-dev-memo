---
sidebar_position: 7
---

# Other Hooks and Functions specific for App Router

## `generateViewport` and `viewport`

In Next.js, you can customize the viewport using either a static `viewport`
object or a dynamic `generateViewport` function. Here’s a brief overview:

You can export a static viewport object from your `layout.jsx` or `page.jsx`
file

```jsx
import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: 'black',
};

export default function Page() {}
```

If you need the viewport settings to depend on runtime information, you can use
the generateViewport function:

```jsx
export function generateViewport({ params }) {
  return {
    themeColor: '...',
  };
}
```

- The viewport object and generateViewport function are only supported in Server
  Components.

- You cannot export both the viewport object and generateViewport function from
  the same route segment.

- If the viewport doesn’t need to be dynamic, prefer using the static viewport
  object over generateViewport.
