---
sidebar_position: 4
description:
  The five SOLID principles with frontend interpretations and TypeScript
  examples
tags: [middle, senior]
---

# SOLID Principles

SOLID is five principles of designing modules and classes so that the code is
**easy to change without breaking it**. They were collected by Robert C. Martin
around 2000; the acronym was coined by Michael Feathers. In plain words:

- **Single responsibility**: each module serves one group of people (one reason
  to change), so a change in one requirement touches one place.
- **Open/closed**: new behavior is added by adding code, not by rewriting code
  that already works.
- **Liskov substitution**: if code works with a base type, it must keep working
  with any of its subtypes.
- **Interface segregation**: nobody should depend on methods it does not use.
- **Dependency inversion**: important logic should not depend on details like a
  particular database, API client or library; both depend on an interface.

They come from OOP, but apply equally to modules, components and hooks.

## Details

### Single Responsibility Principle (SRP)

- **Strictly**: "a module should have one, and only one, reason to change". A
  reason to change is an **actor**: a group of people (users, the business,
  designers) whose requirements the code serves.
- It is not "a function does one thing": a module may do several things if they
  always change together for the same actor.
- **Frontend**: data fetching, business rules and markup change for different
  reasons, so they live in an API module, a hook and a component.

### Open/Closed Principle (OCP)

- **Strictly** (Bertrand Meyer, 1988): a module is **open for extension** (its
  behavior can be extended) and **closed for modification** (its source does not
  need to change for that).
- Meyer achieved it with implementation inheritance: a finished class is
  "closed" (stable, used by clients) and extended by subclasses. Robert C.
  Martin (1996) restated it in terms of abstract interfaces and polymorphism —
  the version used today.
- Achieved with **extension points**: interfaces and polymorphism, callbacks,
  configuration maps, plugins.
- **Frontend**: a component takes `children`, render props or a map of renderers
  instead of a growing `switch` over types.

### Liskov Substitution Principle (LSP)

- **Strictly** (Barbara Liskov, 1987; formalized as **behavioral subtyping** by
  Liskov and Wing, 1994): objects of a subtype must be usable wherever the base
  type is expected **without changing the correctness** of the program. Matching
  method signatures is not enough. A subtype:
  - must not **strengthen preconditions** (demand more from arguments);
  - must not **weaken postconditions** (promise less about the result);
  - must keep the **invariants** of the base type (rules that always hold for
    its objects);
  - must not allow state changes the base type forbids (the **history
    constraint**): a mutable subtype of an immutable type breaks it;
  - must not throw new kinds of errors the callers do not expect.
- Signs of a violation: a subclass throws "not supported" for an inherited
  method, or callers need `instanceof` checks.
- **Frontend**: a custom `Input` that extends the props of a native `input` must
  honor them: `disabled`, `onChange`, `ref`.

### Interface Segregation Principle (ISP)

- **Strictly**: clients should not be forced to depend on methods they do not
  use. Several small, role-specific interfaces are better than one general
  interface.
- A client that depends on a large interface has to change (and be retested)
  when any part of it changes.
- **Frontend**: a component takes only the props it needs (`name`, `avatarUrl`),
  not the whole `user` object or the whole store.

### Dependency Inversion Principle (DIP)

- **Strictly**: (1) high-level modules should not depend on low-level modules;
  both should depend on **abstractions**. (2) Abstractions should not depend on
  details; details should depend on abstractions.
- **High-level** means the business logic (what the app does); **low-level**
  means the details (HTTP, `localStorage`, a specific SDK).
- "Inversion": without it, the logic imports the details; with it, the logic
  defines the interface it needs, and the details implement it.
- **Dependency injection** is the usual way to apply it: dependencies are passed
  in (constructor, function argument, React context) instead of being imported
  and created inside.
- **Frontend**: a service takes an `api` or `storage` interface; tests pass a
  fake, the app passes the real implementation.

### Summary

| Principle             | Problem it prevents                                 | Typical tool                                  |
| --------------------- | --------------------------------------------------- | --------------------------------------------- |
| Single responsibility | One change spreads over unrelated code              | Splitting by reason to change                 |
| Open/closed           | Every new case edits and risks working code         | Extension points: interfaces, callbacks, maps |
| Liskov substitution   | A subtype breaks code written for the base type     | Behavioral contracts, composition             |
| Interface segregation | Clients depend on and break because of unused parts | Small role interfaces, narrow props           |
| Dependency inversion  | Business logic is welded to libraries and APIs      | Interfaces + dependency injection             |

