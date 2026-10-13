---
sidebar_position: 3
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

```jsx
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

## Testing Approaches

### Utilities

Test utility functions by importing them and writing unit tests.

```javascript
import { myUtility } from './utils';

test('myUtility returns the correct value', () => {
  expect(myUtility('input')).toBe('expected output');
});
```

### Components

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

## See Also

- [Testing](../../tooling/testing.md) — types of tests, patterns, libraries for
  E2E testing.
