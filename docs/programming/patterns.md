---
sidebar_position: 3
description:
  Creational, structural and behavioral design patterns with frontend examples,
  Observer vs Pub/Sub, Factory Method vs Simple Factory
---

# Design Patterns

A design pattern is a **known, named solution to a problem that keeps coming
up** when designing code. It is not a library or code to copy, but an idea of
how to arrange objects and functions, written differently in every project.

- Patterns give a **shared vocabulary**: "wrap it in an adapter" says a lot in
  three words.
- The classic catalog is "Design Patterns" by the **Gang of Four** (GoF: Gamma,
  Helm, Johnson, Vlissides, 1994): 23 patterns in three groups — **creational**
  (how objects are created), **structural** (how they are composed) and
  **behavioral** (how they communicate).
- The book targets class-based languages. In JavaScript many patterns shrink: a
  decorator is often just a higher-order function, a strategy is often just a
  callback.

## Details

### What a Pattern Is

- The idea of patterns comes from architecture: Christopher Alexander, "A
  Pattern Language" (1977).
- GoF describe every pattern with four elements: a **name**, the **problem**
  (when to apply it), the **solution** (the roles of objects and how they
  interact) and the **consequences** (trade-offs).
- A pattern is a **template, not code**: the same pattern looks different in
  Java, JavaScript and inside React.
- Related terms:

| Term                  | Level                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------- |
| Principle             | A general rule of good design: SOLID, DRY                                             |
| Design pattern        | A solution for a group of classes or functions: Observer, Adapter                     |
| Architectural pattern | The structure of a whole application: MVC, MVVM, Flux                                 |
| Idiom                 | A pattern specific to one language: IIFE, `for...of` over an iterable                 |
| Anti-pattern          | A common solution that causes more problems than it solves: god object, callback hell |

### Creational

How objects are created, so that code does not depend on concrete classes.

| Pattern          | Problem → solution                                                                         | In frontend                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Singleton        | Exactly one instance with a global access point                                            | An ES module export (`api`, `store`): evaluated once per module graph (a duplicated package or SSR across requests breaks the assumption) |
| Factory Method   | A base class creates objects through a method that subclasses override to choose the class | Rare in JS; usually a simple factory instead                                                                                              |
| Abstract Factory | Creates **families** of related objects without naming their classes                       | A UI kit factory returning matching `Button` and `Input` for a theme or platform                                                          |
| Builder          | Builds a complex object step by step; the same steps can produce different results         | Query builders (`knex`), test data builders                                                                                               |
| Prototype        | New objects are created by **copying** an existing instance                                | `structuredClone`, `{ ...obj }`, a `clone()` method. JS prototypes share the name but **delegate** to the prototype instead of copying    |

### Structural

How objects and classes are combined into larger structures.

| Pattern   | Problem → solution                                                                                                                              | In frontend                                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Adapter   | An object has the wrong interface → a wrapper converts it to the expected one                                                                   | A wrapper that gives an old or third-party library the interface the app expects                                                       |
| Bridge    | Two dimensions vary independently → split an abstraction and its implementation                                                                 | Chart components over interchangeable Canvas / SVG renderers                                                                           |
| Composite | Clients should treat single objects and groups of objects **uniformly** → both share one interface, groups contain children                     | The DOM (an element and a tree of elements are both `Node`s), nested React components, menus                                           |
| Decorator | Add behavior to an object without changing it → wrap it, keeping the interface                                                                  | Higher-order functions (`withRetry(fetch)`), HOCs. TS / ES `@decorators` are definition-time metaprogramming, related but not the same |
| Facade    | A complex subsystem → one simple interface over it                                                                                              | An `api` module hiding `fetch`, auth and retries                                                                                       |
| Flyweight | Many similar objects use too much memory → share the **intrinsic** state (the same for all), pass the **extrinsic** state (unique) from outside | Thousands of map markers share one icon object; each keeps only its position                                                           |
| Proxy     | Control access to an object → a stand-in with the same interface                                                                                | JavaScript `Proxy`, Vue reactivity, lazy loading, caching                                                                              |

**Adapter vs Decorator vs Proxy vs Facade** — all wrap something:

- **Adapter** **changes** the interface to the one the client expects.
- **Decorator** keeps the interface and **adds** behavior.
- **Proxy** keeps the interface and **controls access**: lazy creation, caching,
  validation, permissions.
- **Facade** creates a **new, simpler** interface over **several** objects.

### Behavioral

How objects communicate and how responsibilities are distributed.

