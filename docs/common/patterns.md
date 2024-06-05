---
sidebar_position: 3
---

# Programming patterns

Programming patterns are solutions to common software design problems. They are
provide a proven approach to solving common design issues. These patterns help
developers create more flexible, reusable, and maintainable code.

## Classification

### Creational Patterns

These deal with object creation mechanisms, trying to create objects in a manner
suitable to the situation.

Examples: Singleton, Factory Method, Abstract Factory, Builder, Prototype.

#### Factory Method

```javascript
// Product classes
class Button {
  render() {
    console.log('Rendering a Button.');
  }
}

class IconButton extends Button {
  render() {
    console.log('Rendering an IconButton.');
  }
}

class ToggleButton extends Button {
  render() {
    console.log('Rendering a ToggleButton.');
  }
}

// Factory
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

// Client code
const button1 = ButtonFactory.createButton('icon');
button1.render();

const button2 = ButtonFactory.createButton('toggle');
button2.render();

const button3 = ButtonFactory.createButton();
button3.render();
```

### Structural Patterns

These deal with object composition, helping to ensure that if one part of a
system changes, the entire system doesn’t need to do the same.

Examples: Adapter, Composite, Proxy, Flyweight, Facade.

#### Facade

The Facade pattern hides the complexities of the system and provides an
easy-to-use interface for the client.

Example: In a web application, a Facade might simplify interactions with a suite
of complex APIs by providing a single method that abstracts multiple underlying
calls.

```javascript
// Complex subsystem
class SubsystemA {
  operationA() {
    console.log('SubsystemA: Ready!');
  }
}

class SubsystemB {
  operationB() {
    console.log('SubsystemB: Go!');
  }
}

class SubsystemC {
  operationC() {
    console.log('SubsystemC: Fire!');
  }
}

// Facade
class Facade {
  constructor() {
    this.subsystemA = new SubsystemA();
    this.subsystemB = new SubsystemB();
    this.subsystemC = new SubsystemC();
  }

  simplifiedOperation() {
    this.subsystemA.operationA();
    this.subsystemB.operationB();
    this.subsystemC.operationC();
  }
}

// Client code
const facade = new Facade();
facade.simplifiedOperation();
```

### Behavioral Patterns

These deal with object collaboration and how responsibilities are distributed
among objects.

Examples: Observer, Strategy, Command, Chain of Responsibility, Mediator.

#### Observer

The Observer pattern defines a one-to-many dependency between objects. When one
object changes state, all its dependents are updated. It allows a subject to
notify observers about changes without knowing who or what those observers are.

Example: In JavaScript, the EventListener in the DOM API is an implementation of
the Observer pattern.

```javascript
// Subject
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach((observer) => observer.update());
  }

  changeState() {
    console.log('Subject: State has changed!');
    this.notifyObservers();
  }
}

// Observer
class Observer {
  update() {
    console.log('Observer: Notified of state change!');
  }
}

// Client code
const subject = new Subject();
const observer1 = new Observer();
const observer2 = new Observer();

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.changeState();
```
