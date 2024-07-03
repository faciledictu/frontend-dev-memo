---
sidebar_position: 4
---

# Server-side Rendering (SSR)

SSR in Next.js involves rendering React components on the server-side before
sending them to the client.

## How SSR Works

1. Server-side Execution: When a user requests a page, Next.js executes the
   React component on the server.

2. Generating HTML: The server renders the React component to HTML, including
   any data fetching or computations needed.

3. Sending HTML to Client: The rendered HTML is sent to the client's browser as
   the initial response.

## Ways to Enable

### Page-level SSR

By default, pages in Next.js are SSR-enabled. Define pages under the pages
directory (pages/index.js, pages/about.js, etc.).

```javascript
// pages/index.js
import React from 'react';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      {/* Content */}
    </div>
  );
}

export default HomePage;
```

#### Pages with Data

Use `getServerSideProps()` to fetch data for SSR at the page level. This
function runs on every request and passes fetched data as props to the page
component.

```javascript
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  return {
    props: { data },
  };
}
```

### Component-level SSR

Use `getInitialProps` for component-level SSR when needed. This method is used
within any component, not just pages.

```javascript
// components/ExampleComponent.js
import React from 'react';

function ExampleComponent({ data }) {
  return (
    <div>
      <p>{data}</p>
    </div>
  );
}

ExampleComponent.getInitialProps = async () => {
  // Fetch data from an API or database
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  // Return data to be passed as props
  return { data };
};

export default ExampleComponent;
```

## Considerations for SSR

- **SSR can improve perceived performance** by sending pre-rendered HTML to
  clients.
- **Search engines index SSR content effectively** since the initial HTML
  contains rendered content.
- SSR may require careful handling of client-side specific features like browser
  APIs and global state management
