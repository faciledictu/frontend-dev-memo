---
sidebar_position: 7
---

# Testing

## Basic Concepts

:::info Test Plan

**Test Plan** is a document detailing the approach, resources, and schedule of
intended testing activities. It defines the scope, objectives, and focus of the
testing effort.

:::

:::info Test Suite

**Test Suite** is a collection of test cases intended to test a specific aspect
of a software application.

:::

:::info Test Case

**Test Case** is set of conditions and variables under which a tester will
determine whether a system under test satisfies requirements and functions
correctly.

:::

## Types of Tests

### Static Tests (Linter/Type Checker)

- **Purpose** Ensure code quality and catch potential errors early by checking
  for syntax errors, type mismatches, and style issues.
- **Tools** ESLint, TypeScript
- **Benefits** Fast feedback, helps maintain code quality, and catches issues
  before runtime.

### Unit Tests

- **Purpose** Test individual functions, methods, or components in isolation.
- **Tools** Jest, Mocha, Jasmine
- **Benefits** Fast execution, easy to write, and maintain. Provides confidence
  in small, isolated pieces of code.

:::tip Properties of a Good Unit Test

Unit tests should test a single part of the code without dependencies on
external systems or other tests.

F.I.R.S.T is an acronym that describes the properties of good unit tests.

1. Fast: Tests should run quickly to facilitate frequent execution.
2. Independent: Tests should not depend on each other.
3. Repeatable: Tests should yield the same result each time they run, regardless
   of the environment or the order of test execution.
4. Self-Validating: Should have clear pass/fail criteria, eliminating the need
   for manual result checking.
5. Timely: Should be written early enough to influence the code design.

In addition, tests should have a clear strucure and be easy to understand and
maintain.

:::

### Integration Tests

- **Purpose** Test the interaction between multiple units/components to ensure
  they work together as expected.
- **Tools** React Testing Library, Enzyme (though React Testing Library is
  preferred for modern React applications)
- **Benefits** Verifies that different parts of the application integrate
  correctly. More realistic than unit tests but still relatively fast.

### End-to-End (E2E) Tests

- **Purpose** Test the entire application flow from the user's perspective by
  simulating real user interactions.
- **Tools** Cypress, Selenium, Playwright
- **Benefits** Highest level of confidence, tests the entire stack including
  frontend, backend, and database. However, these tests are slower and more
  brittle.

## Patterns

### Arrange — Act — Assert

The AAA pattern helps to organize tests in a clear and consistent manner.

1. **Arrange** step involves setting up the environment for your test. You
   initialize and configure the objects, mock dependencies, and set any
   preconditions required for the test.
2. **Act** step involves invoking the method or function under test with the
   arranged parameters. You perform the action that you want to test.
3. **Assert** step involves checking that the results of the action match the
   expected outcome.

```javascript
// Function to be tested
function add(a, b) {
  return a + b;
}

// Unit test for the add function
test('adds two numbers', () => {
  // Arrange
  const num1 = 3;
  const num2 = 4;
  const expectedSum = 7;

  // Act
  const actualSum = add(num1, num2);

  // Assert
  expect(actualSum).toBe(expectedSum);
});
```

:::tip Benefits of AAA Pattern

- **Clarity.** It clearly separates the different stages of a test, making the
  test easier to read and understand.
- **Maintainability.** Tests structured in this way are easier to maintain, as
  each part of the test has a distinct purpose.
- **Consistency.** Using a consistent pattern across tests makes it easier for
  teams to write and review tests.

:::

### Mocking

Use mocks to isolate the component under test from external dependencies by
simulating them.

```jsx
import axios from 'axios';
jest.mock('axios');

test('fetches data on mount', async () => {
  axios.get.mockResolvedValue({ data: { value: 'response' } });
  render(<MyComponent />);
  expect(await screen.findByText('response')).toBeInTheDocument();
});
```

## Testing Pyramid and Testing Trophy

The Testing Pyramid and the Testing Trophy share similarities in promoting a
balanced approach to testing. However, the Testing Trophy emphasizes integration
tests more, suggesting they provide a better balance between speed, coverage,
and maintainability compared to unit tests alone.

![Testing Pyramid and Testing Trophy](/img/test-shapes.png)

## Test-First Development Techniques

### Test-Driven Development (TDD)

By using TDD, you write tests before writing the corresponding code. It follows
a simple three-step process, often referred to as the **Red-Green-Refactor**
cycle.

1. Red: write a failing test.
2. Green: write the minimum code required to pass the test.
3. Refactor: clean up the code while keeping the test passing.

### Behavior-Driven Development (BDD)

BDD is an extension of TDD that focuses on the behavior of the software.

While TDD is a primarily a developer-centric practice, BDD involves developers,
testers, and business stakeholders, promoting shared understanding and
collaboration.

That's why tests are written in a natural-like, human-readable language.

These scenarios are typically written in a **Given-When-Then** format:

1. Given: the initial context or state of the system.
2. When: the action or event that triggers the behavior.
3. Then: the expected outcome or result.

#### Write Scenarios in Gherkin Syntax

Write your test scenarios in Gherkin syntax (or recieve them). These scenarios describe the desired behavior of your application in a human-readable format.

```gherkin
Feature: User Login

  Scenario: Successful login
    Given the user is on the login page
    When the user enters a valid username and password
    And clicks the login button
    Then the user should be redirected to the dashboard
    And a welcome message should be displayed
```

You can use JavaScript to implement these steps.

```javascript
const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');

Given('the user is on the login page', async function () {
  await browser.url('/login');
});

When('the user enters a valid username and password', async function () {
  await $('#username').setValue('validUser');
  await $('#password').setValue('validPassword');
});

When('clicks the login button', async function () {
  await $('#loginButton').click();
});

Then('the user should be redirected to the dashboard', async function () {
  await browser.waitForExist('#dashboard', 5000);
  const url = await browser.getUrl();
  expect(url).to.include('/dashboard');
});

Then('a welcome message should be displayed', async function () {
  const welcomeMessage = await $('#welcomeMessage').getText();
  expect(welcomeMessage).to.equal('Welcome, validUser!');
});
```
