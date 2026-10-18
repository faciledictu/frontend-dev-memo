---
sidebar_position: 8
description: createPortal, event bubbling through portals, modal accessibility
tags: [middle]
---

# Portals

A **portal** renders children into a different DOM node:
`createPortal(children, domNode)`. In the React tree they stay where they were,
so **context** and **event bubbling** follow the React tree, not the DOM.
Portals are used for modals, tooltips and dropdowns that must escape the
parent's `overflow: hidden` or stacking context.

Applies to: React 19.3.

## Details

- `createPortal` is imported from `react-dom` and is returned from a component
  like any JSX.
- **Events bubble through the React tree.** A click inside a portal reaches
  `onClick` of its React parent, although that parent is not its DOM ancestor.
  To prevent it, stop the propagation inside the portal.
- **Context** from the React parents is available inside a portal.
- **CSS** follows the DOM: styles are inherited from the target node, not from
  the React parent.
- On the server there is no `document`. A portal is rendered only on the client,
  after mount.

### Accessibility of Modals

A portal moves only the DOM nodes. A modal also needs:

- `role="dialog"`, `aria-modal="true"` and a label;
- focus moved into the modal on open, kept inside while it is open and returned
  to the trigger on close;
- closing on `Escape`.

The native **`<dialog>`** element with `showModal()` does all of this except the
label and renders in the browser's top layer, so a portal is often unnecessary.
Tooltips and menus get the top layer from the **`popover`** attribute.

## Example

The modal is rendered into `#modal-root`, but a click inside it still bubbles to
the `onClick` of `App`:

```jsx
import { useState } from 'react';
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Example">
      {children}
    </div>,
    document.getElementById('modal-root')
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // highlight-next-line
    <div onClick={() => console.log('Bubbled to App')}>
      <button onClick={() => setIsOpen(true)}>Show modal</button>
      {isOpen && (
        <Modal>
          <p>This is a modal</p>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
}
```

## Follow-up Questions

- Why not render the modal in place? A parent with `overflow: hidden`,
  `transform` or its own stacking context clips it or limits its `z-index`.
- Does a portal break context or event handling? No, both follow the React tree.
- Where is the content in the DOM? In the target node, usually a sibling of the
  app root in `<body>`.
- When is a portal not needed? When `<dialog>` with `showModal()` or a `popover`
  element is enough: both render in the top layer above any `overflow` or
  `z-index`.

## Common Mistakes

- Expecting a portal to stop event bubbling: events still reach the React
  parents.
- Calling `document.getElementById` at module level or during a server render:
  there is no `document` on the server.
- Treating the portal as the whole modal: focus management, `Escape` and
  `aria-modal` are still needed.

## See Also

- [React in the Browser](../rendering/react-in-browser.md)
- [Synthetic Events](./events.md)
- [`createPortal` reference](https://react.dev/reference/react-dom/createPortal)
