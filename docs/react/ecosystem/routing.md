---
sidebar_position: 2
---

# React Router

React Router is a standard library for routing in React. It enables the
navigation among views of various components in a React Application, allows
changing the browser URL, and keeps the UI in sync with the URL.

:::note

The examples use the React Router v7 API. In v6 the API is the same, but the
imports come from `react-router-dom`.

:::

## Routers

React Router provides several routers that serve different purposes based on the
environment and use case.

- `BrowserRouter` uses HTML5 history API, ideal for web apps.
- `HashRouter` uses URL hash, ideal for static file serving without server
  configuration.
- `MemoryRouter` keeps history in memory, suitable for testing or non-browser
  environments.
- `StaticRouter` is used for server-side rendering, does not manage history.
- `createBrowserRouter` with `RouterProvider` creates a _data router_: routes
  are described as objects and can load data before rendering (`loader`) and
  handle mutations (`action`).

## Routes and Links

- The `Route` component is used to define the mapping between the URL and the
  corresponding element.
- The `Link` component is used to create links that navigate to different
  routes.

## Routes Wrapper

The `Routes` component looks through its child routes and renders the one that
matches the current location best.

- The order of the `Route` components doesn't matter: `Routes` ranks all matches
  and picks the most specific one.
- Paths are matched exactly, so there is no `exact` prop. To match everything
  below a path, add `/*` to the end of it.
- A route with `path="*"` matches anything that other routes didn't, so it is
  used for a "Not Found" page.

```jsx
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import NotFound from './NotFound';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* This will render if none of the above routes match */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

:::info[What Changed since v5]

In React Router v5 the wrapper was called `Switch`, it rendered the first route
that matched in order, and routes received a component via the `component` prop
and needed `exact`. `Redirect`, `useHistory` and `useRouteMatch` are also v5
API: they were replaced by `Navigate`, `useNavigate` and `useMatch`.

:::

### Nested Routes

Child routes are declared inside the parent `Route`. The parent element renders
the matched child in the place where it puts the `Outlet` component.

```jsx
import { Outlet, Route, Routes } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="stats" element={<Stats />} />
      </Route>
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      {/* Overview, Profile or Stats will be rendered here */}
      <Outlet />
    </div>
  );
}
```

### Redirects

The `Navigate` component changes the location when it is rendered.

```jsx
import { Navigate, Route, Routes } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/old-path" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
```

### Hooks

#### `useNavigate()`

A hook that returns a function to navigate programmatically.

```jsx
import { useNavigate } from 'react-router';

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate('/new-path')}>Go to new path</button>
      <button onClick={() => navigate(-1)}>Go back</button>
    </>
  );
}
```

#### `useLocation()`

A hook that returns the location object that represents the current URL.

```jsx
import { useLocation } from 'react-router';

function DisplayCurrentLocation() {
  const location = useLocation();

  return (
    <div>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search}</p>
      <p>Hash: {location.hash}</p>
      <p>State: {JSON.stringify(location.state)}</p>
    </div>
  );
}
```

- `pathname` represents the path of the URL.
- `search` contains query parameters (e.g., `?key=value`) of the URL.
- `hash` contains the hash portion (e.g., `#section`) of the URL.
- `state` is an optional state object associated with the location, useful for
  passing additional data between routes.

#### `useParams()`

It returns an object of key/value pairs of URL parameters.

```jsx
import { useParams } from 'react-router';

function UserProfile() {
  const { userId } = useParams();
  return <div>User ID: {userId}</div>;
}

// Route definition
<Route path="/user/:userId" element={<UserProfile />} />;
```

#### `useSearchParams()`

It works like `useState` for the query string: returns the current
`URLSearchParams` and a function to update them.

```jsx
import { useSearchParams } from 'react-router';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  return (
    <input
      value={query}
      onChange={(e) => setSearchParams({ q: e.target.value })}
    />
  );
}
```
