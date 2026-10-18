---
sidebar_position: 7
description:
  REST vs GraphQL - over- and under-fetching, caching, errors, N+1, versioning,
  and where tRPC fits
tags: [middle, senior]
---

# REST vs GraphQL

**REST** exposes **resources** at many URLs and uses HTTP itself: methods,
status codes, **HTTP caching**. **GraphQL** exposes **one endpoint** with a
**typed schema**; the client sends a **query** that names exactly the fields it
needs, and nested data comes in **one request**. GraphQL removes
**over-fetching** and **under-fetching** and gives typed contracts, but moves
the complexity to the server and the client cache: HTTP caching, status codes
and rate limiting no longer work out of the box.

## Details

### Comparison

|                     | REST                                                      | GraphQL                                                                  |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| Endpoints           | One per resource: `/users/1`, `/users/1/posts`            | One: `POST /graphql`                                                     |
| Who shapes the data | The server                                                | The client, within the schema                                            |
| Fetching            | Over-fetching (extra fields), under-fetching (N requests) | Exactly the requested fields, nested data in one round trip              |
| Contract            | Optional: OpenAPI                                         | Required: the schema, introspection, generated types                     |
| Caching             | HTTP: `Cache-Control`, `ETag`, CDN                        | Usually `POST`, so a client cache normalized by `__typename` + `id`      |
| Errors              | Status codes                                              | Field errors come in `errors` next to partial `data`, usually with `200` |
| Changes             | New version (`/v2`) or a new endpoint                     | Add fields, mark old ones `@deprecated`; no versions                     |
| Real time           | WebSocket or SSE separately                               | Subscriptions in the schema (over WebSocket or SSE)                      |
| Files               | Plain `multipart/form-data`                               | Not in the spec: a separate REST endpoint or a multipart extension       |

HTTP methods, status codes and caching headers themselves are in
[HTTP](./http.md).

### GraphQL Terms

- **Schema**: types and their fields, written in SDL. Entry points are `Query`
  (read), `Mutation` (write) and `Subscription` (a stream of events).
- **Resolver**: a server function that returns the value of one field. The
  server walks the query and calls a resolver for every field.
- **Variables** are passed separately from the query text: `query ($id: ID!)`.
  Building the query string from user input is the GraphQL version of an
  injection.
- **Fragments** reuse a set of fields; in Relay each component declares the
  fragment of data it needs.

### Problems GraphQL Brings

- **N+1 on the server**: a list of 50 posts with `author` calls the `author`
  resolver 50 times. **DataLoader** batches the calls made in one tick into one
  request (`WHERE id IN (…)`) and caches them per request.
- **Expensive queries**: a client can ask for deeply nested data. Servers limit
  depth and complexity, and production apps often accept only **persisted
  queries** (a hash of a query registered at build time), which also allows
  `GET` and CDN caching.
- **Caching**: one URL and `POST` defeat HTTP caches. Apollo Client, Relay and
  urql keep a normalized cache: an object updated by a mutation changes
  everywhere it is shown.
- **Errors**: a response can be `200` with `data` and `errors` at the same time;
  the client checks the body, not only the status.
- **Monitoring and rate limiting** see one endpoint; they work per operation
  name or query cost, not per URL.

### When to Choose Which

- **REST**: public APIs, simple CRUD, data that benefits from HTTP and CDN
  caching, file downloads and uploads, teams without a GraphQL server.
- **GraphQL**: many clients (web, mobile) with different data needs, deeply
  related data, a single gateway over several services, fast-changing UIs.
- A **BFF** (backend for frontend) solves the same problem as GraphQL with REST:
  a server that aggregates services into endpoints shaped for one client.
- **RPC**: endpoints are functions, not resources. **tRPC** calls server
  procedures from a TypeScript client with types inferred directly from the
  server code, without a schema or codegen; it fits a full-stack TypeScript
  monorepo, not a public API. **gRPC** (Protobuf over HTTP/2) is for
  service-to-service calls; browsers need gRPC-Web or Connect.

