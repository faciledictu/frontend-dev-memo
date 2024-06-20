---
sidebar_position: 14
---

# Portals

Portals provide a way to render children into a DOM node that exists outside the
hierarchy of the parent component. They are useful for cases where you need to
break out of the typical parent-child containment in the component tree.

Portals are particularly handy in scenarios such as:

- **Modals or dialogs** that should overlay other elements but not be
  constrained by parent styles.
- **Tooltips** that need to appear outside the parent container without being
  clipped.
- **Dropdowns or menus** to avoid clipping issues and better control the
  positioning.

## Creating

To create a portal in React, you use the ReactDOM.createPortal function and pass
children nodes as the first argumen and HTML element as the second.

`ReactDOM.createPortal(child, container);`

Below is a simple example of how to use a portal to render a modal:

```javascript
import { useState } from 'react';
import { createPortal } from 'react-dom';

// Modal component using a portal
const Modal = ({ children }) => {
  return createPortal(children, document.getElementById('modal-root'));
};

// Main App component
const App = () => {
  const [isModalActive, setIsModalActive] = useState(false);

  const handleShow = () => {
    setIsModalActive(true);
  };

  const handleHide = () => {
    setIsModalActive(false);
  };

  return (
    <div>
      <button onClick={handleShow}>Show Modal</button>
      {isModalActive && (
        <Modal>
          <div className="modal">
            <p>This is a modal!</p>
            <button onClick={handleHide}>Close Modal</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
```

:::tip

Portals allow you to render components outside their parent hierarchy, which can
be useful for various UI elements.

These elements are not affected by the parent component's overflow or other
styles.

:::

## Event Bubbling

In a typical React component tree, events bubble up from the target element to
the root. When using portals, the child component is rendered outside its parent
component in the DOM, but React maintains the connection in the React component
tree.

Events originating from elements inside a portal will propagate to ancestors in
the React tree as if the portal content were a direct child of those ancestors.

```javascript
import { useState } from 'react';
import { createPortal } from 'react-dom';

// Modal component using a portal
const Modal = ({ children }) => {
  return createPortal(children, document.getElementById('modal-root'));
};

// Main App component
const App = () => {
  const [isModalActive, setIsModalActive] = useState(false);

  const handleShow = () => {
    setIsModalActive(true);
  };

  const handleHide = () => {
    setIsModalActive(false);
  };

  // Event handler for clicks on the main container
  // highlight-start
  const handleClick = (event) => {
    console.log('Event bubbled to App component');
  };
  // highlight-end

  return (
    // highlight-next-line
    <div onClick={handleClick}>
      <button onClick={handleShow}>Show Modal</button>
      {isModalActive && (
        <Modal>
          <div className="modal">
            <p>This is a modal!</p>
            <button onClick={handleHide}>Close Modal</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
```

Despite the modal being outside the DOM hierarchy of the `App` component, the
click event bubbles up to the `App` component. Clicking on the button will close
the modal and log `Event bubbled to App component`, demonstrating that event
bubbling works across the portal boundary.
