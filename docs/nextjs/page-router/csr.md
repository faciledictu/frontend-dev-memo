---
sidebar_position: 3
---

# Client-side Rendering (CSR)

Client-side rendering (CSR) is a technique where the rendering of web pages
happens dynamically populated on the client side (browser).

## Ways to Enable

There are two ways to implement client-side rendering in Page Router:

- Use the `useEffect()` and `useEffect()` hook instead of the server-side
  rendering methods (`getStaticProps` and `getServerSideProps`).
- Use a data fetching library like SWR or TanStack Query to fetch data on the
  client (recomended).

```javascript
// pages/index.js
import { useState, useEffect } from 'react';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Client-Side Rendering with Next.js</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Home;
```

## Considerations for CSR

### Benefits

- **Rich Interactivity**. Since the rendering happens on the client side, it allows
  for a more interactive and dynamic user experience.

- **Reduced Server Load**. The server provides a basic HTML shell, reducing the load
  on the server.
  
- **Seamless Transitions**. Navigation between pages can be smooth and fast without
  full-page reloads.

### Limitations

- **The initial load time might be longer** because JavaScript needs to be
  fetched and executed before the page can render.

- **CSR can be less SEO-friendly** compared to SSR, as search engines may
  struggle to index content that requires JavaScript to display.
