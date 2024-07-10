---
sidebar_position: 5
---

# Static Site Generation (SSG)

If a page uses Static Generation, the page HTML-code is generated once at build
time. This HTML is then reused on each request. It can be cached by a CDN.

In Next.js, you can statically generate pages with or without data.

## Pages without Data

If the page doesn't need to fetch external data to be pre-rendered (does not
have 'getServerSideProps' or 'getInitialProps'), Next.js generates a single HTML
file per page during build time using Static Generation.

## Pages with Data

If the page need external data before they can be shown, use these functions to
handle this:

- `getStaticProps`, if your page's content depends on external data.

- `getStaticPaths` along with `getStaticProps`, if your page's URLs depend on
  external data.

### Considerations for SSG

Pages suitable for SSG usually:

- Do not require user-specific data.
- Do not change frequently (or can use ISR for updates).
- Can benefit from improved load times.

Common examples include marketing pages (e.g., homepage, about us), blog posts,
documentation, product pages (for e-commerce).
