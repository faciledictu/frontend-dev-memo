---
sidebar_position: 3
description:
  React Testing Library queries, user-event, async tests, hooks and E2E with
  Playwright
---

# Testing React Components

Components are tested **the way a user uses them**: render the component, find
elements by role or label, interact, check what is on the screen. The standard
set is **React Testing Library** (RTL) with **user-event** on top of **Vitest**
or **Jest** in a simulated DOM. State, instances and other implementation
details are not tested. End-to-end tests run in a real browser with
**Playwright**.

Applies to: React Testing Library 16, user-event 14.

## Details

### Tools

| Tool                          | Role                                                               |
| ----------------------------- | ------------------------------------------------------------------ |
| Vitest, Jest                  | Test runner, assertions, mocks                                     |
| jsdom, happy-dom              | A DOM implementation for Node.js                                   |
| `@testing-library/react`      | `render`, `screen`, queries, `renderHook`                          |
| `@testing-library/user-event` | Realistic user interactions                                        |
| `@testing-library/jest-dom`   | Matchers: `toBeInTheDocument`, `toBeDisabled`, `toHaveTextContent` |
| MSW                           | Mocks the network at the request level instead of mocking `fetch`  |
| `@playwright/test`            | E2E tests in real browsers                                         |

Enzyme, which tested component internals, has no official adapter for React 17
and later.

### Queries

| Query      | No match                | Use for                                 |
| ---------- | ----------------------- | --------------------------------------- |
| `getBy…`   | Throws                  | Elements that must be there             |
| `queryBy…` | Returns `null`          | Asserting that an element is **absent** |
| `findBy…`  | Rejects after a timeout | Elements that appear **asynchronously** |

- All three throw when more than one element matches. The `…AllBy…` versions
  return an array.
- Priority: `getByRole` (with `name`) → `getByLabelText` → `getByText` →
  `getByTestId` as the last resort. A query by role also checks accessibility.

### `userEvent` and `fireEvent`

- `fireEvent.click` dispatches one DOM event.
- `user.click` reproduces the whole interaction: pointer events, focus, click;
  `user.type` presses keys one by one. It does not fire `click` on a disabled
  element and throws on one with `pointer-events: none`.
- `userEvent` methods are async: `const user = userEvent.setup()` and
  `await user.click(…)`.

### Async Code and Hooks

- Wait with `await screen.findBy…` or `await waitFor(() => expect(…))`, not with
  timeouts.
- RTL wraps `render` and events in `act`, so it is not called manually.
- A custom hook is tested with **`renderHook`**; state changes are wrapped in
  `act`. A hook used by one component is better tested through that component.

### What to Test

- What the user sees and can do: text, roles, enabled state, the result of an
  interaction, calls to callback props.
- Not the internal state, not the names of child components, not CSS classes.
- Snapshots of large trees break on any change and are rarely read.

## Example

A component test:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import Counter from './Counter';

test('increments the counter', async () => {
  // Arrange
  const user = userEvent.setup();
  render(<Counter />);

  // Act
  await user.click(screen.getByRole('button', { name: /increment/i }));

  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

Asynchronous content and an absent element:

```jsx
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import UserName from './UserName';

test('shows the user name after loading', async () => {
  const loadUser = vi.fn().mockResolvedValue({ name: 'Alice' });
  render(<UserName loadUser={loadUser} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'Alice' })).toBeVisible();
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});
```

A custom hook:

```javascript
import { act, renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import useToggle from './useToggle';

test('toggles the value', () => {
  const { result } = renderHook(() => useToggle(false));

  act(() => {
    result.current[1]();
  });

  expect(result.current[0]).toBe(true);
});
```

An E2E test with Playwright:

```typescript
import { expect, test } from '@playwright/test';

test('adds a todo', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox', { name: 'New todo' }).fill('Buy milk');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['Buy milk']);
});
```

## Follow-up Questions

- Why `getByRole` and not `getByTestId`? It finds elements the way assistive
  technology does, so the test fails when the markup stops being accessible.
- What is the difference between `getBy`, `queryBy` and `findBy`? Throws,
  returns `null`, waits.
- How to test a component that fetches data? Mock the network with MSW (or pass
  the loader as a prop) and wait for the result with `findBy…`.
- How to test a component that needs a router, a store or a context? Render it
  inside the real providers with a helper: `MemoryRouter`, a store from
  `configureStore`.

## Common Mistakes

- Testing implementation details: the test breaks on a refactoring that changes
  nothing for the user.
- `fireEvent` where `userEvent` is available.
- `getBy…` to assert absence: it throws before the assertion.
- Forgetting `await` before `user.click` or `findBy…`.
- Wrapping everything in `act` by hand.

## See Also

- [Testing](../../tooling/testing.md) — types of tests, patterns, libraries for
  E2E testing.
