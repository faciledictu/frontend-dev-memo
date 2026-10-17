---
sidebar_position: 7
description: Type parameters, constraints, defaults and generic React components
tags: [junior, middle]
---

# Generics

A **generic** is a **type parameter**: a function, type or class is written once
and works with many types, while the compiler still knows how the input and
output types are related. This is the difference from `any`, which switches the
checks off. In most calls the type argument is **inferred**.

## Details

- **Constraint**: `<T extends Shape>` limits which types are allowed and lets
  the code use the properties of `Shape`.
- **`keyof` constraint**: `<T, K extends keyof T>` ties one parameter to the
  keys of another.
- **Default**: `<T = unknown>` is used when the argument is neither passed nor
  inferred.
- **Generic types**: interfaces, type aliases and classes take parameters too:
  `ApiResponse<User>`, `Map<string, number>`, `Promise<void>`.
- **[Utility types](./utility-types.md)** such as `Partial<T>` and `Pick<T, K>`
  are generics.
- **In React**: `useState<User | null>(null)`, generic components and custom
  hooks; see [Typing React](./react.md).
- In a `.tsx` file a generic arrow function is written as `<T,>(value: T) => …`,
  otherwise `<T>` is parsed as a JSX tag.

## Example

```typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const a = first([1, 2, 3]); // number | undefined, T is inferred
const b = first<string>([]); // string | undefined, T is passed explicitly

// highlight-next-line
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Ann' };

// correct-next-line
const userName = getProp(user, 'name'); // string
// error-start
getProp(user, 'age');
// Error: Argument of type '"age"' is not assignable to parameter of type '"id" | "name"'.
// error-end

interface ApiResponse<T = unknown> {
  data: T;
  error?: string;
}

const response: ApiResponse<{ id: number }> = { data: { id: 1 } };
```

A generic React component:

```tsx
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
};

// highlight-next-line
function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// T is inferred as { id: string; title: string }
const list = (
  <List
    items={[{ id: '1', title: 'First' }]}
    getKey={(item) => item.id}
    renderItem={(item) => item.title}
  />
);
```

## Follow-up Questions

- How is a generic different from `any`? `any` loses the type; a generic carries
  it from the arguments to the result.
- What does `extends` mean in `<T extends U>`? A constraint: `T` must be
  assignable to `U`. It is not class inheritance.
- When is a generic not needed? When the type parameter is used only once. Then
  it relates nothing and can be replaced with a concrete type or `unknown`.

## Common Mistakes

- Passing type arguments everywhere instead of relying on inference.
- Using `as T` inside a generic function to silence the compiler: the function
  then promises a type it does not check.
- Adding a type parameter that appears only in the return type, so the caller
  can claim any type (`get<T>(): T`). This is a type assertion in disguise.

## See Also

- [Utility Types](./utility-types.md)
- [Type Operators](./type-operators.md)
- [Typing React](./react.md)
