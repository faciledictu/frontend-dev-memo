---
sidebar_position: 1
description:
  React Router modes, nested routes, navigation hooks, loaders and protected
  routes
tags: [junior, middle]
---

# React Router

**React Router** maps the URL to a tree of components and keeps them in sync
without a page reload. Routes are **nested**: a parent route renders the layout
and an **`<Outlet />`**, where the matched child route appears. There are three
ways to use it: **declarative** (`<BrowserRouter>` with `<Routes>`), **data**
(`createBrowserRouter` with loaders and actions) and **framework** (a Vite
plugin with route modules and SSR, the successor of Remix).

Applies to: React Router 8. In v7 the API is almost the same; in v6 everything
is imported from `react-router-dom`, which is not published for v8 (everything
is in `react-router`).

## Details

### Modes

| Mode        | Setup                                      | Adds                                                                   |
| ----------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| Declarative | `<BrowserRouter>`, `<Routes>`, `<Route>`   | URL matching, navigation, nested layouts                               |
| Data        | `createBrowserRouter` + `<RouterProvider>` | `loader`, `action`, pending and error UI, lazy routes, `fetcher`       |
| Framework   | `@react-router/dev` Vite plugin            | Route modules listed in `routes.ts`, SSR, code splitting, typed routes |

### Building Blocks

| API                       | What it does                                                                |
| ------------------------- | --------------------------------------------------------------------------- |
| `<Route path element>`    | Renders `element` when `path` matches. Children are nested routes           |
| `<Route index>`           | The default child, rendered at the parent's own URL                         |
| `<Route path="*">`        | Matches anything that other routes did not: the "Not Found" page            |
| `<Outlet />`              | The place in a parent route where the matched child is rendered             |
| `<Link to>`               | An `<a>` that navigates with the History API instead of reloading the page  |
| `<NavLink to>`            | A `Link` that knows if it is active (`aria-current`, `className` callback)  |
| `<Navigate to replace />` | Redirects when it is rendered                                               |
| `:id`, `:lang?`, `*`      | Dynamic segment, optional segment, splat (the rest of the path) in a `path` |

Routes are **ranked**, not checked in order: the most specific match wins, so
there is no `exact` prop and the order of `<Route>` elements does not matter.

### Hooks

| Hook                | Returns                                                                        |
| ------------------- | ------------------------------------------------------------------------------ |
| `useNavigate()`     | `navigate('/path')`, `navigate(-1)`, `navigate('/path', { replace: true })`    |
| `useParams()`       | Values of dynamic segments: `{ userId: '42' }` (always strings)                |
| `useSearchParams()` | `[searchParams, setSearchParams]`, like `useState` for the query string        |
| `useLocation()`     | The current location: `pathname`, `search`, `hash`, `state`                    |
| `useLoaderData()`   | Data mode: what the route `loader` returned                                    |
| `useNavigation()`   | Data mode: `state` of the current navigation (`idle`, `loading`, `submitting`) |
| `useRouteError()`   | Data mode: the error inside a route `ErrorBoundary`                            |

### Data Mode

- A **`loader`** runs before the route renders. Loaders of all matched nested
  routes run in parallel, so there is no request waterfall.
- An **`action`** handles a `<Form>` submission. After it, the loaders on the
  page are revalidated automatically.
- An error thrown in a loader, an action or during rendering is shown by the
  nearest route **`ErrorBoundary`**.
- `redirect('/login')` returned or thrown from a loader redirects before
  anything is rendered.
- **`lazy`** loads the route module (component, loader) on demand: code
  splitting per route.

### Protected Routes

- Declarative mode: a layout route that checks the user and renders either
  `<Outlet />` or `<Navigate to="/login" replace />`.
- Data mode: `throw redirect()` from route **middleware** on the protected
  branch: it runs before any loader. A check in a parent `loader` does not stop
  the child loaders, because they run in parallel.
- Either way it is only UX: the real check is on the server.

<details>
<summary>Routers</summary>