| Pattern                 | Problem → solution                                                                                                      | In frontend                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Observer                | Objects need to know about changes in another → it notifies its subscribers                                             | `addEventListener`, store subscriptions, signals                                                                                    |
| Strategy                | Interchangeable algorithms → each behind one interface, chosen at runtime                                               | A sorting, validation or pricing function passed in                                                                                 |
| Command                 | An action should be queued, logged or undone → represent it as an object                                                | Undo / redo stacks, keyboard shortcuts; loosely, Redux actions (the Redux style guide models them as events, not commands)          |
| Chain of Responsibility | A request passes along a chain of handlers until one handles it                                                         | Event bubbling (until `stopPropagation`), middleware in Redux and Express (a variant: each handler may act and pass the request on) |
| Mediator                | Many objects talk to each other → they talk through one central object                                                  | A form controller coordinating its fields, a chat room                                                                              |
| Iterator                | Traverse a collection without exposing its structure                                                                    | `Symbol.iterator`, `for...of`, generators                                                                                           |
| State                   | Behavior depends on the current state → one object per state with the behavior for it; the object switches between them | A map of handlers per status (`idle`, `loading`, `error`), state machines (XState) — instead of `switch (status)` everywhere        |
| Template Method         | A base class fixes the steps of an algorithm, subclasses fill in some of them                                           | Lifecycle methods of React class components                                                                                         |
| Memento                 | Save and restore an object's state without exposing its internals                                                       | Undo history of state snapshots, time travel in Redux DevTools                                                                      |
| Visitor                 | Add operations to a structure of objects without changing their classes                                                 | Traversal of an AST (abstract syntax tree: code as a tree of nodes) in Babel plugins and ESLint rules                               |
| Interpreter             | Represent the grammar of a small language as objects and evaluate its sentences (parsing is a separate step)            | Evaluating a filter or formula expression from its AST (syntax tree), template engines                                              |

### Observer vs Pub/Sub

- **Observer**: subscribers register directly with the subject, and the subject
  calls them. The subject holds references to its observers.
- **Pub/Sub** (publish–subscribe): publishers and subscribers do not know about
  each other; a **broker** (an event bus, a message channel) routes messages by
  topic.
- `EventTarget` in the DOM is Observer; an event bus (`mitt`) or a
  `BroadcastChannel`, where both sides only know the channel name, is Pub/Sub.
- Observer notifications are usually **synchronous** (the subject calls each
  observer in turn); Pub/Sub delivery is often **asynchronous** or buffered by
  the broker.
- Pub/Sub is not one of the 23 GoF patterns; it is a messaging pattern built on
  the same idea.

### Beyond the GoF

| Pattern              | Idea                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| Module               | Hide private state in a closure or a module and export a public API                                         |
| Simple Factory       | One function that picks which object to create (not a GoF pattern)                                          |
| Dependency Injection | Dependencies are passed in from outside instead of being created inside (see [SOLID](./paradigms/solid.md)) |
| Mixin                | Copy methods from several sources into one class or object                                                  |

### Architectural Patterns

A level above design patterns: how the whole UI and its data are organized.

| Pattern | Parts and data flow                                                                                                       | Examples                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| MVC     | **Model** (data and rules), **View** (display), **Controller** (handles input, updates the model); Trygve Reenskaug, 1979 | Ruby on Rails; Backbone is MV* (no controllers)             |
| MVVM    | The **ViewModel** exposes state and commands; the View is bound to it and updates automatically                           | Knockout, Angular; Vue is partly inspired by it             |
| Flux    | **One-way** flow: action → dispatcher → store → view; the view never changes the store directly                           | Flux (Facebook); Redux is Flux-inspired, with no dispatcher |

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
  dependencies, hard to replace in tests, shared between tests and between
  requests on a server. In JS a module export is a singleton anyway; pass it as
  a dependency where tests need to swap it.
- Factory Method vs Simple Factory? Factory Method is a method that subclasses
  override to choose the product class; a simple factory is one function with a
  `switch` or a map.
- Strategy vs State? Both swap an object's behavior. In Strategy the client
  chooses the algorithm; in State the object switches itself as its state
  changes.
- Which patterns does React use? Composite (component tree), Observer (state
  subscriptions, `useSyncExternalStore`), Decorator (HOCs — higher-order
  components), Strategy (render props, callbacks), Command (actions in
  `useReducer`).
- Why do many GoF patterns look trivial in JavaScript? Functions are first-class
  values: Strategy, Command and Decorator need a function, not a class
  hierarchy.

## Common Mistakes

- Calling a function with a `switch` a "Factory Method".
- Treating Observer and Pub/Sub as the same thing.
- Mixing up Adapter, Decorator and Proxy: they differ in what happens to the
  interface.
- Reaching for a pattern first and looking for a problem second.

## See Also

- [SOLID Principles](./paradigms/solid.md)
- [OOP Principles](./paradigms/oop-principles.md)
- [Refactoring.Guru: Design Patterns](https://refactoring.guru/design-patterns)
  — every GoF pattern with diagrams and examples.
