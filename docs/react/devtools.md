---
sidebar_position: 24
---

# Using DevTools

## React DevTools

React DevTools is a powerful browser extension that allows you to inspect the
React component hierarchy, check props and state, and debug performance issues.
Here’s how to use it effectively:

### Inspecting Components

- Open the DevTools panel (F12 or Ctrl+Shift+I).
- Click on the "React" tab to see your app's component tree.
- Select a component to inspect its props, state, and hooks in the right-hand
  pane.

- Component Debugging

Use the "Highlight Updates" feature to see which components re-render. Check the
"Profiler" tab to record and analyze render performance. Use the "Context" panel
to inspect React Context values.

- Editing State and Props

Directly edit state and props from the DevTools panel to test different
scenarios. This can help you simulate different states and debug issues without
changing your code.

## Redux DevTools

Redux DevTools is essential for debugging Redux applications. It allows you to
inspect every action and state change.

### Inspecting Actions and State

- Open the Redux DevTools from the browser’s extension icon.
- You will see a timeline of actions on the left, the state tree in the center,
  and the action details on the right.
- Click on an action to see the state before and after it was dispatched.
