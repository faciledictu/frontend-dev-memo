---
sidebar_position: 4
---

# Enums

Enums allow a developer to define a set of named constants.

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```

Enums can have computed members.

```typescript
enum ComputedEnum {
    A = "A".length,
    B = 2 * 2
}

```