## Example

A post page needs the post title, the author's name and the comment count.

REST: three requests, each returning full objects (over-fetching), and the
second waits for the first (under-fetching):

```javascript
const post = await (await fetch('/api/posts/42')).json();
const [author, comments] = await Promise.all([
  fetch(`/api/users/${post.authorId}`).then((r) => r.json()),
  fetch(`/api/posts/42/comments`).then((r) => r.json()),
]);
console.log(post.title, author.name, comments.length);
```

GraphQL: one request that returns only these fields:

```javascript
const query = `
  query PostPage($id: ID!) {
    post(id: $id) {
      title
      author { name }
      commentCount
    }
  }
`;

const response = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  // highlight-next-line
  body: JSON.stringify({ query, variables: { id: '42' } }),
});
const { data, errors } = await response.json(); // check `errors` even with 200
console.log(data.post);
// { title: 'Hello', author: { name: 'Ada' }, commentCount: 2 }
```

<details>
<summary>The schema and resolvers behind it (graphql-js)</summary>

```javascript
import { buildSchema, graphql } from 'graphql';

const schema = buildSchema(`
  type User { id: ID!, name: String! }
  type Post { id: ID!, title: String!, author: User!, commentCount: Int! }
  type Query { post(id: ID!): Post }
`);

const users = { 1: { id: '1', name: 'Ada' } };
const posts = { 42: { id: '42', title: 'Hello', authorId: '1', comments: 2 } };

// Default resolvers read properties; a function receives the arguments
const rootValue = {
  post: ({ id }) => {
    const post = posts[id];
    return (
      post && {
        ...post,
        author: () => users[post.authorId], // called only if `author` is asked for
        commentCount: post.comments,
      }
    );
  },
};

const result = await graphql({
  schema,
  source: '{ post(id: "42") { title author { name } commentCount } }',
  rootValue,
});
console.log(JSON.stringify(result.data));
// {"post":{"title":"Hello","author":{"name":"Ada"},"commentCount":2}}
```

</details>

## Follow-up Questions

- Is GraphQL faster than REST? Not by itself: it saves round trips and bytes for
  the client, but every query is parsed, validated and resolved on the server,
  and without DataLoader it can make more database calls than REST.
- How do you cache GraphQL responses on a CDN? Persisted queries sent with
  `GET`, so the URL identifies the query; or cache in resolvers and on the
  client instead.
- What is the N+1 problem and how is it solved? A resolver called once per item
  of a list, each with its own request; DataLoader batches them into one.
- How do you version a GraphQL API? Usually you don't: fields are only added,
  old ones get `@deprecated(reason: …)` and are removed when usage stats show no
  clients.
- How does the client cache know that two queries returned the same object? It
  normalizes by `__typename` and `id`; queries without `id` cannot be merged.
- What status code does a GraphQL error return? With `application/json`, a field
  error usually comes with `200` and an `errors` array. The GraphQL over HTTP
  draft adds `application/graphql-response+json`, where parse and validation
  errors get `4xx`.
- REST or tRPC in a Next.js app? Server Actions and tRPC give typed calls
  without a hand-written API; REST is needed when other clients use the API.

## Common Mistakes

- "GraphQL replaces HTTP." It runs over HTTP, usually `POST` with JSON.
- "GraphQL is a database query language." It queries an API; resolvers can read
  from any source.
- "REST means JSON over HTTP." REST is an architectural style: resources,
  uniform interface, statelessness, cacheability. Most "REST APIs" are only
  partly RESTful.
- Checking only `response.ok` with GraphQL: errors come in the body.
- Building a query by string concatenation instead of variables.

## See Also

- [HTTP](./http.md)
- [Real-Time Updates](./realtime.md) — WebSocket and SSE, which GraphQL
  subscriptions run over.
- [TanStack Query](../../react/state-management/tanstack-query.md) — server
  state on the client; Apollo and Relay for GraphQL.
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
