---
sidebar_position: 14
description:
  import and export, live bindings, modules in the browser, dynamic import,
  top-level await, import maps and import attributes
tags: [middle]
---

# ES Modules

An **ES module** (ESM) is a file with its own scope that shares code through
**`export`** and gets it through **`import`**. It is the standard module system
of JavaScript, supported by browsers and Node.js.

- Imports and exports are **static**: they are found before the code runs, so
  the whole dependency graph is loaded and linked first. This is what makes
  **tree shaking** possible.
- Imports are **live bindings**, not copies: the importer sees later changes of
  an exported variable and can't reassign it.
- A module is **evaluated once**, however many times it is imported.
- Modules are always in **strict mode**, top-level `this` is `undefined`, and
  **top-level `await`** works.

CommonJS (`require`) and how Node.js picks the module type are covered in
[Module System in Node.js](../nodejs/module-system.md).

## Details

### Syntax

| Export                            | Import                                     |
| --------------------------------- | ------------------------------------------ |
| `export const a = 1;`             | `import { a } from './m.js';`              |
| `export { a, b as c };`           | `import { a, c as d } from './m.js';`      |
| `export default function () {}`   | `import anyName from './m.js';`            |
| —                                 | `import * as m from './m.js';` (namespace) |
| `export { a } from './other.js';` | re-export without importing                |
| `export * from './other.js';`     | re-export all named exports (not default)  |
| —                                 | `import './polyfill.js';` (side effects)   |
| —                                 | `const m = await import('./m.js');`        |

- **Named vs default.** A named export has one name everywhere, so it is easier
  to search, rename and auto-import. A default export is named by each importer.
  Many style guides prefer named exports.
- `export default expression` exports the **value** of the expression at that
  moment; a later reassignment of the variable is not visible.
  `export { x as default }` is a live binding.
- `import` declarations are **hoisted**: imported modules run before the
  importing module's body, wherever the `import` is written.
- A **namespace object** (`import * as m`) is sealed and its properties are
  read-only.

### Modules in the Browser

- `<script type="module" src="app.js">` loads a module. Module scripts are
  **deferred** by default: they run after the HTML is parsed, in document order.
  `async` makes them run as soon as they are loaded.
- Each module has its own top-level scope: top-level variables do not become
  globals.
- Modules are fetched with **CORS**: a module from another origin needs CORS
  headers, and a page opened from `file://` can't load modules. Use a local dev
  server.
- **Bare specifiers** (`import React from 'react'`) do not work in browsers by
  themselves. A bundler resolves them, or an **import map** does:

```html
<script type="importmap">
  { "imports": { "lodash/": "/node_modules/lodash-es/" } }
</script>
<script type="module">
  import debounce from 'lodash/debounce.js';
</script>
```

### Dynamic `import()`

- `import(specifier)` loads a module **at run time** and returns a promise of
  its namespace object. It works in classic scripts and in CommonJS too.
- The specifier can be any expression: ``import(`./locales/${lang}.js`)``.
- Used for **code splitting**: bundlers put a dynamically imported module into a
  separate chunk that is loaded on demand. See
  [Bundle Optimization](../web-platform/performance/bundle-optimization.md).
- `React.lazy`, route-level splitting in Next.js and similar tools are built on
  it.

### Top-level `await`

- A module can `await` at the top level, for example to load configuration.
- Modules that import it wait until it finishes. A slow top-level `await` delays
  everything that depends on the module, so keep it for initialization.

### `import.meta`

- `import.meta.url`: the URL of the current module. Resolve files next to it
  with `new URL('./data.json', import.meta.url)`.
- `import.meta.resolve(specifier)`: the URL an import would load.
- Bundlers and runtimes add their own fields: `import.meta.env` in Vite,
  `import.meta.dirname` and `import.meta.filename` in Node.js.

### Import Attributes (ES2025)

```javascript
import config from './config.json' with { type: 'json' };
```

- `with { type: 'json' }` tells the runtime what kind of module to expect, so a
  server can't make a `.json` URL run as JavaScript. JSON modules have only a
  default export.
- Chromium and Firefox also support `type: 'css'`, which gives a `CSSStyleSheet`
  (not Safari yet).
- Baseline 2025, Node.js 22+. The old `assert { type: 'json' }` syntax is
  removed.

### Circular Dependencies

- They do not throw by themselves: each module is linked before any of them
  runs.
- Reading a `let`, `const` or `class` export of a module that has not finished
  running throws a `ReferenceError` (temporal dead zone). Function declarations
  are hoisted and can be called.
- The fix is usually to move the shared part to a third module.

## Example

<details>
<summary>Examples</summary>

Live bindings and a default export snapshot:

```javascript
// counter.js
export let count = 0;
export function increment() {
  count++;
}
export default count;
```

```javascript
// main.js
import initial, { count, increment } from './counter.js';

increment();
console.log(count); // 1: the live binding sees the change
console.log(initial); // 0: `export default count` exported the value 0

// error-next-line
count = 5; // TypeError: Assignment to constant variable.
```

Loading code on demand:

```javascript
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js');
  openEditor();
});
```

</details>

## Follow-up Questions

- Why does tree shaking need ESM? The bundler has to know which exports are used
  without running the code. With static `import`/`export` it can; with
  `require()` it can't.
- What is the difference between `defer`, `async` and `type="module"`? A classic
  script blocks parsing; `defer` and modules run after parsing in order; `async`
  runs as soon as it is loaded, in any order.
- Why can't you import a module from `file://`? Module scripts are fetched with
  CORS, and `file://` URLs are not treated as same-origin.
- What does `import()` return for a CommonJS module in Node.js? A namespace
  object with `module.exports` in `default`, plus the named exports Node.js can
  detect statically. Browsers can't load CommonJS at all.

## Common Mistakes

- "Imports are copies of values." They are live bindings, read-only for the
  importer.
- Putting `import` inside an `if`: static `import` is allowed only at the top
  level. Use `import()`.
- Omitting the extension: `import './utils'` fails in browsers and Node.js;
  bundlers allow it, which hides the problem.
- Expecting `export * from` to re-export the default export. It doesn't; write
  `export { default } from './m.js'`.
- Expecting a module to run again on each import: it runs once, and its
  top-level state is shared, like a singleton.

## See Also

- [Module System in Node.js](../nodejs/module-system.md)
- [Bundle Optimization](../web-platform/performance/bundle-optimization.md)
- [Variables](./variables.md): the temporal dead zone
