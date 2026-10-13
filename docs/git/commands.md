---
sidebar_position: 2
---

# Common Commands

## Resetting and reverting changes

`git reset` modifies the commit history by moving the HEAD to a different state,
while `git revert` creates a new commit to undo the changes introduced by a
specific commit.

The choice between them depends on whether you want to alter the commit history
or maintain it intact.

### Resetting Modes

There are different modes of resetting work tree using `git reset`:

- `--soft`: Moves the HEAD to the specified commit but leaves the changes
  staged.

- `--mixed` (default): Moves the HEAD to the specified commit and unstages
  changes, but leaves them in the working directory.

- `--hard`: Moves the HEAD to the specified commit and discards all changes
  (both staged and unstaged) after that commit.

## Tags

### Creation

#### Lightweight Tags

Lightweight tags are simply pointers to specific commits.

```sh
git tag my-tag
```

#### Annotated Tags

Annotated tags, unlike lightweight tags, are full Git objects. They contain
information such as the tagger's name, email, date, and a tagging message.

```sh
git tag -a v1.0 -m "Version 1.0 release"
```

### Pushing

```sh
git push origin my-tag

# Push all tags at once
git push origin --tags
```

### Deletion

#### Deleting a local tag

```sh
git tag -d my-tag
```

#### Deleting a remote tag

```sh
git push origin --delete my-tag
```
