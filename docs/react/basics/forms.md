---
sidebar_position: 6
description:
  Controlled and uncontrolled inputs, form Actions in React 19, form libraries
tags: [junior, middle]
---

# Working with Forms

A form field is **controlled** when React state is the source of truth (`value`
plus `onChange`) and **uncontrolled** when the DOM keeps the value and React
reads it on demand (a ref or `FormData`). React 19 adds **Actions**: a function
passed to `<form action>` receives the `FormData`, and the hooks
`useActionState`, `useFormStatus` and `useOptimistic` cover the pending state,
the result and optimistic updates.

Applies to: React 19.3.

## Details

### Controlled and Uncontrolled

|                         | Controlled                                        | Uncontrolled                                     |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------ |
| Source of truth         | React state                                       | The DOM                                          |
| Props                   | `value` / `checked` + `onChange`                  | `defaultValue` / `defaultChecked`                |
| Reading the value       | From state, at any moment                         | `ref.current.value` or `new FormData(form)`      |
| Re-render per keystroke | Yes                                               | No                                               |
| Fits                    | Instant validation, dependent fields, input masks | Simple forms, large forms, `<input type="file">` |

- `value` without `onChange` makes the field read-only and logs a warning.
- A field must not switch between the modes: `value={undefined}` on the first
  render and a string later logs a warning. Start with `''`.
- `<textarea>` and `<select>` take `value` too, unlike in HTML.
- `<input type="file">` is always uncontrolled: its value is read-only.

### Actions

- `<form action={fn}>`: React calls `fn(formData)` on submit. The function can
  be async. No `preventDefault` is needed. Uncontrolled fields are reset when
  the action finishes without throwing, even if it returns validation errors:
  return the entered values and pass them to `defaultValue` to keep them.
- **`useActionState(action, initialState)`** returns
  `[state, formAction, isPending]`. The action receives
  `(previousState, formData)` and returns the next state, for example validation
  errors.
- **`useFormStatus()`** (from `react-dom`) returns `{ pending, data, … }` of the
  parent form. It works only in a component rendered **inside** the `<form>`.
- **`useOptimistic(state, updateFn)`** shows the expected result while the
  action is pending and returns to the real state when it finishes.
- In frameworks the same API submits to the server, see
  [Server Actions](../../nextjs/app-router/server-actions.mdx).

### Libraries

- **React Hook Form**: registers uncontrolled inputs through refs, so typing
  does not re-render the form. Validation with schemas (Zod, Yup) through
  resolvers. The usual choice for large forms.
- **Formik**: controlled inputs and a re-render on every change. Rarely updated;
  found mostly in existing projects.

## Example

A controlled field:

```jsx
import { useState } from 'react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const isValid = email.includes('@');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button disabled={!isValid}>Sign up</button>
    </form>
  );
}
```

An uncontrolled form read with `FormData`:

```jsx
export default function SignupForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get('email'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" />
      <button>Sign up</button>
    </form>
  );
}
```

An Action with `useActionState` and `useFormStatus`:

```jsx
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribe } from './api';

async function subscribeAction(previousState, formData) {
  const email = formData.get('email');

  if (!email.includes('@')) {
    return { error: 'Enter a valid email', email };
  }

  await subscribe(email);
  return { error: null, email: '' };
}

function SubmitButton() {
  // Reads the status of the parent <form>
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>{pending ? 'Sending…' : 'Subscribe'}</button>
  );
}

export default function SubscribeForm() {
  const [state, formAction] = useActionState(subscribeAction, {
    error: null,
    email: '',
  });

  return (
    <form action={formAction}>
      <input type="email" name="email" defaultValue={state.email} />
      <SubmitButton />
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
```

<details>
<summary>React Hook Form</summary>

```jsx
import { useForm } from 'react-hook-form';

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name:
        <input {...register('name', { required: 'Name is required' })} />
      </label>
      {errors.name && <p role="alert">{errors.name.message}</p>}
      <button>Save</button>
    </form>
  );
}
```

</details>

## Follow-up Questions

- When to validate? On change for instant feedback (controlled), on blur, or on
  submit; the server validates in any case.
- How to avoid a re-render of a large form on every keystroke? Uncontrolled
  inputs (React Hook Form), or state kept in each field component instead of the
  form.
- How to reset a form? Set the state back for controlled fields; `form.reset()`
  or a new `key` for uncontrolled ones.
- `useActionState` or `useFormStatus`? `useActionState` owns the action and
  returns its result and `isPending`. `useFormStatus` is read by a child of the
  `<form>` and returns `pending`, `data`, `method` and `action` of the
  submission, but not its result.
- What happens to `useOptimistic` when the action fails? The optimistic value is
  dropped and the real state is shown again. The error is returned by the action
  as state or, if thrown, goes to the nearest
  [error boundary](./error-boundaries.md).

## Common Mistakes

- `value` without `onChange`.
- Calling `useFormStatus` in the component that renders the `<form>`: it returns
  the status of a parent form, so `pending` is always `false`.
- Forgetting `event.preventDefault()` in `onSubmit` and getting a page reload.
- Initializing a controlled field with `undefined` or `null`.
- Expecting `<form action>` to clear controlled fields: React resets only
  uncontrolled ones; controlled values stay until the state is set back.

## See Also

- [Refs](../hooks/refs.md)
- [Concurrent Rendering](../rendering/concurrent-rendering.md#transitions)
