---
sidebar_position: 15
---

# Form Components

## Controlled Components

The form element is called controlled by React if the value of the input (like
text inputs, textareas, and select boxes) is controlled by the React state, and
any change to the input value is handled by an event handler that updates the
state.

Controlled components should use `value` prop.

```javascript
import { useState } from 'react';

const ControlledComponent = () => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`A value was submitted: ${value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={value} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ControlledComponent;
```

## Uncontrolled Components

Uncontrolled form elements, on the other hand, use DOM to manage form data.
Instead of updating the state on every change, the value is directly from the
DOM using a ref.

Uncontrolled components don't use `value` prop.

```javascript
import { useRef } from 'react';

const UncontrolledComponent = () => {
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`A value was submitted: ${inputRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UncontrolledComponent;
```

### Comparison

#### Controlled

- Predictable: data is managed by the React state.
- Immediate validation and control over form input but require event handlers to
  update the state.
- At the same time they can potentially trigger more re-renders, which can
  affect performance for large forms.
- Easier to debug and test.

#### Uncontrolled

- Data is managed by the DOM.
- Less code, but if you need immediate validation you shoud add event listener
  using DOM refs instead of react event handlers.
- Harder to debug and test.

## Working with Uncontrolled Components

Access to components values using refs:

- Create a ref using `useRef()` or `createRef()`.
- Attach the ref to the input element using the ref attribute.
- Access the input value using ref.current.value.

Instead using `value` prop you can set initial value by using `defaultValue`
prop

```javascript
<input type="text" defaultValue="Initial Value" ref={this.inputRef} />
```

Use the ref to reset the form values.

```javascript
resetForm = () => {
  this.inputRef.current.value = '';
};
```
