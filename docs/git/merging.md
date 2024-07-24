---
sidebar_position: 2
---

# Merging commits

## Basic Merge

1. Checkout the Target Branch.

2. Merge the branch containing the commits you want.

```sh
git checkout main
git merge feature-branch
```

The history of both branches remains unchanged, and the merge commit shows that
a merge occurred. The divergent paths of the branches are maintained in the
commit history.

## Squash and Merge

Squashing process combines all the changes from individual commits into one
cohesive commit.

```sh
git checkout main
git merge --squash feature-branch
git commit -m "Merged feature-branch as a single commit"
```

## Merge Specific Commits

1. Checkout the target branch.

2. Use the commit hashes to cherry-pick specific commits.

```sh
git checkout main
git cherry-pick a1b2c3d4 e5f6g7h8
```

## Rebase and Merge

Rebasing can be useful to keep a clean history by applying your commits on top
of another branch.

1. Rebase branch containing the commits you want to target branch.

2. Perform basic merge.

```sh
git checkout feature-branch
git rebase main

git checkout main
git merge feature-branch
```
