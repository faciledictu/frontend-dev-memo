---
sidebar_position: 1
description:
  Types of tests, pyramid vs trophy, test doubles, coverage, AAA, TDD and BDD,
  test runners and E2E tools
tags: [junior, middle]
---

# Testing

Tests are layered by scope: **static checks** (TypeScript, ESLint), **unit**
tests of functions and modules in isolation, **integration** tests of several
parts together (for UI: a component with its children, state and a mocked
network), and **end-to-end** tests of the whole app in a real browser or device.
The lower the layer, the faster and more stable the test; the higher, the more
confidence it gives. The **testing trophy** puts the most weight on integration
tests, the **testing pyramid** on unit tests. A good test checks **behavior**,
not implementation, so it survives refactoring.

Applies to: Vitest 5, Jest 30, Playwright 1.64.

## Details

### Types of Tests

| Type        | Checks                                                        | Speed   | Tools (web)                          |
| ----------- | ------------------------------------------------------------- | ------- | ------------------------------------ |
| Static      | Types, syntax, style                                          | Instant | TypeScript, ESLint                   |
| Unit        | One function or module, dependencies replaced                 | ms      | Vitest, Jest                         |
| Integration | Several units together, e.g. a form with its API calls mocked | ms–s    | Vitest / Jest + Testing Library, MSW |
| E2E         | User flows through the real app and backend                   | Seconds | Playwright, Cypress                  |

![Testing Pyramid and Testing Trophy](/img/test-shapes.png)

### Tools

| Tool       | Role                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| Vitest     | Test runner on top of Vite, Jest-compatible API, native ESM and TypeScript |
| Jest       | Test runner, the default in React Native; ESM and TS through transforms    |
| MSW        | Mocks the network at the request level, works in tests and in the browser  |
| Playwright | E2E in Chromium, Firefox and WebKit, auto-waiting, parallel runs, traces   |
| Cypress    | E2E running inside the browser, interactive runner with time travel        |

Component testing (Testing Library, queries, `userEvent`) is covered in
[Testing React Components](../react/ecosystem/testing.md).

### Test Doubles

| Double | What it is                                                      | Vitest / Jest                        |
| ------ | --------------------------------------------------------------- | ------------------------------------ |
| Stub   | Returns canned answers, nothing is checked on it                | `vi.fn().mockReturnValue(…)`         |
| Spy    | Records calls; may keep the real implementation                 | `vi.spyOn(obj, 'method')`            |
| Mock   | A double with expectations about how it is called               | `expect(fn).toHaveBeenCalledWith(…)` |
| Fake   | A working lightweight implementation: in-memory DB, fake timers | `vi.useFakeTimers()`                 |

Mock at the boundaries of the system (network, time, storage), not the code
under test: the more is mocked, the less the test proves.

### Coverage

- Shows which lines, branches and functions ran during the tests
  (`vitest --coverage` with the `@vitest/coverage-v8` provider installed,
  `jest --coverage`).
- It proves that code **ran**, not that the result was **checked**: a test
  without assertions still gives coverage.
- 100% is not a goal: the last percent costs the most and pushes toward testing
  implementation details. Teams set a threshold (often 70–80%) to catch drops.

### Properties of a Good Unit Test (F.I.R.S.T.)

- **Fast**: runs in milliseconds, so it is run often.
- **Independent**: does not depend on other tests or their order.
- **Repeatable**: the same result in any environment: no real network, time or
  randomness.
- **Self-validating**: passes or fails by itself, no manual checking of output.
- **Timely**: written together with the code, not months later.

### Arrange — Act — Assert

1. **Arrange**: set up the data, doubles and preconditions.
2. **Act**: call the code under test once.
3. **Assert**: check the result.

### TDD and BDD

- **TDD** (test-driven development): **Red** — write a failing test, **Green** —
  write the minimum code to pass it, **Refactor** — clean up with the tests
  green.
- **BDD** (behavior-driven development): TDD with tests written as behavior in
  business language, shared by developers, QA and the product side. Scenarios
  are written in **Given — When — Then** form, often in Gherkin, and run by
  Cucumber (`@cucumber/cucumber`) with step definitions in JavaScript.

### React Native

| Layer     | Tools                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Static    | TypeScript, ESLint (both in the default template)                                                                                                            |
| Unit      | Jest (in the React Native template; added with the `jest-expo` preset in Expo)                                                                               |
| Component | React Native Testing Library: renders without a device, user-centric queries (`getByRole`, see [Accessibility](../react-native/ui/accessibility.md#testing)) |
| E2E       | Maestro (YAML flows) or Detox (gray-box, JS tests) on emulators or devices                                                                                   |

## Example

A unit test can replace `fetch` with a spy; for integration tests, MSW is the
better choice: it intercepts real requests, so the code under test stays
unchanged.

```javascript
import { afterEach, expect, test, vi } from 'vitest';
import { getUserName } from './users';

afterEach(() => {
  vi.restoreAllMocks();
});

test('returns the user name from the API', async () => {
  // Arrange
  const fetchSpy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(Response.json({ name: 'Alice' }));

  // Act
  const name = await getUserName(1);

  // Assert
  expect(name).toBe('Alice');
  expect(fetchSpy).toHaveBeenCalledWith('/api/users/1');
});
```

<details>
<summary>BDD scenario in Gherkin</summary>

```gherkin
Feature: User Login

  Scenario: Successful login
    Given the user is on the login page
    When the user enters a valid username and password
    And clicks the login button
    Then the user is redirected to the dashboard
```

</details>

<details>
<summary>An E2E test with Playwright</summary>

```typescript
import { expect, test } from '@playwright/test';

test('adds a todo', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox', { name: 'New todo' }).fill('Buy milk');
  // highlight-next-line
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['Buy milk']);
});
```

</details>

## Follow-up Questions

- Pyramid or trophy? The pyramid (Mike Cohn, 2009) puts many fast unit tests at
  the bottom and few slow, brittle UI tests at the top. The trophy (Kent C.
  Dodds) argues that in UI code integration tests give the best confidence for
  the cost, because units alone rarely break the way users notice.
- Why are E2E tests flaky? Real network, timing, shared test data. Mitigated by
  auto-waiting locators instead of sleeps, isolated data and retries in CI.
- How to test code with `setTimeout` or dates? With fake timers:
  `vi.useFakeTimers()`, `vi.advanceTimersByTime(…)`, `vi.setSystemTime(…)`.
- What is snapshot testing and when does it hurt? The output is saved and
  compared on the next run: fine for small stable output (an error message),
  harmful for whole components, whose snapshots get updated with `-u` without
  being read.
- What is mutation testing? A tool (Stryker) changes the code (`>` → `>=`) and
  checks that some test fails; it measures whether the tests detect a change in
  behavior, which coverage cannot.

## Common Mistakes

- Treating coverage as a measure of quality.
- Mocking everything, including the module under test.
- Tests that depend on each other or on execution order.
- Calling any test with a mock a "unit test": a component test with a real store
  and children is an integration test.

## See Also

- [Testing React Components](../react/ecosystem/testing.md) — Testing Library,
  queries, `userEvent`.
- [CI/CD](./ci-cd.md)
