---
sidebar_position: 1
---

# App Router

The App Router in Next.js is designed to facilitate seamless navigation and
efficient server-side rendering (SSR).

:::tip

The App Router takes priority over the Pages Router. Routes across directories
should not resolve to the same URL path and will cause a build-time error to
prevent a conflict.

:::

- Uses a file-based routing system. This allows for more intuitive and scalable
  routing.
- Supports nested layouts.
- Supports React's streaming and Suspense features, allowing parts of your UI to
  be progressively rendered and hydrated as data becomes available.
- API Routes Integration: The App Router can integrate with API routes, allowing
  you to fetch data on the server and pass it to Server Components seamlessly.

## Routing

The App Router uses the `app/` directory instead of the `pages/` directory.

Each directory in the app folder can contain a `page.js` file which corresponds
to a route.

Similar to the Page Router, dynamic routes can be created using square brackets.
For example, `app/blog/[slug]/page.js` will map to `/blog/:slug`.

### Route Grouping

Route Grouping helps in logically grouping routes together under a common
directory. The group name is enclosed in parentheses and does not appear in the
URL path.

For example, `app/(marketing)/about.js` will map to `/about`.

### Additional Files

- You can define a layout for a group of pages by adding a `layout.js` file
  inside a directory. The layout will wrap all pages within the directory.

- You can add a `loading.js` file to show a loading state for the pages within a
  directory.

- You can add an `error.js` file to handle errors within a specific route
  segment.

```plaintext
app/
├── layout.js          →  Wraps all pages with a common layout
├── page.js            →  /
├── about/
│   └── page.js        →  /about
├── blog/
│   ├── layout.js      →  Wraps all blog pages with a blog-specific layout
│   ├── page.js        →  /blog
│   └── [slug]/
│       └── page.js    →  /blog/:slug
├── (marketing)/
│   ├── about/
│   │   └── page.js    →  /about (same as above, route grouping)
│   └── contact/
│       └── page.js    →  /contact
├── dashboard/
│   ├── layout.js      →  Wraps all dashboard pages with a dashboard-specific layout
│   ├── page.js        →  /dashboard
│   ├── loading.js     →  Shows loading UI for dashboard
│   └── settings/
│       └── page.js    →  /dashboard/settings
└── api/
    └── user/
        └── route.js   →  /api/user
```
