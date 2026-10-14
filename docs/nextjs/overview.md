---
sidebar_position: 1
description:
  What Next.js adds to React, App Router vs Pages Router, when not to use it
---

# Next.js Overview

**Next.js** is a React framework by Vercel. It adds what React leaves to you:
**file-based routing**, **server rendering** (static prerendering, rendering on
request, streaming), data fetching and caching, **server code next to the UI**
(Server Components, Server Actions, Route Handlers) and a build with code
splitting and image, font and script optimization. There are two routers: the
current **App Router** (`app/`) and the legacy **Pages Router** (`pages/`).

Applies to: Next.js 16.

## Details

### What Next.js Adds to React

| Area         | What it gives                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| Routing      | A folder or file is a route; nested layouts, dynamic segments                                                         |
| Rendering    | Static prerendering, rendering on request, streaming, ISR (regenerating a static page in the background)              |
| Server code  | Server Components, Server Actions, Route Handlers (HTTP endpoints), Proxy (code that runs before a request is routed) |
| Optimization | Code splitting per route, `next/image`, `next/font`, `next/script`                                                    |
| Tooling      | Turbopack bundler, TypeScript, CSS Modules, Sass, Tailwind                                                            |

### App Router vs Pages Router

|                 | App Router (`app/`)                          | Pages Router (`pages/`)                                           |
| --------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| Status          | Recommended, stable since 13.4               | Legacy, still supported                                           |
| Components      | Server Components by default                 | Client components only (prerendered on the server, then hydrated) |
| Data fetching   | `async` components, `fetch`, `'use cache'`   | `getStaticProps`, `getServerSideProps`                            |
| Layouts         | Nested `layout.js`, kept between navigations | One `_app.js`                                                     |
| Loading, errors | `loading.js`, `error.js`, streaming          | Written by hand                                                   |
| Mutations       | Server Actions                               | API Routes and `fetch`                                            |
| HTTP endpoints  | Route Handlers (`route.js`)                  | API Routes (`pages/api`)                                          |

Both routers can live in one project, which allows a gradual migration, but one
URL must be served by only one of them.

### Recent Versions

| Version | What changed                                                                                                                                               |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 15      | `fetch` and `GET` Route Handlers are no longer cached by default; `params`, `searchParams`, `cookies()`, `headers()` became async; React 19                |
| 16      | Turbopack is the default bundler; `middleware` renamed to `proxy`; Cache Components (`'use cache'`); synchronous request APIs removed; `next lint` removed |
| 16.4    | Cache Components recommended for all apps and enabled in new projects; it becomes the default in Next.js 17                                                |

### When Next.js Is Not Needed

- **An app behind a login** (admin panel, dashboard), where SEO and the first
  load matter less: a client-side SPA on Vite is simpler to build and host.
- **A content site with little interactivity**: Astro or another static site
  generator ships less JavaScript.
- **No Node.js hosting**: only a static export (`output: 'export'`) is possible,
  and it loses everything that needs a server.

## Follow-up Questions

- What is the difference between SSR and SSG? SSR renders HTML on every request;
  SSG renders it once at build time and serves the same file. See
  [Rendering Strategies](./app-router/server-components.mdx#rendering-strategies).
- Why is Next.js called a full-stack framework? Server Components, Server
  Actions and Route Handlers run on the server and can read a database directly.
- Why are `params` and `cookies()` async since Next.js 15? So that the part of a
  page that does not depend on the request can be prerendered, and only the part
  that awaits them waits for the request.

## See Also

- [App Router](./app-router/overview.md)
- [Server Components](./app-router/server-components.mdx)
- [Caching](./app-router/caching.md)
- [Pages Router](./page-router/overview.md)