## Example

<details>
<summary>Single responsibility: split a component by reasons to change</summary>

```tsx
// error-start
// Fetching, business rules and markup in one place: three reasons to change
function UserCard({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [id]);
  if (!user) return <Spinner />;
  const isVip = user.orders > 10;
  return <div>{isVip ? `⭐ ${user.name}` : user.name}</div>;
}
// error-end

// correct-start
// Data access: changes when the API changes
const fetchUser = (id: string): Promise<User> =>
  fetch(`/api/users/${id}`).then((res) => res.json());

// Business rule: changes when the business changes it
const isVip = (user: User) => user.orders > 10;

// Presentation: changes when the design changes
function UserCard({ id }: { id: string }) {
  const user = useUser(id, fetchUser); // a data hook
  if (!user) return <Spinner />;
  return <div>{isVip(user) ? `⭐ ${user.name}` : user.name}</div>;
}
// correct-end
```

</details>

<details>
<summary>Interface segregation: narrow props</summary>

```tsx
// error-next-line
function Avatar({ user }: { user: User }) {
  // Depends on the whole User: re-typed and retested when any field changes
  return <img src={user.avatarUrl} alt={user.name} />;
}

// correct-next-line
function Avatar({ src, name }: { src: string; name: string }) {
  // Depends only on what it uses; works for a team or a bot too
  return <img src={src} alt={name} />;
}
```

</details>

<details>
<summary>Open/closed: an extension point instead of a switch</summary>

```typescript
type Format = (value: number) => string;

const formats = new Map<string, Format>([
  ['currency', (value) => `$${value.toFixed(2)}`],
]);

// The extension point: other modules add formats without editing this one
export function registerFormat(type: string, format: Format) {
  formats.set(type, format);
}

export function formatValue(value: number, type: string): string {
  return formats.get(type)?.(value) ?? String(value);
}

// In another module
registerFormat('percent', (value) => `${(value * 100).toFixed(0)}%`);

console.log(formatValue(0.25, 'percent'), formatValue(3, 'currency')); // 25% $3.00
```

</details>

<details>
<summary>Liskov substitution: a square is not a rectangle</summary>

```typescript
class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number) {
    this.width = width;
  }

  area() {
    return this.width * this.height;
  }
}

// error-start
class Square extends Rectangle {
  constructor(side: number) {
    super(side, side);
  }

  // Weakens the postcondition of setWidth: "height stays the same"
  override setWidth(width: number) {
    this.width = width;
    this.height = width;
  }
}
// error-end

function stretch(rect: Rectangle) {
  rect.setWidth(10);
  return rect.area();
}

console.log(stretch(new Rectangle(2, 5)), stretch(new Square(5))); // 50 100 — expected 50
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
  private notification: NotificationService;

  constructor(notification: NotificationService) {
    this.notification = notification;
  }

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
- Do the principles apply to functional code? Yes, with functions in place of
  classes: a function type is an interface (ISP, DIP), a callback argument is an
  extension point (OCP), and a module has one reason to change (SRP).
- Can SOLID be overdone? Yes: interfaces with one implementation and layers of
  indirection for code that never changes make it harder to read. Apply the
  principles where change actually happens.
- Does TypeScript enforce LSP? Only signatures, and method parameters are
  bivariant; behavior (preconditions, postconditions, invariants) is not
  checked, which is why the `Square` example compiles.
- Name a SOLID violation in a typical React codebase. A `Button` with ten
  boolean props and an `if` for each (OCP), a `useEverything` hook (SRP), a
  component that imports an API client instead of receiving it through props or
  context (DIP).

## Common Mistakes

- Reading SRP as "a class does one thing": it is about one reason (one actor) to
  change.
- Splitting code into tiny pieces in the name of SOLID where nothing changes
  independently.
- Equating DIP with a DI container: passing a dependency as an argument or
  through React context already is dependency injection.

## See Also

- [OOP Principles](./oop-principles.md)
- [Best Practices](../best-practices.md)
