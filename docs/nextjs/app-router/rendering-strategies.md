---
sidebar_position: 5
---

# Rendering Strategies

On the server:

- React renders Server Components into a special data format called the React
  Server Component Payload (RSC Payload), which includes references to Client
  Components.
- Next.js uses the RSC Payload and Client Component JavaScript instructions to
  render HTML for the route on the server.

Then, on the client:

- The HTML is used to immediately show a fast non-interactive initial preview of
  the route.
- The React Server Components Payload is used to reconcile the Client and Server
  Component trees, and update the DOM.
- The JavaScript instructions are used to hydrate Client Components and make
  their UI interactive
