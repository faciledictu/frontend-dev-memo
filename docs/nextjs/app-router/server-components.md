---
sidebar_position: 3
---

# Server Components

One of the key features of App Router system is the ability to use Server
Components.

Server Components allow you to offload the rendering of components to the
server, improving performance by reducing the amount of JavaScript that needs to
be sent to the client.

All components are treated as React Server Components by default.

In the following example, the `UsersPage` component fetches data on the server
and renders a list of users. This approach ensures that the user data is
available immediately when the page loads, improving both performance and SEO.

```javascript title="app/users/page.js"
import { fetchUsers } from '../lib/api';

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## When to Use

- **When your component relies on data that can be fetched on the server**, such
  as from a database or an external API, using a Server Component can reduce
  client-side JavaScript and improve performance.

- **For pages that require better SEO**, server-side rendering ensures that the
  content is fully rendered when the page is served to the client, making it
  more accessible to search engines.

- **For reducing the initial load time** of your page since the server can send
  fully rendered HTML to the client.

- **When results can be cached** and used again on future requests and across
  users.

- **When you need to handle sensitive data** or perform operations that should
  not be exposed to the client.

## Rendering Strategies

There are three different server rendering strategies.

### Static Rendering

With static rendering, routes are pre-rendered **at build time** and the results
are cached.

This approach is suitable for content that doesn't change frequently, like blog
posts or product pages. The pre-rendered HTML is served quickly, enhancing
performance and reducing server load.

### Dynamic Rendering

Dynamic rendering occurs **at request time**, providing personalized content or
data that changes frequently.

If **a dynamic function** or **uncached data request** is found during
rendering, Next.js will render the whole route dynamically.

:::note

Dynamic functions use information known at request time, such as cookies and
headers (`cookies()` and `headers()` functions), or search parameters
(`searchParams` prop).

:::

### Streaming

Streaming allows you to progressive output the page. The hole work is splitted
into chunks and streamed to the client as it is ready. This improves the
time-to-interactive by allowing users to see and interact with parts of the page
sooner, even before all data is fetched and rendered.

Streaming is built into the Next.js App Router by default.

To take advantage of all streaming capabilities, you need to create a file
`loading.js` in the route folder.

```javascript
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />;
}
```

In the same folder, `loading.js` will be nested inside `layout.js`. It will
automatically wrap the `page.js` file and any children below in a `<Suspense>`
boundary. It can be represented this way:

```palintext title="Component Hierarchy"
(
  <Layout>                            <- export from layout.js
    <Header />
    <SideNav />
    <Suspense fallback={<Loading />}> <- export from loading.js
      <Page />                        <- export from page.js
    </Suspense>
  </Layout>
)``;
```
