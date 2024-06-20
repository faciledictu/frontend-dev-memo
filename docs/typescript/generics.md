---
sidebar_position: 5
---

# Generics

Generics provide a way to create reusable components

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

```
