---
sidebar_position: 2
---

# Timer Module

In JavaScript, timers are used to schedule functions to be executed either once
after a delay or repeatedly at specified intervals. The primary timer functions
are

`setTimeout`<br/> Executes a function once after a specified delay.

`setInterval`<br/> Repeatedly executes a function at specified intervals.

`clearTimeout`<br/> Cancels a `setTimeout` timer.

`clearInterval`<br/> Cancels a `setInterval` timer.

While the basic functionality is the same, there are some differences in how
timers are implemented and used in the browser and Node.js environments.

## Differences Between Browser and Node.js

### Module Scope

In Node.js, the Timers API is part of the built-in timers module. While you can
use `setTimeout` or `setInterval` globally, you can also import them from the
timers module for clarity.

```typescript
import { setTimeout } from 'timers';
```

### Event Loop

In browser, they run on the main thread, which means long-running timer
callbacks can block the UI. Node.js uses its event loop to handle timers,
allowing for non-blocking operations. This is more efficient for server-side
applications.

### Additional Methods

- Node.js provides the additional method `setImmediate` to execute a callback
  immediately after the current event loop cycle.

```typescript
setImmediate(() => {
  console.log('This runs immediately after the current event loop cycle');
});
```

- Another Node.js-specific method is `process.nextTick`, which schedules a
  callback to be executed at the end of the current operation, before the event
  loop continues.

```typescript
process.nextTick(() => {
  console.log('This runs before the next event loop iteration');
});
```
