---
sidebar_position: 5
---

# Gitflow

Gitflow is a branching model for Git, designed to facilitate collaboration and
improve workflow efficiency in software development. It was introduced by
Vincent Driessen in 2010 and has become a popular method for managing larger
projects with multiple developers. The primary principles of Gitflow involve
structured branch management and clear workflows for feature development,
releases, and hotfixes.

## Main Branches

### `main`

Other possible names: `prod`  or `maser`.

Contains the production-ready code. Every commit to the `main` branch should
represent a release or deployment to production.

### `develop`

Other possible names: `dev`.

Contains the latest delivered development changes for the next release. All
feature branches are merged into `develop`, not directly into `main`.

### `test`

Serve as an integration branch where all new features and fixes are tested
together before they are deemed ready for release.

## Supporting Branches

Gitflow uses several types of supporting branches to aid parallel development
and to organize feature integration and release management

### Feature Branches

- Used for develop new features for future releases.
- Created from the `develop` branch.
- Typically named `feature/{task-number}/{feature-name}`.
- Merged back into `develop`, and thet to `test`

### Hotfix Branches

- Used for patch critical bugs in the production code.
- Created from the `main` branch.
- Typically named `hotfix/{task-number}/{hotfix-description}`.
- Merged into both `main` and `develop` to ensure the fix is included in future
  releases.
