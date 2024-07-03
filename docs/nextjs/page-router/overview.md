---
sidebar_position: 1
---

# Page Router

:::tip

For new applications, the App Router is recommended. This router allows you to
use React's latest features and is an evolution of the Pages Router based on
community feedback.

:::

The Next.js Page Router is a routing mechanism that maps URL paths to React
components. It allows for easy creation of dynamic, server-rendered, and
statically generated pages. Each file in the `pages/` directory corresponds to a
route.

## Features

- **File-based Routing**. Automatically creates routes based on the file
  structure within the `pages/` directory.
- **Dynamic Routing**. Supports dynamic routes using square brackets (e.g.,
  `[id].js`).
- **Nested Routes**. Easily create nested routes by organizing files into
  folders within the `pages/` directory.
- **Automatic Code Splitting**. Each page only loads the JavaScript and CSS
  necessary for that page, improving performance.

## Project Structure

Routes are based on the file system, where each file in the `pages/` directory
corresponds to a route in the application.

The router will automatically route files named index to the root of the
directory.

| Filepath                 | Route            |
| ------------------------ | ---------------- |
| pages/index.js           | /                |
| pages/about.js           | /about           |
| pages/blog/first-post.js | /blog/first-post |

### Dynamic Routes

Dynamic routes allow pages to be created dynamically based on the parameters of
the URL.

```javascript
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  return <p>Post: {router.query.id}</p>;
}
```

| Filepath                        | Route       | `params`                      |
| ------------------------------- | ----------- | ----------------------------- |
| **Dynamic Routes**              |             |                               |
| pages/posts/\[id\].js           | /posts/a    | `{ id: 'a' }`                 |
| pages/posts/\[id\].js           | /posts/b    | `{ id: 'b' }`                 |
| pages/posts/\[id\].js           | /posts/c    | `{ id: 'c' }`                 |
| **Catch-all Segments**          |             |                               |
| pages/shop/\[...params\].js     | /shop/a/b   | `{ params: ['a', 'b'] }`      |
| pages/shop/\[...params\].js     | /shop/a/b/c | `{ params: ['a', 'b', 'c'] }` |
| **Optional Catch-all Segments** |             |                               |
| pages/shop/\[\[...params\]\].js | /shop       | `{ params: [] }`              |
| pages/shop/\[\[...params\]\].js | /shop/a/b   | `{ params: ['a', 'b'] }`      |

:::note

The difference between catch-all and optional catch-all segments is that with
optional, the route without the parameter is also matched (/shop in the example
above).

:::

### Templates

File `pages/_app.js` customizes the default App component, allowing you to
initialize pages. It is used to keep state when navigating between pages, inject
global CSS, and provide layout components.

```typescript
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

- `Component` prop contains the current page component, so it changes when you
  navigate between routes. Any props you send to Component will be received by
  the page.
- `pageProps` is an object with the initial props that were preloaded for your
  page by using on of the fetching mehtods. Otherwise, it's an empty object.

`/_document.js` file customizes the HTML document that Next.js uses to render
pages. It is only rendered on the server side and is used to augment the
`<html>` and `<body>` tags.

```typescript
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```
