---
sidebar_position: 3
description:
  Creational, structural and behavioral design patterns with frontend examples,
  Observer vs Pub/Sub, Factory Method vs Simple Factory
---

# Design Patterns

Design patterns are named, reusable solutions to recurring design problems,
catalogued by the "Gang of Four" (Gamma, Helm, Johnson, Vlissides, 1994). They
fall into three groups: **creational** (how objects are created: Singleton,
Factory, Builder), **structural** (how objects are composed: Adapter, Decorator,
Facade, Proxy) and **behavioral** (how objects communicate: Observer, Strategy,
Command). In JavaScript many of them are simpler than in the original
class-based form: a module is a singleton, a higher-order function is a
decorator, a callback is a strategy.

## Details

### Creational

| Pattern        | Idea                                                    | In frontend                                          |
| -------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| Singleton      | One shared instance                                     | An ES module export (`api`, `store`), evaluated once |
| Factory Method | Subclasses decide which class to instantiate            | Rare in JS; usually replaced by a simple factory     |
| Simple Factory | One function or static method picks the class to create | `createButton(type)`, a map from type to component   |
| Builder        | Builds a complex object step by step                    | Query builders, `new URL()` + `searchParams.set`     |
| Prototype      | New objects are copies of an existing one               | `Object.create`, `structuredClone`                   |

### Structural

| Pattern   | Idea                                                   | In frontend                                       |
| --------- | ------------------------------------------------------ | ------------------------------------------------- |
| Adapter   | Converts one interface into the one the client expects | Mapping an API response to the app's model        |
| Decorator | Adds behavior without changing the original            | Higher-order functions (`withRetry(fetch)`), HOCs |
| Facade    | One simple interface over a complex subsystem          | An `api` module hiding `fetch`, auth and retries  |
| Proxy     | A stand-in that controls access to an object           | JavaScript `Proxy`, Vue reactivity, lazy loading  |
| Composite | Treats a tree of objects like a single object          | The DOM, nested React components                  |

### Behavioral

| Pattern                 | Idea                                                 | In frontend                                 |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------- |
| Observer                | A subject notifies its subscribers about changes     | `addEventListener`, store subscriptions     |
| Strategy                | Interchangeable algorithms behind one interface      | A sorting or validation function passed in  |
| Command                 | An action as an object that can be queued or undone  | Redux actions, undo / redo                  |
| Chain of Responsibility | A request passes along handlers until one handles it | Middleware (Redux, Express), event bubbling |
| Mediator                | Objects communicate through one central object       | A form controller coordinating its fields   |

### Observer vs Pub/Sub

- **Observer**: subscribers register directly with the subject, and the subject
  calls them. They know about each other.
- **Pub/Sub**: publishers and subscribers do not know about each other; an
  **event bus** (broker) routes messages by topic or channel.
- `EventTarget` in the DOM is Observer; an event bus (`mitt`) or a
  `BroadcastChannel`, where both sides only know the channel name, is Pub/Sub.

## Example

<details>
<summary>Simple Factory</summary>

```javascript
class Button {
  render() {
    return 'Button';
  }
}

class IconButton extends Button {
  render() {
    return 'IconButton';
  }
}

class ToggleButton extends Button {
  render() {
    return 'ToggleButton';
  }
}

class ButtonFactory {
  static createButton(type) {
    switch (type) {
      case 'icon':
        return new IconButton();
      case 'toggle':
        return new ToggleButton();
      default:
        return new Button();
    }
  }
}

console.log(ButtonFactory.createButton('icon').render()); // IconButton
console.log(ButtonFactory.createButton().render()); // Button
```

</details>

<details>
<summary>Facade</summary>

```javascript
// The subsystem: auth, HTTP and error reporting
const auth = { getToken: () => 'token-123' };
const http = {
  get: async (url, headers) => ({ url, headers }),
};
const logger = { error: (error) => console.error(error) };

// The facade: one call instead of three
const api = {
  async get(path) {
    try {
      return await http.get(`/api${path}`, {
        Authorization: `Bearer ${auth.getToken()}`,
      });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

console.log(await api.get('/users'));
// { url: '/api/users', headers: { Authorization: 'Bearer token-123' } }
```

</details>

<details>
<summary>Observer</summary>

```javascript
class Subject {
  #observers = new Set();

  subscribe(observer) {
    this.#observers.add(observer);
    return () => this.#observers.delete(observer); // unsubscribe
  }

  notify(data) {
    this.#observers.forEach((observer) => observer(data));
  }
}

const cart = new Subject();
const unsubscribe = cart.subscribe((items) => console.log('Badge:', items));
cart.subscribe((items) => console.log('Total:', items));

cart.notify(3); // Badge: 3, Total: 3
unsubscribe();
cart.notify(4); // Total: 4
```

</details>

<details>
<summary>Decorator as a higher-order function</summary>

```javascript
function withRetry(fn, retries = 2) {
  return async (...args) => {
    for (let attempt = 0; ; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (attempt >= retries) throw error;
      }
    }
  };
}

let calls = 0;
const flaky = async () => {
  calls++;
  if (calls < 3) throw new Error('Network error');
  return 'ok';
};

console.log(await withRetry(flaky)(), calls); // ok 3
```

</details>

## Follow-up Questions

- Why is Singleton often called an anti-pattern? It is global state: hidden
  dependencies, hard to replace in tests. In JS a module export is a singleton
  anyway; pass it as a dependency where tests need to swap it.
- Factory Method vs Simple Factory? Factory Method is a method that subclasses
  override to choose the product class; a simple factory is one function with a
  `switch` or a map.
- Which patterns does React use? Composite (component tree), Observer (state
  subscriptions, `useSyncExternalStore`), Decorator (HOCs), Strategy (render
  props, callbacks).

## Common Mistakes

- Calling a function with a `switch` a "Factory Method".
- Treating Observer and Pub/Sub as the same thing.
- Reaching for a pattern first and looking for a problem second.

## See Also

- [SOLID Principles](./paradigms/solid.md)
- [OOP Principles](./paradigms/oop-principles.md)
