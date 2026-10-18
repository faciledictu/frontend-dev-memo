---
sidebar_position: 3
description:
  CI vs continuous delivery vs continuous deployment, pipeline stages, caching,
  preview environments, a GitHub Actions example, CI/CD for mobile apps
tags: [middle]
---

# CI/CD

**Continuous integration** (CI): every change is merged into the main branch
often and checked automatically — install, lint, type check, test, build — so
broken code is caught within minutes. **CD** means one of two things.
**Continuous delivery**: every change that passes the pipeline is **ready** to
release, and the release to production is a manual decision (a button).
**Continuous deployment**: every change that passes goes to production
**automatically**, with no human step.

Applies to: GitHub Actions (`actions/checkout@v7`, `actions/setup-node@v7`,
`pnpm/action-setup@v6`, `actions/upload-artifact@v7`,
`actions/download-artifact@v8`), Node.js 24.

## Details

### CI vs Delivery vs Deployment

|                        | Automated up to                | Release to production        |
| ---------------------- | ------------------------------ | ---------------------------- |
| Continuous integration | Build and tests                | Separate process             |
| Continuous delivery    | A deployable artifact, staging | Manual approval, any time    |
| Continuous deployment  | Production                     | Automatic after green checks |

### Pipeline for a Frontend App

1. **Install** from the lockfile: `npm ci`, `pnpm install --frozen-lockfile`,
   `yarn install --immutable`. Fails if the lockfile does not match
   `package.json`.
2. **Lint and type check**: ESLint, `tsc --noEmit`.
3. **Unit and integration tests**.
4. **Build** the production bundle; keep it as an artifact.
5. **E2E tests** against the build or a preview deployment.
6. **Deploy** to staging or production.

### What Makes a Pipeline Fast and Safe

- **Dependency cache**: the package manager's store keyed by the lockfile hash
  (`cache: pnpm` in `actions/setup-node`). `node_modules` itself is usually not
  cached.
- **Parallel jobs** for independent checks; only changed packages in a monorepo
  (Turborepo, Nx).
- **Preview environments**: every pull request gets its own deployment with a
  URL (Vercel, Netlify, Cloudflare Pages), so reviewers and E2E tests see the
  real build.
- **Secrets** live in the CI secret store, are scoped to environments, and are
  never printed in logs. OIDC tokens to the cloud instead of long-lived keys
  where possible.
- **Branch protection**: merging into `main` requires green checks and a review.

### Mobile Apps (React Native)

The JS part is checked as for the web; release builds add native steps:

- Build and sign with EAS Build or fastlane; iOS needs macOS runners, which are
  slower and more expensive. See
  [Fastlane](../react-native/release/fastlane.md).
- Releases go to testers and stores, see
  [Publishing and Distribution](../react-native/release/distribution.md).
- JS-only fixes ship without a store release, see
  [OTA Updates](../react-native/release/ota.md).
- E2E tests on emulators: Maestro or Detox.

## Example

A GitHub Actions workflow: checks on every pull request, deployment on push to
`main`.

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6 # version from "packageManager" in package.json
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck # tsc --noEmit
      - run: pnpm test
      - run: pnpm build
      - uses: actions/upload-artifact@v7
        with:
          name: dist
          path: dist

  deploy:
    needs: check
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v8
        with:
          name: dist
          path: dist
      - run: npx netlify-cli deploy --prod --no-build --dir dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ vars.NETLIFY_SITE_ID }}
```

<details>
<summary>The same pipeline in GitLab CI</summary>

```yaml title=".gitlab-ci.yml"
default:
  image: node:24
  cache:
    key:
      files: [package-lock.json]
    paths: [.npm/]
  before_script:
    - npm ci --cache .npm --prefer-offline

stages: [check, build, deploy]

lint:
  stage: check
  script: npm run lint

test:
  stage: check
  script: npm test

build:
  stage: build
  script: npm run build
  artifacts:
    paths: [dist/]

deploy:
  stage: deploy
  script: npx netlify-cli deploy --prod --no-build --dir dist
  environment: production
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

</details>

## Follow-up Questions

- Why `npm ci` and not `npm install` in CI? It installs exactly what the
  lockfile says, fails on a mismatch with `package.json` and never rewrites the
  lockfile.
- How to roll back a bad deployment? Redeploy the previous artifact (or switch
  traffic back on the hosting platform); for continuous deployment, feature
  flags turn off a broken feature without a deploy.
- Where do E2E tests run? Against a preview deployment of the pull request or
  against a build served inside the CI job.
- What are blue/green and canary deployments? Blue/green: two identical
  environments; traffic switches to the new one at once and back for a rollback.
  Canary: the new version first gets a small share of traffic, which grows while
  metrics stay healthy.
- How to cancel outdated runs when a PR gets new commits?
  `concurrency: { group: '${{ github.workflow }}-${{ github.ref }}', cancel-in-progress: true }`
  cancels the older run of the same ref.

## Common Mistakes

- Treating "continuous delivery" and "continuous deployment" as the same thing.
- Caching `node_modules` across Node.js versions or lockfile changes.
- Secrets in the repository or printed by a debug step.
- `pull_request_target` with a checkout of the PR head: it runs a fork's code
  with the repository's secrets and a write `GITHUB_TOKEN`.

## See Also

- [Package Managers](./package-managers.md)
- [Testing](./testing.md)
- [Branching Models](../git/gitflow.md)
- [Fastlane](../react-native/release/fastlane.md)
