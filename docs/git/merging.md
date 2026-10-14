---
sidebar_position: 1
description:
  Merge vs rebase, fast-forward and merge commits, squash, interactive rebase,
  cherry-pick and conflicts
---

# Merge vs Rebase

Both bring the commits of one branch into another. **`git merge`** keeps the
history as it was: if the target branch has not moved, it **fast-forwards** (the
pointer just moves, no new commit); otherwise it creates a **merge commit** with
two parents. **`git rebase`** replays your commits on top of another branch as
**new commits with new hashes**, so the history becomes linear. The rule: **do
not rebase commits that others already have** (pushed shared branches) — rewrite
only your own local or feature-branch history.

Applies to: Git 2.56.

## Details

### Comparison

|                     | `merge`                                       | `rebase`                                             |
| ------------------- | --------------------------------------------- | ---------------------------------------------------- |
| History             | Real, with branches and merge commits         | Linear, as if the work was done on top of the target |
| Existing commits    | Unchanged                                     | Rewritten: new hashes                                |
| Conflicts           | Resolved once, in the merge commit            | Resolved per replayed commit                         |
| Safe on shared work | Yes                                           | No: others' copies diverge, needs a force push       |
| Typical use         | Merging a finished feature into `main`        | Updating a feature branch with `main` before review  |
| Undo                | `git reset --hard ORIG_HEAD`, `git revert -m` | `git reset --hard ORIG_HEAD` or via `git reflog`     |

### Ways to Merge a Pull Request

| Strategy (GitHub naming) | Result on `main`                                          |
| ------------------------ | --------------------------------------------------------- |
| Merge commit             | All branch commits + a merge commit (`git merge --no-ff`) |
| Squash and merge         | One new commit with all changes (`git merge --squash`)    |
| Rebase and merge         | Branch commits replayed on `main`, no merge commit        |

- **Fast-forward** happens only when the target has no commits of its own since
  the branch was created. `--no-ff` forces a merge commit to keep the feature
  visible as a group; `--ff-only` refuses to merge if a fast-forward is not
  possible.
- **Squash** loses the individual commits of the branch, and Git does not record
  the branch as merged: `git branch -d` refuses to delete it, and continuing to
  work on it leads to conflicts with its own squashed changes.

### Interactive Rebase

`git rebase -i <base>` opens the list of commits after `<base>` to edit before
they are replayed: `pick` (keep), `reword` (change the message), `squash` /
`fixup` (meld into the previous one), `edit` (stop to amend), `drop` (remove),
reorder lines to reorder commits. Used to clean up a branch before review.
`git commit --fixup <hash>` plus `git rebase -i --autosquash` does it
automatically.

### Conflicts

- Git stops and marks the conflicting parts of the files with `<<<<<<<`,
  `=======`, `>>>>>>>`.
- Edit the files, `git add` them, then `git merge --continue` or
  `git rebase --continue`.
- Give up and return to the state before: `git merge --abort` or
  `git rebase --abort`.
- `git rerere` remembers how a conflict was resolved and reapplies it — useful
  when the same branch is rebased many times.

### Cherry-pick

`git cherry-pick <hash>…` copies specific commits onto the current branch as new
commits. Used to bring a hotfix into a release branch without merging the whole
branch.

## Example

```bash
# Merge a feature into main
git switch main
git merge --no-ff feature

# Squash a feature into one commit
git merge --squash feature
git commit -m "Add feature"

# Update a feature branch with main, then publish the rewritten branch
git switch feature
git rebase main
git push --force-with-lease

# Copy two commits onto the current branch
git cherry-pick 3f2a9c1 8b47de0
```

## Follow-up Questions

- Why `--force-with-lease` and not `--force`? It refuses to overwrite the remote
  branch if someone pushed to it since your last fetch.
- How to undo a merge that was already pushed? `git revert -m 1 <merge-commit>`
  creates a commit that reverses it without rewriting history.
- What is `git pull --rebase`? `fetch` + `rebase` of local commits on top of the
  remote branch instead of `fetch` + `merge`; avoids "Merge branch 'main' of …"
  commits.

## Common Mistakes

- Saying that every merge creates a merge commit: a fast-forward does not.
- Rebasing `main` or another shared branch and force-pushing it.
- Thinking rebase "loses" commits: the old ones stay reachable through
  `git reflog` until garbage collection.

## See Also

- [Common Commands](./commands.md) — `reset`, `revert`, `reflog`, `stash`.
- [Branching Models](./gitflow.md)
