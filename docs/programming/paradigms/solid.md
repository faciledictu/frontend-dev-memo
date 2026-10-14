---
sidebar_position: 4
description:
  The five SOLID principles with frontend interpretations and TypeScript
  examples
---

# SOLID Principles

SOLID is five design principles collected by Robert C. Martin (the acronym was
coined by Michael Feathers) for code that is easy to change:

- **Single responsibility**: a module has one reason to change.
- **Open/closed**: add behavior by extending, not by editing working code.
- **Liskov substitution**: a subtype can replace its base type without breaking
  callers.
- **Interface segregation**: many small interfaces instead of one large.
- **Dependency inversion**: high-level code depends on abstractions, not on
  concrete implementations.

They come from OOP but apply to modules, components and hooks as well.

## Details

| Principle             | Rule                                             | In frontend                                                                                    |
| --------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Single responsibility | One reason to change                             | Separate UI, business logic and data access: a component, a hook, an API module                |
| Open/closed           | Open for extension, closed for modification      | Extend through props, `children`, render functions, a config map instead of a growing `switch` |
| Liskov substitution   | A subtype keeps the contract of its base type    | A custom `Input` accepts and honors the props of a native `input`                              |
| Interface segregation | Clients do not depend on methods they do not use | Components take the props they need, not a whole `user` or `store` object                      |
| Dependency inversion  | Both levels depend on abstractions               | Business logic takes an `api` / `storage` interface; tests pass a fake                         |

Signs of an LSP violation: a subclass throws "not supported" for a base method,
needs `instanceof` checks in callers, or strengthens the requirements on
arguments.

## Example

<details>
<summary>Open/closed: a map instead of a switch</summary>

```typescript
type Format = (value: number) => string;

// A new format is added to the map; formatValue does not change
const formats: Record<string, Format> = {
  currency: (value) => `$${value.toFixed(2)}`,
  percent: (value) => `${(value * 100).toFixed(0)}%`,
};

function formatValue(value: number, type: string): string {
  return formats[type]?.(value) ?? String(value);
}

console.log(formatValue(0.25, 'percent'), formatValue(3, 'currency')); // 25% $3.00
```

</details>

<details>
<summary>Liskov substitution: a square is not a rectangle</summary>

```typescript
class Rectangle {
  constructor(
    public width: number,
    public height: number
  ) {}

  setWidth(width: number) {
    this.width = width;
  }

  area() {
    return this.width * this.height;
  }
}

// error-start
class Square extends Rectangle {
  setWidth(width: number) {
    this.width = width;
    this.height = width; // breaks the expectation that height stays the same
  }
}
// error-end

function stretch(rect: Rectangle) {
  rect.setWidth(10);
  return rect.area();
}

console.log(stretch(new Rectangle(2, 5)), stretch(new Square(5, 5))); // 50 100
```

</details>

<details>
<summary>Dependency inversion: inject the service</summary>

```typescript
interface NotificationService {
  send(message: string): Promise<void>;
}

class ConsoleNotificationService implements NotificationService {
  async send(message: string) {
    console.log(`Sent: ${message}`);
  }
}

// Depends on the interface, not on a concrete service
class MessageManager {
  constructor(private notification: NotificationService) {}

  notifyUser(message: string) {
    return this.notification.send(message);
  }
}

await new MessageManager(new ConsoleNotificationService()).notifyUser('Hi');
// In tests: new MessageManager({ send: vi.fn() })
```

</details>

## Follow-up Questions

- Is dependency inversion the same as dependency injection? No: inversion is the
  principle (depend on abstractions), injection is one way to achieve it (pass
  dependencies in from outside).
- How does SRP apply to React? A component that fetches, transforms and renders
  data is split into a data hook and a presentational component.

## Common Mistakes

- Reading SRP as "a class does one thing": it is about one reason (one actor) to
  change.
- Splitting code into tiny pieces in the name of SOLID where nothing changes
  independently.

## See Also

- [OOP Principles](./oop-principles.md)
- [Best Practices](../best-practices.md)
