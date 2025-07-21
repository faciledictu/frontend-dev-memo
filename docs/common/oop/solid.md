---
sidebar_position: 2
---

# SOLID principles

SOLID are a set of five design principles that aim to make software designs more
understandable, flexible, and maintainable. They were introduced by Robert C.
Martin (also known as Uncle Bob) to provide guidelines for writing better
object-oriented code.

## Single Responsibility Principle (SRP)

A class should have only one reason to change. In other words, a class should
focus on doing one thing well, rather than trying to do too much.

**Using in Frontend Development**

- Separate UI logic, business logic, and data access.
- Keep components, services, and utilities focused.
- Avoid mixing API calls, storage, and navigation in a single class/component.

## Open/Closed Principle (OCP)

Software entities should be open for extension but closed for modification. This
means that you should be able to extend the behavior of a module without
modifying its source code.

**Using in Frontend Development**

- Use interfaces, hooks, and composition.
- Avoid modifying existing code to add features — instead, extend.

## Liskov Substitution Principle (LSP)

Objects of a superclass should be replaceable with objects of its subclasses
without without breaking behavior. In simpler terms, any object should be able
to be substituted with an object of its subtype without altering the behavior of
the program.

If a subclass throws or disables base class functionality, you’re likely
breaking LSP.

**Using in Frontend Development**

- Respect contracts defined in interfaces or base classes.
- Don’t override methods in a way that breaks assumptions.

## Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they do not use. It advocates
for the creation of smaller, specific interfaces rather than large, monolithic
ones, to prevent clients from being forced to implement methods they don't need.

**Using in Frontend Development**

- Avoid bloated interfaces.
- Prefer multiple small interfaces over large ones.

## Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules. Both should depend on
abstractions. It encourages the use of abstractions (such as interfaces or
abstract classes) to decouple high-level modules from low-level modules.

**Using in Frontend Development**

- Your business logic (services, Redux thunks, etc.) should depend on
  interfaces, not concrete APIs.
- Enables dependency injection, testing, and platform flexibility.

```typescript
interface NotificationService {
  send(message: string): Promise<void>;
}

class FirebaseNotificationService implements NotificationService {
  /* ... */
}

// Now you can inject a mock service during tests or swap out the implementation.
class MessageManager {
  constructor(private notification: NotificationService) {}

  notifyUser(message: string) {
    return this.notification.send(message);
  }
}
```

:::tip

Adhering to these principles can lead to more modular, maintainable, and
scalable software designs, making it easier to understand, extend, and modify
code over time.

:::
