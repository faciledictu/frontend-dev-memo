---
sidebar_position: 2
description:
  npm, pnpm, Yarn and Bun, lockfiles, semver ranges, dependency types,
  workspaces, Corepack, install scripts
---

# Package Managers: npm, pnpm, Yarn, Bun

A package manager installs the dependencies listed in `package.json` (as
**semver ranges**) and writes a **lockfile** with the exact resolved versions,
so every machine and CI gets the same tree. The lockfile is committed; CI
installs strictly from it (`npm ci`, `pnpm install --frozen-lockfile`). **npm**
ships with Node.js (Node.js 24 bundles npm 11; npm 12 is installed separately).
**pnpm** keeps one copy of each package version in a global store and hard-links
it into projects, and its `node_modules` is **strict**: a project can only
import what it declares. **Yarn** 4 installs with Plug'n'Play by default,
without `node_modules`. **Bun** is a JavaScript runtime with a very fast
built-in package manager.

Applies to: npm 12, pnpm 12, Yarn 4, Bun 1.4.

## Details

### Comparison

|                               | npm                            | pnpm                                                                      | Yarn 4                                        | Bun                                           |
| ----------------------------- | ------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Lockfile                      | `package-lock.json`            | `pnpm-lock.yaml`                                                          | `yarn.lock`                                   | `bun.lock`                                    |
| `node_modules`                | Flat (hoisted)                 | Symlinks into `node_modules/.pnpm`, files hard-linked from a global store | None (PnP) or `nodeLinker`                    | Hoisted; isolated in new workspaces           |
| Phantom dependencies          | Possible                       | Not possible for your own code                                            | Not possible with PnP                         | Possible when hoisted                         |
| Workspaces                    | `workspaces` in `package.json` | `pnpm-workspace.yaml`                                                     | `workspaces` in `package.json`                | `workspaces` in `package.json`                |
| Dependencies' install scripts | Off by default, `allowScripts` | Off by default, `allowBuilds`                                             | Off by default since 4.14, `dependenciesMeta` | A built-in allowlist or `trustedDependencies` |

A **phantom dependency** is a package the code imports without declaring it,
which works only because a flat `node_modules` hoisted it from someone else's
dependencies. It breaks when that other package changes.

### Commands

| Task                             | npm                     | pnpm                             | Yarn                       | Bun                             |
| -------------------------------- | ----------------------- | -------------------------------- | -------------------------- | ------------------------------- |
| Install everything               | `npm install`           | `pnpm install`                   | `yarn`                     | `bun install`                   |
| Install in CI, from the lockfile | `npm ci`                | `pnpm install --frozen-lockfile` | `yarn install --immutable` | `bun install --frozen-lockfile` |
| Add a dependency                 | `npm install react`     | `pnpm add react`                 | `yarn add react`           | `bun add react`                 |
| Add a dev dependency             | `npm install -D vitest` | `pnpm add -D vitest`             | `yarn add -D vitest`       | `bun add -d vitest`             |
| Remove                           | `npm uninstall react`   | `pnpm remove react`              | `yarn remove react`        | `bun remove react`              |
| Run a script                     | `npm run build`         | `pnpm build`                     | `yarn build`               | `bun run build`                 |
| Run a package without installing | `npx create-vite`       | `pnpm dlx create-vite`           | `yarn dlx create-vite`     | `bunx create-vite`              |

`npm ci` deletes `node_modules`, installs exactly the lockfile and fails if it
does not match `package.json`; `npm install` may update the lockfile. The
`--save` flag is the default since npm 5.

### Semver Ranges

| Range    | Allows                    | `1.2.3` →        |
| -------- | ------------------------- | ---------------- |
| `^1.2.3` | Minor and patch (default) | `>=1.2.3 <2.0.0` |
| `~1.2.3` | Patch                     | `>=1.2.3 <1.3.0` |
| `1.2.3`  | Exactly this version      | `1.2.3`          |

For `0.x` versions `^` is stricter: `^0.2.3` means `>=0.2.3 <0.3.0`.

### Dependency Types

- **`dependencies`**: needed at runtime; installed for the consumers of a
  library.
- **`devDependencies`**: build, test and lint tools; not installed for
  consumers. In an app that is bundled, the split is a convention.
- **`peerDependencies`**: the host package must provide it (a React component
  library declares `react`), so the app has one copy. npm 7+ and pnpm install
  missing peers automatically.

### Lockfiles

- The lockfile of a dependency is ignored: only the root project's lockfile
  counts. A library is tested against fresh ranges anyway, so its lockfile only
  pins its own development setup.
- `npm-shrinkwrap.json` is a lockfile that **is** published with a package and
  respected on install. Meant for CLI tools and other apps distributed through
  npm, not for libraries.

### Pinning the Package Manager

- The `packageManager` field in `package.json` (`"pnpm@12.11.2"`) declares which
  manager and version the project uses. pnpm switches to that version by itself;
  `pnpm/action-setup` reads the field in CI. The newer
  `devEngines.packageManager` field does the same and is read by pnpm and npm.
- **Corepack** reads the field and downloads the right Yarn or pnpm on demand.
  It ships with Node.js up to 24; from Node.js 25 it is no longer bundled and is
  installed with `npm install -g corepack`.

### Install Scripts

`preinstall`, `install` and `postinstall` scripts of dependencies run arbitrary
code on install, a common supply-chain attack vector. npm 12, pnpm 10+ and Yarn
4.14+ no longer run them by default; the npm 11 bundled with Node.js 24 still
does. Approve the packages that need them (native builds like `sharp`, binary
downloaders like Playwright) and commit the allowlist:

| Manager | Approve                  | Where the allowlist lives                                                                  |
| ------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| npm 12  | `npm approve-scripts`    | `allowScripts` in `package.json`                                                           |
| pnpm    | `pnpm approve-builds`    | `allowBuilds` in `pnpm-workspace.yaml`                                                     |
| Yarn 4  | Edit `package.json`      | `dependenciesMeta: { "sharp": { "built": true } }`                                         |
| Bun     | `bun pm trust <package>` | `trustedDependencies` in `package.json` (replaces Bun's built-in list of popular packages) |

## Follow-up Questions

- Why is pnpm fast and small on disk? One copy of each version in a
  content-addressable store, hard-linked into every project; nothing is copied
  twice.
- What happens if the lockfile is not committed? Each install resolves the
  ranges again and can bring different versions: "works on my machine".
- How to update dependencies? `npm update` within ranges, `npm outdated` to see
  new majors; pnpm: `pnpm update`, `pnpm update --latest`, `pnpm outdated`.

## Common Mistakes

- `npm install` in CI instead of `npm ci`.
- Deleting the lockfile to "fix" an install problem: all versions drift at once.
- Mixing package managers in one repository and committing two lockfiles.

## See Also

- [CI/CD](./ci-cd.md)
