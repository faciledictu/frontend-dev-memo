---
sidebar_position: 4
---

# Reseting and reverting changes

`git reset` modifies the commit history by moving the HEAD to a different state,
while `git revert` creates a new commit to undo the changes introduced by a
specific commit.

The choice between them depends on whether you want to alter the commit history
or maintain it intact.

## Reseting Modes

There are different modes of reseting work tree using `git reset`:

- `--soft`: Moves the HEAD to the specified commit but leaves the changes
  staged.

- `--mixed` (default): Moves the HEAD to the specified commit and unstages
  changes, but leaves them in the working directory.

- `--hard`: Moves the HEAD to the specified commit and discards all changes
  (both staged and unstaged) after that commit.
