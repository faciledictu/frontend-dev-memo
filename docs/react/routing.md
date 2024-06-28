---
sidebar_position: 26
---

# React Router

React Router is a standard library for routing in React. It enables the
navigation among views of various components in a React Application, allows
changing the browser URL, and keeps the UI in sync with the URL.

## Routers

React Router provides several router components that serve different purposes
based on the environment and use case. Here’s a breakdown of the main types of
routers in React Router

- `BrowserRouter`uses HTML5 history API, ideal for web apps.
- `HashRouter`uses URL hash, ideal for older browsers or static file serving.
- `MemoryRouter`keeps history in memory, suitable for testing or non-browser
  environments.
- `StaticRouter` used for server-side rendering, does not manage history.
- `NativeRouter` designed for React Native applications.

## Routes and Links

- The `Route` component is used to define the mapping between the URL and the
  corresponding component.
- The `Link` component is used to create links that navigate to different
  routes.

## Routes Wrapper

The `Switch` or `Routes` component will only render the first child Route that
matches the location.

:::info What is the Difference

As of React Router v6, the `Switch` component has been replaced by the `Routes`
component. The `Routes` component provides similar functionality with some
enhancements and changes in the API.

:::

- The order of the Route components within the `Routes` determines the matching.
  The `Routes` component stops checking further routes as soon as it finds a
  match.
- `exact` is used on the root route `/` to ensure that it only matches exactly
  `/` and not any sub-paths.

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} /> {/* This will render if none of the above routes match */}
      </Routes>
    </Router>
  );
}

export default App;
```

:::note

By rendering only the first matching route, it avoids rendering multiple
components for a single path.

:::

### Nested Routes

```jsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/settings" component={Settings} />
      </Routes>
    </Router>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Routes>
        <Route path="/dashboard/profile" component={Profile} />
        <Route path="/dashboard/stats" component={Stats} />
      </Routes>
    </div>
  );
}
```

### Redirects and Default Routes

The `Redirect` component is used to navigate programmatically. As the last
route, it is common to have a fallback "Not Found" page for unspecified routes.

```jsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Redirect from="/old-path" to="/new-path" />
        <Route component={NotFound} />
      </Routes>
    </Router>
  );
}
```

### Hooks

#### `useHistory()`

A hook that gives you access to the history instance that you can use to
navigate.

:::tip

Typically, you access the history object via the useHistory hook or `withRouter`
HOC.

:::

```jsx
import { useHistory } from 'react-router-dom';

function Home() {
  let history = useHistory();

  function handleClick() {
    history.push('/new-path');
  }

  return <button onClick={handleClick}>Go to new path</button>;
}
```

#### `useLocation()`

A hook that returns the location object that represents the current URL.

```jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function DisplayCurrentLocation() {
  const location = useLocation();

  return (
    <div>
      <h2>Current Location</h2>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search}</p>
      <p>Hash: {location.hash}</p>
      <p>State: {JSON.stringify(location.state)}</p>
    </div>
  );
}

export default DisplayCurrentLocation;
```

- `pathname` represents the path of the URL.
- `search` contains query parameters (e.g., `?key=value`) of the URL.
- `hash` contains the hash portion (e.g., `#section`) of the URL.
- `state` is an optional state object associated with the location, useful for
  passing additional data between routes.

#### `useParams()`

It returns an object of key/value pairs of URL parameters.

```jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  let { userId } = useParams();
  return <div>User ID: {userId}</div>;
}

// Route definition
<Route path="/user/:userId" component={UserProfile} />;
```

#### `useRouteMatch()`

It returns the match object, which contains properties like path, url, params,
isExact, etc., providing detailed information about the route match.

```jsx
import React from 'react';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';

function UserProfile() {
  const match = useRouteMatch();

  return (
    <div>
      <h2>User Profile</h2>
      <p>Matched Path: {match.path}</p>
      <p>Matched URL: {match.url}</p>
    </div>
  );
}

function App() {
  return (
    <Switch>
      <Route path="/user/:userId" component={UserProfile} />
      <Route path="/" exact>
        <h2>Home Page</h2>
        <Link to="/user/123">Go to User Profile</Link>
      </Route>
    </Switch>
  );
}

export default App;
```

#### Custom Hook Example

```jsx
import { useHistory, useLocation, useParams } from 'react-router-dom';

const useRouting = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const navigateTo = (path) => {
    history.push(path);
  };

  const goBack = () => {
    history.goBack();
  };

  return {
    location,
    params,
    navigateTo,
    goBack,
  };
};

export default useRouting;
```

- Inside the useRouting hook, we use `useHistory()` to get access to the history
  object, which allows us to navigate programmatically (e.g., push to a new
  route, go back).
- `useLocation()` gives us access to the current location object, which contains
  information about the current URL.
- `useParams()` provides access to the parameters parsed from the URL.

Usage

```jsx
import useRouting from './useRouting';

const MyComponent = () => {
  const { location, params, navigateTo, goBack } = useRouting();

  const handleButtonClick = () => {
    navigateTo('/some/other/path');
  };

  return (
    <div>
      <p>Current Location: {location.pathname}</p>
      <p>Route Parameters: {JSON.stringify(params)}</p>
      <button onClick={handleButtonClick}>Go to /some/other/path</button>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

export default MyComponent;
```
