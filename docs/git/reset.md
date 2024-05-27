---
sidebar_position: 4
---

# Reseting and reverting changes

## Reseting work tree

`git reset` modifies the commit history by moving the HEAD to a different state,
while git revert creates a new commit to undo the changes introduced by a
specific commit. The choice between them depends on whether you want to alter
the commit history or maintain it intact.

There are different modes of git reset:

- `--soft`: Moves the HEAD to the specified commit but leaves the changes
  staged.
- `--mixed` (default): Moves the HEAD to the specified commit and unstages
  changes, but leaves them in the working directory.
- `--hard`: Moves the HEAD to the specified commit and discards all changes
  (both staged and unstaged) after that commit.

### Reverting changes

`git revert` creates a new commit that undoes the changes made by a previous
commit. It does not modify the existing commit history but adds a new commit
that contains the inverse of the changes introduced by the specified commit.
