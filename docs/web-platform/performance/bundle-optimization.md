---
sidebar_position: 3
description: Bundle analysis, tree shaking, code splitting and lighter imports
tags: [middle, senior]
---

# Bundle Optimization

The less JavaScript a page ships, the faster it is downloaded, parsed and
executed. The main techniques:

- **Measure** the production build with a bundle analyzer.
- **Tree shaking**: the bundler drops exports that nothing imports.
- **Code splitting**: dynamic `import()` moves code into chunks that are loaded
  on demand.
- **Minification and compression**, and **lighter dependencies**.

Applies to: Vite 8, webpack 5.

## Details

### Measuring

- Always look at the **production** build: a development build is not minified
  and contains extra code.
- An analyzer shows a treemap of what the bundle consists of:
  `webpack-bundle-analyzer` for webpack, `rollup-plugin-visualizer` for Vite and
  Rollup (it also supports Rolldown), `source-map-explorer` for any bundler that
  emits source maps.
- Look for **duplicate dependencies**: the same library appears twice in the
  treemap in two versions; `pnpm why <name>` shows which packages pull each one
  in.

### Tree Shaking

- It relies on **ES modules**: `import` and `export` are static, so the bundler
  can see what is used. CommonJS (`require`) cannot be analyzed reliably.
- It works in production builds of webpack, Rollup, Rolldown (Vite 8) and
  esbuild.
- A library helps the bundler with `"sideEffects": false` in its `package.json`:
  a module that is imported or re-exported, but whose exports are not used, can
  then be dropped entirely. Files with side effects (CSS, polyfills) are listed
  as exceptions.

How the import style affects the bundle, with Lodash as an example:

| Import                                   | What gets into the bundle                                         |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `import _ from 'lodash'`                 | the whole library                                                 |
| `import { debounce } from 'lodash'`      | the whole library: `lodash` is CommonJS                           |
| `import debounce from 'lodash/debounce'` | only `debounce` and what it depends on                            |
| `import { debounce } from 'lodash-es'`   | only `debounce` and what it depends on: `lodash-es` is ES modules |

### Code Splitting

- A dynamic `import('./module.js')` returns a promise, and the bundler puts the
  module into a separate chunk. It works in every modern bundler.
- Split **by route** first, then heavy components that are rarely needed:
  modals, editors, charts.
- In React, `lazy` together with `Suspense` loads a component on first render.
  Routers can load routes lazily, see
  [Routing](../../react/ecosystem/routing.md).
- When a dynamic `import()` runs, Vite preloads the chunk's dependencies in
  parallel (`<link rel="modulepreload">`) instead of in a waterfall. A chunk for
  likely navigation is prefetched with `/* webpackPrefetch: true */` in webpack
  or `<link rel="prefetch">`.
- Dependencies that rarely change can go into a separate **vendor chunk**
  (`splitChunks` in webpack, `codeSplitting` in Rolldown and Vite 8,
  `manualChunks` in Rollup and Vite 7), so that the browser keeps it cached
  between releases. See [HTTP caching](../network/http.md#caching).

### Other Techniques

- **Minification** (Oxc in Vite 8, esbuild, SWC, Terser) is done by the bundler;
  **compression** (Brotli, gzip) is done by the server or the CDN.
- **Lighter dependencies**: `date-fns` or `Intl` instead of Moment.js, native
  methods instead of utility libraries.
- **Fewer polyfills**: a `browserslist` config that matches the real audience.

## Example

```jsx
import { Suspense, lazy } from 'react';

// The chart code is loaded only when <Dashboard> is rendered
// highlight-next-line
const Chart = lazy(() => import('./Chart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart />
    </Suspense>
  );
}
```

## Follow-up Questions

- Why does tree shaking not work for a library? It is published as CommonJS, or
  its modules have side effects and it does not declare `sideEffects`.
- What is the downside of code splitting? More requests and a delay when a chunk
  is needed for the first time, unless it is prefetched.
- How do you find out what made the bundle bigger? Compare analyzer reports
  before and after the change.
- Tree shaking or dead code elimination? Tree shaking drops unused exports; dead
  code elimination drops unreachable code: once the bundler replaces
  `process.env.NODE_ENV` with `"production"`, a dev-only branch becomes
  `if (false)` and is removed. Both run by default only in production builds.
- How do you keep the bundle from growing back? A size budget in CI
  (`size-limit`, Lighthouse CI assertions) and an analyzer diff on pull
  requests.

## Common Mistakes

- "Named imports are always tree-shaken." Only from ES modules;
  `import { debounce } from 'lodash'` pulls in the whole library.
- Measuring performance or bundle size on a development build.
- Importing through barrel files (`index.ts` that re-exports everything): a
  barrel that re-exports CommonJS modules or modules with side effects defeats
  tree shaking.
- Lazy-loading every component: many tiny requests, and nested lazy components
  load in a waterfall.

## See Also

- [Optimization in React](../../react/performance/optimization.md)
- [ES Modules](../../javascript/modules.md)
- [Critical Rendering Path and Loading Performance](./loading-performance.md)
- [How the Browser Works](../browser/browser-workflow.md)
