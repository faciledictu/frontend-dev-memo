---
sidebar_position: 5
---

# Components

## Functional Components

Defined as JavaScript functions (regular or arrow) that return React element.

- Simpler and more concise than class components. They involve less boilerplate
  code and can be easier to understand.

- They were traditionally stateless, but with the introduction of React Hooks,
  they can now manage state and side effects.

- Better performance compared to class components in certain scenarios. Since
  they are just functions, they have a smaller memory footprint and can be
  optimized more easily by the JavaScript engine.

- Easier to test because they are just JavaScript functions. You can test them
  like any other function by passing input props and asserting the output. This
  makes unit testing simpler and more straightforward.

- Functional components don't have lifecycle methods. To replace some of them
  you can use useEffect hook.

## Class Components

Defined as ES6 classes extending React.Component. They must have `render` method
to return React element.

- Have a built-in state object and can manage state using `this.state` and
  `this.setState()`.

- Support all lifecycle methods including `componentDidCatch()`, which can't be
  emulated using React Hooks.

- Can’t use hooks.
