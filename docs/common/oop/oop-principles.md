---
sidebar_position: 1
---

# Object-Oriented Programming Principles

## Encapsulation

Encapsulation hides the internal state and behavior of an object and only
exposes a controlled interface.

- Helps maintain clear boundaries between modules.
- Prevents unintended access or modification of internal data.

**Realisation In Typescript**

- use private/protected class members to hide internal logic
- use getters/setters to control access to properties

```typescript
class SecureStoreService {
  private token: string | null = null;

  setToken(value: string) {
    this.token = value;
  }

  getToken(): string | null {
    return this.token;
  }
}
```

## Inheritance

Inheritance allows a class to inherit properties and methods from another class.

- Promotes reusability.
- Helps define base behaviors for common patterns

In modern React, where functional components are more common, we can create a
base component and then extend it with specific functionality by creating a new
component on top of it.

**Realisation In Typescript**

```typescript
const BaseButton = ({ children }) => {
  return <button>Base Button</button>;
};

const ButtonWithIcon = ({ children, icon = Icon }) => {
  return (
    <BaseButton>
      <Icon />
      {title}
    </BaseButton>
  );
};
```

In real development, though, prefer composition over inheritance for UI.

## Polymorphism

Polymorphism allows objects to be treated as instances of their parent class or
interface, enabling interchangeable use.

- Facilitates mocking and testing.
- Enables writing generic, flexible functions.

**Realisation In Typescript**

Use with interfaces for injecting dependencies (e.g., mock vs real services).

```typescript
interface INotificationService {
  sendNotification(message: string): void;
}

class EmailNotificationService implements INotificationService {
  sendNotification(message: string) {
    console.log(`Sending email: ${message}`);
  }
}

class SMSNotificationService implements INotificationService {
  sendNotification(message: string) {
    console.log(`Sending SMS: ${message}`);
  }
}

function notifyUser(service: INotificationService, message: string) {
  service.sendNotification(message);
}
```

## Abstraction

Abstraction means exposing only essential details and hiding unnecessary
complexity.

- Interfaces or abstract classes define contracts without specifying the
  implementation.
- Useful when building platform-agnostic services (e.g., storage, network).

**Realisation In Typescript**

```typescript
interface INotificationService {
  sendNotification(message: string): void;
}

class FirebaseNotificationService implements INotificationService {
  async sendNotification(message: string) {
    // Implementation using Firebase
  }
}
```
