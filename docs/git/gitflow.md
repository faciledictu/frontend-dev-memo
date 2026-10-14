---
sidebar_position: 3
description:
  Gitflow, GitHub Flow and trunk-based development, which one to choose
---

# Branching Models: Gitflow, GitHub Flow, Trunk-Based

A branching model is a team agreement on which branches exist and how code gets
to production. **Gitflow** has two permanent branches (`main` and `develop`)
plus feature, release and hotfix branches; it suits software shipped in
versions. **GitHub Flow** has one permanent branch, `main`, which is always
deployable, and short feature branches merged through pull requests.
**Trunk-based development** goes further: everyone integrates into the trunk at
least daily, and unfinished work is hidden behind **feature flags**. Web apps
with continuous delivery usually use GitHub Flow or trunk-based development, as
the author of Gitflow has recommended since 2020.

## Details

### Gitflow

Described by Vincent Driessen in 2010.

| Branch      | Created from | Merged into                                    | Purpose                                    |
| ----------- | ------------ | ---------------------------------------------- | ------------------------------------------ |
| `main`      | —            | —                                              | Released code; every merge is tagged       |
| `develop`   | `main`       | —                                              | Integration branch for the next release    |
| `feature/*` | `develop`    | `develop`                                      | One feature                                |
| `release/*` | `develop`    | `main` (tagged) and `develop`                  | Stabilizing a version: fixes, version bump |
| `hotfix/*`  | `main`       | `main` (tagged) and `develop` (or the release) | An urgent fix of production                |

- Pros: parallel work on several versions, a clear place for release
  stabilization.
- Cons: long-lived branches, big merges and conflicts, slow path to production.

### Comparison

|                     | Gitflow                                          | GitHub Flow               | Trunk-based                                    |
| ------------------- | ------------------------------------------------ | ------------------------- | ---------------------------------------------- |
| Permanent branches  | `main`, `develop`                                | `main`                    | `main` (trunk)                                 |
| Feature branches    | Days to weeks                                    | Days, through a PR        | Hours to a day or two, or none                 |
| Releases            | `release/*` branches, versions                   | Every merge is deployable | From the trunk; optional release branches      |
| Unfinished features | Stay in their branches                           | Stay in their branches    | Merged, hidden behind feature flags            |
| Requires            | Discipline in merging                            | CI and review on every PR | Strong CI, fast review, feature flags          |
| Fits                | Libraries, mobile and desktop apps with versions | Web apps, small teams     | Web apps with continuous delivery, large teams |

Teams often adapt the models, for example an extra `staging` branch that mirrors
an environment. That is a local practice, not part of Gitflow.

## Follow-up Questions

- Why do mobile teams still use release branches? A store release cannot be
  rolled back instantly, so a version is stabilized and tested separately while
  development continues.
- What is a feature flag? A runtime switch that turns code on or off without a
  deploy, so incomplete work can be merged early and released gradually.

## Common Mistakes

- Calling any setup with `develop` and feature branches "Gitflow": release
  branches are the defining part of it.
- Choosing Gitflow by default for a web app that deploys several times a day.

## See Also

- [Merge vs Rebase](./merging.md)
- [CI/CD](../tooling/ci-cd.md)
