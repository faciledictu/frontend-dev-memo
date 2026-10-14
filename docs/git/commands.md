---
sidebar_position: 2
description:
  reset vs revert vs restore, reset modes, reflog, stash, switch, fetch vs pull,
  tags
---

# Common Commands

**`git reset`** moves the current branch to another commit and **rewrites
history**; **`git revert`** adds a new commit that undoes an old one and is
**safe on shared branches**; **`git restore`** discards or unstages changes in
files without touching commits. Anything that seems lost after a reset or a
rebase can be found in **`git reflog`**. Since Git 2.23, **`git switch`** and
`git restore` split the overloaded `git checkout` into "change branches" and
"restore files".

Applies to: Git 2.56.

## Details

### Undoing Changes

| Command                        | What it does                                                               |
| ------------------------------ | -------------------------------------------------------------------------- |
| `git restore <file>`           | Discards unstaged changes in the working tree                              |
| `git restore --staged <file>`  | Unstages a file, keeps the changes in the working tree                     |
| `git reset --soft <commit>`    | Moves the branch; changes of the dropped commits stay **staged**           |
| `git reset [--mixed] <commit>` | Moves the branch; changes stay in the working tree, **unstaged** (default) |
| `git reset --hard <commit>`    | Moves the branch; staged and unstaged changes are **discarded**            |
| `git revert <commit>`          | New commit with the inverse changes; history is kept                       |
| `git commit --amend`           | Replaces the last commit (message or content)                              |
| `git reflog`                   | Log of where `HEAD` has been; find a "lost" commit and reset to it         |

`git restore <file>` and `git reset --hard` discard uncommitted changes, and the
reflog does not track them: unstaged edits are gone, staged ones can only be dug
out as dangling blobs with `git fsck --lost-found`.

### Branches and Syncing

| Command                       | What it does                                                      |
| ----------------------------- | ----------------------------------------------------------------- |
| `git switch <branch>`         | Switches to a branch (`git checkout <branch>`)                    |
| `git switch -c <branch>`      | Creates a branch and switches to it (`git checkout -b`)           |
| `git fetch`                   | Downloads remote commits into `origin/*`, changes nothing local   |
| `git pull`                    | `fetch` + `merge` (or `rebase` with `--rebase`) into the branch   |
| `git push --force-with-lease` | Force push that fails if the remote has commits you have not seen |
| `git cherry-pick <commit>`    | Copies a commit onto the current branch                           |

### Stash

| Command           | What it does                                                 |
| ----------------- | ------------------------------------------------------------ |
| `git stash`       | Saves uncommitted changes and cleans the working tree        |
| `git stash -u`    | The same, including untracked files                          |
| `git stash list`  | Lists saved entries: `stash@{0}`, `stash@{1}`, …             |
| `git stash pop`   | Applies the latest entry and removes it (kept on a conflict) |
| `git stash apply` | Applies the latest entry and keeps it                        |

### Tags

Tags mark a commit, usually a release. A **lightweight** tag is just a name for
a commit; an **annotated** tag (`-a`) is a full object with the author, date and
message — use it for releases. Tags are not pushed with `git push` by default.

| Command                           | What it does              |
| --------------------------------- | ------------------------- |
| `git tag v1.0.0`                  | Creates a lightweight tag |
| `git tag -a v1.0.0 -m "Release"`  | Creates an annotated tag  |
| `git push origin v1.0.0`          | Pushes one tag            |
| `git push origin --tags`          | Pushes all tags           |
| `git tag -d v1.0.0`               | Deletes a local tag       |
| `git push origin --delete v1.0.0` | Deletes a remote tag      |

### Finding a Bug

`git bisect` binary-searches history for the commit that introduced a bug:
`git bisect start`, `git bisect bad` (current commit),
`git bisect good <commit>`, then mark each checked-out commit as `good` or `bad`
until Git names the culprit; `git bisect reset` returns to where you started.

## Example

<details>
<summary>Examples</summary>

```bash
# Undo the last commit, keep its changes staged
git reset --soft HEAD~1

# Undo a pushed commit without rewriting history
git revert 3f2a9c1

# A hard reset went wrong: find the previous position and go back
git reflog
git reset --hard HEAD@{1}

# Put work aside, switch branches, bring it back
git stash
git switch main
git switch -
git stash pop
```

</details>

## Follow-up Questions

- `reset` or `revert` for a commit already pushed to `main`? `revert`: `reset`
  rewrites history that others have already pulled.
- What does `HEAD~1` mean? The first parent of `HEAD`; `HEAD~3` is three commits
  back. `HEAD^2` is the second parent of a merge commit.
- `fetch` or `pull`? `fetch` is always safe: it only updates remote-tracking
  branches, so you can look at the changes before merging them.

## See Also

- [Merge vs Rebase](./merging.md)
