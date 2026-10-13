---
sidebar_position: 3
---

# Tags

## Creation

### Lightweight Tags

Lightweight tags are simply pointers to specific commits.

```sh
git tag my-tag
```

### Annotated Tags

Annotated tags, unlike lightweight tags, are full Git objects. They contain
information such as the tagger's name, email, date, and a tagging message.

```sh
git tag -a v1.0 -m "Version 1.0 release"
```

## Pushing

```sh
git push origin my-tag

# Push all tags at once
git push origin --tags
```

## Deletion

### Deleting a local tag

```sh
git tag -d my-tag
```

### Deleting a remote tag

```sh
git push origin --delete my-tag
```
