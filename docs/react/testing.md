---
sidebar_position: 25
---

# Testing

Testing in React applications involves verifying that components, utilities, and
other parts of your application work as expected.

## Testing Tools

### Jest

A JavaScript testing framework designed to ensure the correctness of any
JavaScript codebase. It's often used with React due to its simplicity and
powerful features like snapshot testing, mocking, and a built-in test runner.

### Enzyme

A testing utility for React that makes it easier to assert, manipulate, and
traverse your React components' output. It provides a shallow rendering API,
which is useful for testing components in isolation.

:::note

Enzyme is outdated and does not have official support for React 18. The
community has moved towards React Testing Library due to better support and an
actively maintained ecosystem.

:::

### React Testing Library

A library for testing React components that encourages good testing practices by
focusing on how the user interacts with your components. It promotes testing
from the user's perspective rather than the implementation details.

## Patterns

### Arrange — Act — Assert

Organize tests by arranging the conditions, acting on the component, and
asserting the outcomes.

```javascript
test('increments counter', () => {
  // Arrange
  render(<Counter />);
  const button = screen.getByText(/increment/i);

  // Act
  fireEvent.click(button);

  // Assert
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

### Mocking

Use mocks to isolate the component under test from external dependencies.

```jsx
import axios from 'axios';
jest.mock('axios');

test('fetches data on mount', async () => {
  axios.get.mockResolvedValue({ data: { value: 'response' } });
  render(<MyComponent />);
  expect(await screen.findByText('response')).toBeInTheDocument();
});
```

## Testing Approaches

### Utilities

Test utility functions by importing them and writing unit tests.

```javascript
import { myUtility } from './utils';

test('myUtility returns the correct value', () => {
  expect(myUtility('input')).toBe('expected output');
});
```

### Componets

Test components by rendering them and asserting on their output. Use React
Testing Library for rendering and querying elements, and Jest for assertions.

```jsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders MyComponent with the correct text', () => {
  render(<MyComponent />);
  const linkElement = screen.getByText(/correct text/i);
  expect(linkElement).toBeInTheDocument();
});
```

#### Modals

Test modals by asserting their open/close behavior and content rendering.

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyModal from './MyModal';

test('opens and closes the modal', () => {
  render(<MyModal />);
  fireEvent.click(screen.getByText(/open modal/i));
  expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/close modal/i));
  expect(screen.queryByText(/modal content/i)).toBeNull();
});
```

#### Higher-Order Components

Test HOCs by wrapping a dummy component and asserting its behavior.

```jsx
import { render } from '@testing-library/react';
import withHOC from './withHOC';

const DummyComponent = () => <div>Dummy</div>;
const WrappedComponent = withHOC(DummyComponent);

test('HOC enhances the component', () => {
  const { getByText } = render(<WrappedComponent />);
  expect(getByText('Dummy')).toBeInTheDocument();
});
```

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

## Testing Pyramid and Testing Trophy

The Testing Pyramid and the Testing Trophy share similarities in promoting a
balanced approach to testing. However, the Testing Trophy emphasizes integration
tests more, suggesting they provide a better balance between speed, coverage,
and maintainability compared to unit tests alone.

![Testing Pyramid and Testing Trophy](/img/test-shapes.png)

## Libraries for E2E Testing

E2E testing is an essential part of a comprehensive testing strategy, providing
confidence that your application works correctly from the user's perspective.

### Cypress

Easy setup, real-time reloading, powerful debugging tools, automatic waiting.

```javascript
describe('My First Test', () => {
  it('Visits the app', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Welcome to My App');
  });
});
```

### Playwright

Supports multiple browsers (Chromium, Firefox, WebKit), cross-browser testing,
advanced features like network interception.

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
```
