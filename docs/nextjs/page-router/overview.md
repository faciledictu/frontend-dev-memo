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

The router will automatically route files named `index` to the root of the
directory.

| Filepath                 | Route            |
| ------------------------ | ---------------- |
| pages/index.js           | /                |
| pages/about.js           | /about           |
| pages/blog/first-post.js | /blog/first-post |

### Dynamic Routes

Dynamic routes allow pages to be created dynamically based on the parameters of
the URL.

```jsx
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

The `pages/_app.js` file customizes the default App component, allowing you to
initialize pages. It is used to keep state when navigating between pages, inject
global CSS, and provide layout components.

```tsx
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

- The `Component` prop contains the current page component, so it changes when
  you navigate between routes. Any props you send to `Component` will be
  received by the page.
- `pageProps` is an object with the initial props that were preloaded for your
  page by using one of the fetching methods. Otherwise, it's an empty object.

The `pages/_document.js` file customizes the HTML document that Next.js uses to
render pages. It is only rendered on the server side and is used to augment the
`<html>` and `<body>` tags.

```tsx
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

## Navigation

- **Client-side Navigation**. Handles client-side navigation between pages using
  Next.js's optimized `<Link>` component, which preloads linked pages for faster
  navigation.

- The `useRouter` hook allows you to access the router object and navigate
  programmatically. It's part of the `next/router` package.

```jsx
import { useRouter } from 'next/router';

const MyComponent = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/another-page');
  };

  return <button onClick={handleClick}>Go to Another Page</button>;
};
```

- `withRouter` is a higher-order component (HOC) that provides the router object
  as a prop to the wrapped component.

```jsx
import { withRouter } from 'next/router';

const MyComponent = ({ router }) => {
  const handleClick = () => {
    router.push('/another-page');
  };

  return <button onClick={handleClick}>Go to Another Page</button>;
};

export default withRouter(MyComponent);
```

## Redirecting

### Client-Side Redirection

Client-side redirection is typically used for user-triggered actions, such as
form submissions or button clicks. It leverages the `useRouter` hook from
`next/router`.

```jsx
import { useRouter } from 'next/router';

const MyComponent = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/new-page'); // or router.replace('/new-page') for replacing history
  };

  return <button onClick={handleRedirect}>Go to new page</button>;
};
```

### Server-Side Redirection

#### `getServerSideProps` and `getStaticProps`

For server-side redirection, you can use `getServerSideProps` to handle
redirections before the page loads on the client or `getStaticProps` to redirect
to another page during the build process.

```jsx
export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/new-page',
      permanent: false, // Set to true for permanent redirect
    },
  };
}

const MyPage = () => {
  return <div>Redirecting...</div>;
};

export default MyPage;
```

#### Middleware Redirection

With middleware, you can intercept requests and redirect them before they reach
the intended page.

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname === '/old-page') {
    return NextResponse.redirect('/new-page');
  }
}
```

#### Global Redirections

This method is suitable for defining redirects that apply to all requests
matching a certain pattern. It's configured in `next.config.js`.

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true, // Set to false for temporary redirect
      },
    ];
  },
};
```
