---
sidbar_position: 5
---

# Lifecycle Methods

React components go through 3 stages during their lifecycle:

- Mounting
- Updating
- Unmounting

## Mounting Stage

Mounting is the stage when a component is being inserted into the DOM.

**Render Phase**

1. `constructor(props)` is called before the component is mounted. It's used for
   initializing state and binding event handlers.
2. `static getDerivedStateFromProps(props, state)` allows the state to be
   updated based on props.
3. `render()` is the only required method in a class component. It returns the
   JSX that represents the component UI.

**Commit phase**

4. `componentDidMount()` is called immediately after a component is mounted.
   It's a good place to initiate network requests.

## Updating Stage

Updating happens when a component's state or props change.

**Render Phase**

1. `static getDerivedStateFromProps(props, state)`
2. `shouldComponentUpdate(nextProps, nextState)` determines whether the
   component should re-render.
3. `render()`

**Precommit Phase**

4. `getSnapshotBeforeUpdate(prevProps, prevState)` is called right before the
   DOM updates. It allows capturing information from the DOM (e.g., scroll
   position) before it changes.

**Commit phase**

5. `componentDidUpdate(prevProps, prevState, snapshot)` is called immediately
   after updating.

## Unmounting Stage

Unmounting is the phase when a component is being removed from the DOM.

1. `componentWillUnmount()` is invoked immediately before a component is
   unmounted and destroyed. It's used to clean up resources such as timers,
   network requests, or subscriptions created in `componentDidMount()`.

## Links

[React Lifecycle Methods' Diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
