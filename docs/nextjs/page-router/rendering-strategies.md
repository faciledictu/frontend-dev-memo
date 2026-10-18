---
sidebar_position: 2
description:
  SSG, ISR, SSR and CSR in the Pages Router, hydration and hydration errors
tags: [junior, middle]
---

# Rendering Strategies

In the Pages Router the strategy is chosen **per page** by the data function it
exports: none or **`getStaticProps`** → **SSG** (HTML at build time), plus
`revalidate` → **ISR** (regenerated in the background), **`getServerSideProps`**
→ **SSR** (HTML on every request). **CSR** is fetching on the client after the
page has loaded. In every case the browser receives HTML first and then React
**hydrates** it.

Applies to: Next.js 16.4 (Pages Router).

## Details

### Comparison

|            | SSG                                   | ISR                                         | SSR                                | CSR                                      |
| ---------- | ------------------------------------- | ------------------------------------------- | ---------------------------------- | ---------------------------------------- |
| HTML made  | At build time                         | At build time, then again in the background | On every request                   | In the browser; the server sends a shell |
| Enabled by | No data function, or `getStaticProps` | `getStaticProps` with `revalidate`          | `getServerSideProps`               | `useEffect`, SWR, TanStack Query         |
| Freshness  | As of the build                       | At most `revalidate` seconds old            | Always fresh                       | Fresh, after loading                     |
| Speed      | Fastest, from a CDN                   | Like SSG                                    | Waits for the server and the data  | Fast shell, content later                |
| SEO        | Good                                  | Good                                        | Good                               | Worse: content is not in the HTML        |
| Fits       | Docs, blogs, marketing pages          | Catalogs, news                              | Personalized or always fresh pages | Dashboards, data behind a login          |

- A page **without** `getServerSideProps` or `getInitialProps` is static: it is
  prerendered at build time even if it fetches data on the client.
- The strategies mix: an SSG page can fetch user-specific parts on the client.

### Hydration

- **Hydration** attaches event handlers and state to server-rendered HTML. The
  first client render must produce the same markup as the server.
- A **hydration mismatch** happens when it does not: `Date.now()`,
  `Math.random()`, `window` or `localStorage` read during render, locale-based
  formatting, invalid HTML nesting (`<div>` inside `<p>`), browser extensions
  changing the DOM.
- Fixes: read browser-only values in `useEffect`, render the part only on the
  client (`next/dynamic` with `ssr: false`), or use `suppressHydrationWarning`
  for a single text node such as a timestamp.

## Follow-up Questions

- What is the difference between SSR and SSG? SSR renders on every request, SSG
  once at build time.
- When is ISR not a fit? For user-specific content: the regenerated page is
  shared by all users.
- Is CSR bad for SEO? Google runs JavaScript but indexes such pages later and
  less reliably; other crawlers and link previews often see only the shell.
- What is automatic static optimization? A page without a blocking data function
  is detected at build time and emitted as static HTML. A custom
  `getInitialProps` in `_app` turns it off for all pages.

## Common Mistakes

- "Pages are SSR by default." Without `getServerSideProps` or `getInitialProps`
  a page is prerendered statically.
- "ISR is SSR with a cache." The regenerated page is shared by all users, so it
  can't be personalized.
- `suppressHydrationWarning` on a whole subtree instead of moving the
  browser-only read into `useEffect`.

## See Also

- [Data Fetching](./data-fetching.mdx)
- [Rendering Strategies in the App Router](../app-router/server-components.mdx#rendering-strategies)
