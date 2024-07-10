---
sidebar_position: 3
---

# Client-side Rendering (CSR)

Client-side rendering (CSR) is a technique where the rendering of web pages
happens dynamically populated on the client side (browser).

## Ways to Enable

There are two ways to implement client-side rendering in Page Router:

- Use the `useEffect()` and `useEffect()` hook instead of the server-side
  rendering methods (`getStaticProps` and `getServerSideProps`).
- Use a data fetching library like SWR or TanStack Query to fetch data on the
  client (recomended).

For more details see [Client-Side Fetching](/docs/nextjs/page-router/data-fetching.mdx#client-side-fetching)

## Considerations for CSR

### Benefits

- **Rich Interactivity**. Since the rendering happens on the client side, it allows
  for a more interactive and dynamic user experience.

- **Reduced Server Load**. The server provides a basic HTML shell, reducing the load
  on the server.
  
- **Seamless Transitions**. Navigation between pages can be smooth and fast without
  full-page reloads.

### Limitations

- **The initial load time might be longer** because JavaScript needs to be
  fetched and executed before the page can render.

- **CSR can be less SEO-friendly** compared to SSR, as search engines may
  struggle to index content that requires JavaScript to display.
