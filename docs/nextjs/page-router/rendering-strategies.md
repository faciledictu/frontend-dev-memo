---
sidebar_position: 6
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

## Choosing the Right Rendering Strategy

### Data Freshness

- SSG: Use for pages where data does not change frequently.
- SSR: Use for pages where data changes frequently or must be fresh on each
  request.
- CSR: Use for parts of the page where data can be loaded dynamically after the
  initial page load.

### Performance

- SSG: Offers the best performance for static content as it’s pre-rendered.
- SSR: Adds server load and might increase response time since pages are
  rendered on each request.
- CSR: Reduces initial server load but might affect client performance due to
  additional JavaScript execution.

### SEO

- SSG and SSR: Both are SEO-friendly as they pre-render content, which is
  beneficial for search engine indexing.
- CSR: May not be ideal for SEO since content is loaded dynamically and may not
  be indexed properly by search engines.

### User Experience

- SSG: Provides fast load times for static content.
- SSR: Ensures that users see the most up-to-date content on each visit.
- CSR: Allows for dynamic, interactive content that updates without a full page
  reload.