| Router          | URL is stored in                  | Use case                                             |
| --------------- | --------------------------------- | ---------------------------------------------------- |
| `BrowserRouter` | The path, through the History API | Regular web apps                                     |
| `HashRouter`    | The part after `#`                | Static hosting that can't serve the app for any path |
| `MemoryRouter`  | Memory                            | Tests, non-browser environments                      |
| `StaticRouter`  | A value passed in, never changes  | Server-side rendering                                |

The data-mode counterparts are `createBrowserRouter`, `createHashRouter`,
`createMemoryRouter` and `createStaticRouter`.

</details>

<details>
<summary>What changed since v5</summary>

| v5                           | v6 and later                          |
| ---------------------------- | ------------------------------------- |
| `<Switch>`, first match wins | `<Routes>`, best match wins           |
| `component={Home}`, `render` | `element={<Home />}`                  |
| `exact`                      | Not needed; `path="users/*"` for deep |
| `<Redirect>`                 | `<Navigate>`                          |
| `useHistory()`               | `useNavigate()`                       |
| `useRouteMatch()`            | `useMatch()`                          |
| Nested `<Route>` in children | Nested `<Route>` + `<Outlet />`       |

</details>

## Example

Declarative mode: a shared layout, a dynamic segment, a redirect, a protected
branch and a "Not Found" page.

```jsx
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router';
import { useAuth } from './auth';
import { Home, Login, NotFound, Settings } from './pages';

function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/users/42">User</NavLink>
      </nav>
      {/* The matched child route is rendered here */}
      <Outlet />
    </>
  );
}

function User() {
  const { userId } = useParams();
  return <h1>User {userId}</h1>;
}

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Remember where the user was going
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users/:userId" element={<User />} />
          <Route path="profile" element={<Navigate to="/settings" replace />} />
          <Route element={<RequireAuth />}>
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Data mode: the route loads its data before rendering, and another route is
loaded lazily.

```jsx
import { createBrowserRouter, redirect, useLoaderData } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { getUser } from './auth';
import { ErrorPage, Layout, Login } from './pages';

async function userLoader({ params }) {
  if (!getUser()) {
    throw redirect('/login');
  }

  const response = await fetch(`/api/users/${params.userId}`);
  if (!response.ok) {
    throw new Response('Not Found', { status: 404 });
  }

  return response.json();
}

function User() {
  const user = useLoaderData();
  return <h1>{user.name}</h1>;
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    ErrorBoundary: ErrorPage,
    children: [
      { path: 'login', Component: Login },
      { path: 'users/:userId', loader: userLoader, Component: User },
      // The module exports `Component` and, optionally, `loader`
      { path: 'reports', lazy: () => import('./reports') },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

## Follow-up Questions

- How is `<Link>` different from `<a>`? `Link` renders an `<a>`, but intercepts
  the click and calls `history.pushState`, so the page is not reloaded and the
  state is kept.
- Why does a page return 404 after a reload with `BrowserRouter`? The server
  must return `index.html` for every path; `HashRouter` avoids it because the
  part after `#` is not sent to the server.
- How to pass data to another route? URL params and search params for anything
  that should survive a reload or be shared by a link; `state` in `navigate` or
  `Link` for transient data.
- How to split the code by routes? `lazy` in data mode, or `React.lazy` with
  `Suspense` in declarative mode.
- A loader or fetching in `useEffect`? Loaders of all matched routes run in
  parallel before render: no request waterfall and no loading flicker, and the
  data is revalidated after an action.
- What is a layout (pathless) route? A `<Route>` without `path` that only wraps
  its children, like the `RequireAuth` route in the example.

## Common Mistakes

- Mixing the v5 API (`Switch`, `component`, `useHistory`) with v6+ code.
- Forgetting `<Outlet />` in a parent route: child routes match but nothing is
  rendered.
- Calling `navigate()` during render. Use `<Navigate>` or call it in an event
  handler or an effect.
- Using `<a href>` for internal links and losing the app state on every click.
- Treating a protected route as a security measure.

## See Also

- [Bundle Optimization](../../web-platform/tools/bundle-optimization.md)
- [Authentication](../../web-platform/network/authentication.md)
