---
sidebar_position: 11
description:
  What strict enables, useful flags beyond strict, new defaults in TypeScript 6
  and a config for an app with a bundler
tags: [middle]
---

# tsconfig and Strict Mode

`tsconfig.json` says **which files** belong to a project and **how to check and
compile** them. The flag that matters most is **`strict`**: it turns on a family
of checks, the main ones being **`strictNullChecks`** (`null` and `undefined`
are separate types) and **`noImplicitAny`**. Since TypeScript 6.0 `strict` is
**on by default**.

Some useful checks are **not** part of `strict`, most notably
**`noUncheckedIndexedAccess`**. In an app built with a bundler, `tsc` only
checks types (`noEmit`), and the bundler compiles the code.

Applies to: TypeScript 7.0.

## Details

### What `strict` Enables

| Flag                           | What it checks                                                              |
| ------------------------------ | --------------------------------------------------------------------------- |
| `strictNullChecks`             | `null` and `undefined` are not assignable to other types                    |
| `noImplicitAny`                | a parameter or variable whose type can't be inferred is an error, not `any` |
| `strictFunctionTypes`          | function parameters are checked contravariantly (not for method syntax)     |
| `strictBindCallApply`          | arguments of `bind`, `call` and `apply` are checked                         |
| `strictPropertyInitialization` | class fields must be set in the constructor or declared with `!`            |
| `noImplicitThis`               | `this` with an implicit `any` type is an error                              |
| `useUnknownInCatchVariables`   | `catch (e)` gives `e: unknown` instead of `any`                             |
| `strictBuiltinIteratorReturn`  | built-in iterators return `undefined` when done, not `any` (TypeScript 5.6) |

- Each flag can be turned off separately: `"strict": true` plus
  `"strictPropertyInitialization": false`.
- New strict checks are added to the family in new versions, so an upgrade of
  TypeScript can bring new errors. That is by design.
- `alwaysStrict` (emit `"use strict"`) used to be in the family too;
  `alwaysStrict: false` is deprecated in TypeScript 6.0 and removed in 7.0.

### Useful Checks Beyond `strict`

| Flag                                 | What it does                                                           |
| ------------------------------------ | ---------------------------------------------------------------------- |
| `noUncheckedIndexedAccess`           | `arr[i]` and `record[key]` are `T \| undefined`                        |
| `exactOptionalPropertyTypes`         | `{ a?: string }` does not accept an explicit `a: undefined`            |
| `noImplicitOverride`                 | overriding a class method requires the `override` keyword              |
| `noImplicitReturns`                  | every code path of a function must return                              |
| `noFallthroughCasesInSwitch`         | a non-empty `case` must end with `break` or `return`                   |
| `noPropertyAccessFromIndexSignature` | keys from an index signature are read with `obj['key']`, not `obj.key` |

### Modules and Emit

| Flag                   | Meaning                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `noEmit`               | only check types; a bundler (Vite, Next.js) produces the JavaScript                              |
| `module`               | the module format: `esnext` or `preserve` with a bundler, `nodenext` for Node                    |
| `moduleResolution`     | `bundler` with a bundler, `nodenext` for Node.js                                                 |
| `verbatimModuleSyntax` | type-only imports must be written as `import type`; others are kept as is                        |
| `isolatedModules`      | forbids code a single-file compiler (esbuild, SWC) can't handle                                  |
| `erasableSyntaxOnly`   | forbids `enum`, `namespace` and parameter properties: code with runtime output                   |
| `jsx`                  | `react-jsx` for React 17+                                                                        |
| `target`, `lib`        | the JavaScript version to emit and the built-in APIs available                                   |
| `types`                | global type packages to load: `["node"]`, `["vite/client"]`                                      |
| `paths`                | import aliases such as `@/components`                                                            |
| `skipLibCheck`         | does not check any `.d.ts` files, including those of dependencies: faster, hides conflicts there |

`erasableSyntaxOnly` matters for running `.ts` files directly in Node.js, which
strips types without compiling them; see [Enums](./enums.md).

### Changes in TypeScript 6.0 and 7.0

TypeScript 7.0 is a port of the compiler to Go: the same type checking, about
ten times faster. TypeScript 6.0 prepared for it by changing defaults:

- `strict` is `true`, `module` is `esnext`, `target` is the latest ES version
  (`es2025`);
- `types` is `[]`: global packages from `node_modules/@types` are no longer
  loaded automatically, so `process` or `describe` need `"types": ["node"]` or
  `["jest"]`;
- `lib: ["dom"]` now includes `dom.iterable`;
- removed in 7.0: `target: es5`, `baseUrl` (use `paths` relative to the config),
  `moduleResolution: node` (`node10`) and `classic`, `outFile`, the `amd`, `umd`
  and `systemjs` module formats, `esModuleInterop: false`.

## Example

A config for a React app built with Vite:

```json title="tsconfig.json" {6,8-10,13}
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2024", "dom"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "noEmit": true,
    "verbatimModuleSyntax": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "types": ["vite/client"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

What `noUncheckedIndexedAccess` catches:

```typescript
const scores: Record<string, number> = { ann: 10 };
const users = ['Ann', 'Bob'];

// error-start
scores.bob.toFixed(); // Error: 'scores.bob' is possibly 'undefined'.
users[5].toUpperCase(); // Error: Object is possibly 'undefined'.
// error-end

// correct-start
scores.bob?.toFixed();
for (const user of users) user.toUpperCase(); // iteration is not affected
// correct-end
```

## Follow-up Questions

- What does `strictNullChecks` change? Without it `null` and `undefined` are
  assignable to every type, so `user.name` compiles when `user` may be `null`.
- Why is `noUncheckedIndexedAccess` not part of `strict`? It adds many checks to
  correct code (`arr[0]` after a length check), so it is opt-in.
- What is the difference between `include`, `files` and `exclude`? `include` and
  `files` choose the root files; `exclude` only filters `include`, and a file
  excluded but imported from an included file is still checked.
- How do you share a config between projects? `"extends"`, for example from the
  `@tsconfig/*` packages, and project references for monorepos.
- Why can't `tsc` with `noEmit` build the app? It only checks; the bundler
  compiles each file separately, which is why `isolatedModules` or
  `verbatimModuleSyntax` is needed.

## Common Mistakes

- Turning `strict` off to migrate faster and never turning it back on.
- Expecting `skipLibCheck` to skip checking your own `.d.ts` files only: it
  skips all of them.
- Relying on automatic `@types` loading after an upgrade to TypeScript 6+:
  globals like `process` disappear until `types` lists them.
- Thinking `paths` changes the output: it only tells the compiler how to resolve
  imports; the bundler or runtime needs the same aliases.

## See Also

- [Basic Types](./basic-types.md)
- [Enums](./enums.md)
- [Modules](../javascript/modules.md)
