---
sidebar_position: 4
description:
  CommonJS vs ES modules in Node.js, how Node.js picks the module type,
  require(esm), module.exports vs exports, resolution and caching
tags: [middle]
---

# Module System in Node.js

Node.js has two module systems. **CommonJS** (CJS) is the original one:
`require()` and `module.exports`, loaded **synchronously**, at run time. **ES
modules** (ESM) are the JavaScript standard: `import` and `export`, analyzed
**statically** before the code runs, with live bindings and top-level `await`.
ESM can import CommonJS, and since Node.js 22.12 CommonJS can `require()` an ES
module too, as long as it has no top-level `await`.

Applies to: Node.js 24 LTS.

## Details

### CommonJS vs ES Modules

|                                  | CommonJS                                                                     | ES modules                                                    |
| -------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Syntax                           | `require()`, `module.exports`, `exports`                                     | `import`, `export`, `import()`                                |
| Loading                          | Synchronous, when `require()` is reached                                     | Graph is parsed and linked first, then executed               |
| Imported values                  | Properties of the `module.exports` object; destructured values do not update | **Live bindings**: an import sees later changes of the export |
| Conditional / dynamic import     | `require()` anywhere, with any expression                                    | `import` only at the top level; `import()` returns a promise  |
| Top-level `await`                | No                                                                           | Yes                                                           |
| File extension in relative paths | Optional (`./utils` finds `./utils.js`)                                      | Required (`./utils.js`)                                       |
| JSON                             | `require('./data.json')`                                                     | `import data from './data.json' with { type: 'json' }`        |
| Current file and directory       | `__filename`, `__dirname`                                                    | `import.meta.filename`, `import.meta.dirname`                 |
| Top-level `this`                 | `module.exports`                                                             | `undefined`                                                   |
| Strict mode                      | Only with `'use strict'`                                                     | Always                                                        |

### How Node.js Decides the Module Type

1. `.mjs` → ESM, `.cjs` → CommonJS.
2. `.js` → the `"type"` field of the nearest `package.json`: `"module"` or
   `"commonjs"`.
3. No `"type"` field: CommonJS, but if the file contains `import`/`export`
   syntax (or top-level `await`), Node.js re-parses it as ESM. If a
   `package.json` without `"type"` exists, it also prints a warning. Set
   `"type"` explicitly instead of relying on this.

### Mixing the Two

- **ESM imports CommonJS:** `import pkg from './lib.cjs'` gives `module.exports`
  as the default export. Named imports work when Node.js can detect them
  statically (`exports.name = …`).
- **CommonJS requires ESM** (`require(esm)`): returns the module **namespace
  object** (the default export is in `.default`). If the module or its imports
  use top-level `await`, it throws `ERR_REQUIRE_ASYNC_MODULE`; use `import()`
  instead. Unflagged in Node.js 22.12 and 20.19, no longer experimental since
  Node.js 24.15.
- **CommonJS loads ESM asynchronously:** `await import('./esm.mjs')` works in
  every version.

### The CommonJS Module Wrapper

Before running a CommonJS file, Node.js wraps it in a function:

```javascript
(function (exports, require, module, __filename, __dirname) {
  // module code
});
```

- That is why each file has its own scope and why `require`, `module`,
  `exports`, `__filename` and `__dirname` are available: they are **parameters
  of the wrapper**, not globals. In ESM they do not exist.
- Real globals are `globalThis` (also `global`), `process`, `Buffer`, timers,
  `console`, `fetch`, `URL` and others.

### `module.exports` vs `exports`

- `exports` is a variable that initially points to the same object as
  `module.exports`. `require()` returns **`module.exports`**.
- Adding properties works through either: `exports.greet = …`.
- Reassigning `exports = …` only changes the local variable; the module still
  exports the old object. To export a single value, assign `module.exports = …`.

### Resolution

For `require('x')` and `import 'x'`:

1. **Built-in module:** `fs`, `node:fs`. Built-ins win over files and packages
   with the same name even without the prefix; `node:` makes the intent explicit
   and bypasses `require.cache`. Some modules exist only with it (`node:test`,
   `node:sqlite`, `node:sea`).
2. **Path** (`./`, `../`, `/`): a file; in CommonJS also with the `.js`,
   `.json`, `.node` extensions added, or a directory with `package.json` `main`
   or `index.js` (`index.json`, `index.node`).
3. **Package name:** looked up in `node_modules` of the current directory, then
   of every parent directory up to the root.
4. If the package has an **`exports`** field in `package.json`, only the paths
   listed there can be imported, with different files for `import` and `require`
   (conditional exports). `imports` with `#` defines private aliases inside the
   package.

### Caching

- A module is executed **once**, on the first `require` or `import`; later
  imports get the same object. That is why a module-level object works as a
  singleton.
- CommonJS caches by resolved file path in `require.cache`; ESM has its own
  module map that cannot be cleared.
- Circular dependencies do not throw: in CommonJS the second module gets the
  partially filled `module.exports`; in ESM reading a `let`, `const` or `class`
  export before its module has run throws a `ReferenceError` (function
  declarations are hoisted and work).

## Example

Live bindings vs a copy:

```javascript title="counter.mjs"
export let count = 0;
export function increment() {
  count++;
}
```

```javascript title="counter.cjs"
let count = 0;
module.exports = {
  count,
  increment() {
    count++;
  },
};
```

```javascript title="main.mjs"
import { count, increment } from './counter.mjs';
import counterCjs from './counter.cjs';

increment();
// highlight-next-line
console.log(count); // 1: the binding is live

counterCjs.increment();
console.log(counterCjs.count); // 0: the property was copied at export time
```

The `exports` trap:

```javascript title="greet.cjs"
// error-next-line
exports = function greet() {}; // require('./greet.cjs') returns {}

// correct-next-line
module.exports = function greet() {};
```

## Follow-up Questions

- Why can't CommonJS just `require` any ES module? `require` is synchronous, and
  an ES module with top-level `await` may finish evaluating only later.
- How do you publish a package that works for both? The `exports` field with
  `import` and `require` conditions, or ESM only now that `require(esm)` works
  in all supported Node.js versions.
- How do you use `require` inside an ES module? `createRequire(import.meta.url)`
  from `node:module`.
- Why does tree shaking need ESM? See
  [ES Modules](../javascript/modules.md#follow-up-questions).
- How do you get `__dirname` in ESM? `import.meta.dirname` (Node.js 20.11+), or
  `fileURLToPath(new URL('.', import.meta.url))` in older versions.

## Common Mistakes

- "`__dirname`, `require` and `module` are globals." They are parameters of the
  CommonJS wrapper and do not exist in ESM.
- "`module.exports` and `exports` are the same." Only until one of them is
  reassigned; `require` returns `module.exports`.
- "ESM imports are copies, like `require`." They are live bindings, read-only
  for the importer.
- Omitting the extension in a relative ESM import: `import './utils'` throws
  `ERR_MODULE_NOT_FOUND`.

## See Also

- [What Is Node.js](./overview.md)
- [ES Modules](../javascript/modules.md): modules in the browser, dynamic
  `import()`, import maps
- [Package Managers](../tooling/package-managers.md)
