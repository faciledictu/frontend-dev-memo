---
sidebar_position: 3
---

# React Fiber

Fiber is a new version of the React core algorithm, introduced in React 16. The
primary goal of Fiber is to improve the rendering performance and responsiveness
of React applications.

## Key Features of Fiber

**Incremental Rendering**: Fiber breaks down the rendering work into units that
can be spread out over multiple frames, allowing for smoother updates and better
user experiences, especially on slower devices.

**Prioritization**: Fiber can assign different priorities to different updates,
ensuring that higher-priority updates, such as user interactions, are handled
more quickly than less critical updates.

**Concurrency**: Fiber allows React to pause and resume work, making it possible
to handle high-priority updates in between lower-priority tasks.

## Work process

Fiber uses a work loop that schedules and prioritizes work.

The rendering work is divided into two phases: the "Render" phase and the
"Commit" phase.

Fiber introduces a sophisticated scheduling mechanism that prioritizes tasks
based on their urgency. Tasks are assigned expiration times, and React processes
them accordingly, ensuring that more critical updates are handled first.

### Render Phase (Reconciliation)

In this phase, Fiber creates a tree of work units, called _fiber nodes_,
representing parts of the UI. Each fiber node corresponds to a React component
and contains information about what to render and how to handle updates. Fiber
traverses this tree, calculating changes and determining what needs to be
updated. The work done in this phase _can be interrupted and resumed_, allowing
React to manage rendering in a non-blocking manner.

### Commit Phase

Once the render phase is complete and all changes are calculated, the commit
phase applies these changes to the DOM. This phase is synchronous and _must
complete without interruption_ to ensure the UI is updated consistently.

## Concepts and Terms

### Fiber Nodes

Each fiber node represents a unit of work. It keeps track of the component’s
state, effects, and context. Fiber nodes form a tree structure, mirroring the
component tree, at the same time they contain links like they are element of
linked list.

```javascript
// An example of a fiber node
const fiberNode = {
  type: 'div',
  key: 'myDiv',
  props: {
    children: [{ type: 'p', props: { children: 'Hello, world!' } }],
  },
  // Additional fields used by React Fiber
  priority: 1,
  previousOutput: null,
  parent: null,
  sibling: null,
  child: null,
};
```

### Work Loop

The work loop in Fiber is responsible for scheduling and performing the work. It
continuously checks for available work and processes it based on priority. The
loop ensures that higher-priority tasks preempt lower-priority ones, enabling a
responsive and efficient update mechanism.

## Links

<https://github.com/acdlite/react-fiber-architecture>
