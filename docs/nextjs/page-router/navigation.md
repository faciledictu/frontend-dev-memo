---
sidebar_position: 2
---

# Navigation

- **Client-side Navigation** Handles client-side navigation between pages using
  Next.js's optimized `<Link>` component, which preloads linked pages for faster
  navigation.

- `useRouter` hook allows you to access the router object and navigate
  programmatically. It's part of the next/router package.

```javascript
import { useRouter } from 'next/router';

const MyComponent = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/another-page');
  };

  return <button onClick={handleClick}>Go to Another Page</button>;
};
```

- `withRouter` A higher-order component (HOC) that provides the router object as
  a prop to the wrapped component.

```javascript
import { withRouter } from 'next/router';

const MyComponent = ({ router }) => {
  const handleClick = () => {
    router.push('/another-page');
  };

  return <button onClick={handleClick}>Go to Another Page</button>;
};

export default withRouter(MyComponent);
```
