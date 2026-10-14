---
sidebar_position: 2
---

# Rendering Strategies

Next.js supports three main rendering strategies:

1. Static Site Generation (SSG): Pages are generated at build time.
2. Server-Side Rendering (SSR): Pages are generated on each request.
3. Client-Side Rendering (CSR): Pages are rendered on the client side after the
   initial load.

You can mix and match these strategies within your Next.js application to
implement **hybrid rendering**.

:::tip

Consider the complexity of your data-fetching logic and how often the data
changes. More complex requirements might benefit from a hybrid approach.

:::

## Static Site Generation (SSG)

If a page uses Static Generation, the page's HTML is generated once at build
time. This HTML is then reused on each request. It can be cached by a CDN.

In Next.js, you can statically generate pages with or without data.

### Pages without Data

If the page doesn't need to fetch external data to be pre-rendered (does not
have `getServerSideProps` or `getInitialProps`), Next.js generates a single HTML
file per page during build time using Static Generation.

### Pages with Data

If the page needs external data before it can be shown, use these functions to
handle this:

- `getStaticProps`, if your page's content depends on external data.

- `getStaticPaths` along with `getStaticProps`, if your page's URLs depend on
  external data.

#### Considerations for SSG

Pages suitable for SSG usually:

- Do not require user-specific data.
- Do not change frequently (or can use ISR for updates).
- Can benefit from improved load times.

Common examples include marketing pages (e.g., homepage, about us), blog posts,
documentation, product pages (for e-commerce).

## Server-side Rendering (SSR)

SSR in Next.js involves rendering React components on the server before sending
them to the client.

### How SSR Works

1. Server-side Execution: When a user requests a page, Next.js executes the
   React component on the server.

2. Generating HTML: The server renders the React component to HTML, including
   any data fetching or computations needed.

3. Sending HTML to Client: The rendered HTML is sent to the client's browser as
   the initial response.

### Ways to Enable

#### Pages with Data

Use `getServerSideProps()` to fetch data for SSR at the page level. This
function runs on every request and passes fetched data as props to the page
component.

### Considerations for SSR

#### Benefits

- **SSR can improve perceived performance** by sending pre-rendered HTML to
  clients.
- **Search engines index SSR content effectively** since the initial HTML
  contains rendered content.

#### Limitations

- SSR doesn't support client-side-specific features like browser APIs (location
  access, event handling, etc.) and state management.

## Client-side Rendering (CSR)

Client-side rendering (CSR) is a technique where the rendering of web pages
happens dynamically on the client side (browser).

### Ways to Enable

There are two ways to implement client-side rendering in Page Router:

- Use the `useState()` and `useEffect()` hooks instead of the server-side
  rendering methods (`getStaticProps` and `getServerSideProps`).
- Use a data fetching library like SWR or TanStack Query to fetch data on the
  client (recommended).

For more details see
[Client-Side Fetching](./data-fetching.mdx#client-side-fetching)

### Considerations for CSR

#### Benefits

- **Rich Interactivity**. Since the rendering happens on the client side, it
  allows for a more interactive and dynamic user experience.

- **Reduced Server Load**. The server provides a basic HTML shell, reducing the
  load on the server.

- **Seamless Transitions**. Navigation between pages can be smooth and fast
  without full-page reloads.

#### Limitations

- **The initial load time might be longer** because JavaScript needs to be
  fetched and executed before the page can render.

- **CSR can be less SEO-friendly** compared to SSR, as search engines may
  struggle to index content that requires JavaScript to display.

## Choosing the Right Rendering Strategy

### Data Freshness

- SSG: Use for pages where data does not change frequently.
- SSR: Use for pages where data changes frequently or must be fresh on each
  request.
- CSR: Use for parts of the page where data can be loaded dynamically after the
  initial page load.

### Performance

- SSG: Offers the best performance for static content as it's pre-rendered.
- SSR: Adds server load and might increase response time since pages are
  rendered on each request.
- CSR: Reduces initial server load but might affect client performance due to
  additional JavaScript execution.

### SEO

- SSG and SSR: Both are SEO-friendly as they pre-render content, which is
  beneficial for search engine indexing.
- CSR: Might not be ideal for SEO since content is loaded dynamically and may
  not be indexed properly by search engines.

### User Experience

- SSG: Provides fast load times for static content.
- SSR: Ensures that users see the most up-to-date content on each visit.
- CSR: Allows for dynamic, interactive content that updates without a full page
  reload.
