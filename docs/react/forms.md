---
sidebar_position: 15
---

# Working with Forms

In React, handling forms involves managing state and handling user input

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

## Form Lifecycle

1. **Initialization.** The component initializes the form state, typically using
   `useState` or libraries like Formik or React Hook Form.

2. **Rendering.** The form is rendered, and form elements are controlled through
   the component state.

3. **User Input.** Users interact with the form, triggering events like
   `onChange` and `onSubmit`.

4. **Validation.** Form data is validated, either on the client-side or
   server-side.

5. **Submission.** Form data is submitted, often via an API call.

6. **Response Handling.** The application handles the server response, updating
   the UI accordingly.

## Libraries

### Formik

Formik is a popular library for handling forms in React. It simplifies form
management, validation, and error handling.

Pros

- **Declarative.** Easy to write and understand form logic.
- **Validation.** Powerful validation support, including schema-based validation
  with Yup.
- **Field Arrays.** Built-in support for managing dynamic arrays of fields.
- **Community.** Large user base and community support.
- **Documentation.** Excellent documentation and examples.

```jsx
import React from 'react';
import { useFormik } from 'formik';

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

const MyForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
      </label>
      {formik.errors.name ? <div>{formik.errors.name}</div> : null}
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

### React Hook Form

React Hook Form is another popular library that leverages React hooks to manage
form state. It's known for its minimal re-renders and better performance.

### Pros

- **Performance.** Minimal re-renders due to uncontrolled components.
- **Simple API.** Uses React hooks for form management.
- **Integration.** Easy to integrate with UI libraries like Material-UI, Ant
  Design.
- **Lightweight.** Small bundle size compared to other libraries.
- **Validation.** Built-in support for schema validation with libraries like
  Yup.

```jsx
import React from 'react';
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name:
        <input {...register('name', { required: 'Name is required' })} />
      </label>
      {errors.name && <div>{errors.name.message}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```
