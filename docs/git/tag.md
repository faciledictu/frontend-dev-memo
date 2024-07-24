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
git tag -d my-tag
```

## Deletion

### Deleting from local branch

```sh
git tag -d my-tag
```

### Deleting after pushing

```sh
git push origin --delete my-tag
```
