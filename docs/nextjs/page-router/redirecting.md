---
sidebar_position: 7
---

# Redirecting

## Client-Side Redirection

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

### `getServerSideProps` and `getStaticProps`

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

### Middleware Redirection

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

### Global Redirections

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
