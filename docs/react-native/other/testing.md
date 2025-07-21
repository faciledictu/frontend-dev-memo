---
sidebar_position: 5
---

# Testing Strategy

1. **Static analysis**: Use ESLint (included in RN templates) and TypeScript.
   Linting catches common code errors and enforces style. The checks should run
   in CI on every PR.

2. **Unit tests**: The React Native template includes Jest by default. Write
   fast unit tests for business logic and pure functions. Keep tests small. For
   component logic (without rendering), use Jest’s describe and mocks as needed.

3. **Component/Integration tests**: Use React Native Testing Library (built on
   top of React Testing Library) to render components in a headless environment.
   Test that components render expected output given props/state, and simulate
   user interactions (fire events, use act(), etc.). Snapshot tests can catch UI
   regressions, but use sparingly (prefer explicit assertions).

4. **End-to-End (E2E) tests**: These run on devices or emulators and simulate
   real user behavior. Build your app in release mode and use a framework like
   Detox (very popular for RN) or Appium/Maestro to script interactions (tapping
   buttons, entering text) and verify screens. E2E tests give high confidence
   for critical flows (login, checkout, etc.), though they are slower and more
   fragile. Aim to cover the most important flows. In CI, you can run a subset
   of E2E tests on emulators or real device cloud services.

::: tip Coverage and Automation

Track code coverage to measure test sufficiency. Run all tests (unit +
integration) on each CI build. E.g., in GitHub Actions you might have a job
run-tests that executes npm test and then an E2E job with Detox. Failing any
test should block merging or deployment.

:::
