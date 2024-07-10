---
sidebar_position: 7
---

# Server Actions in Forms

React extends the HTML `<form>` element to allow Server Actions to be invoked
with the `action` prop.

```typescript
export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server';

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    };

    // mutate data
    // revalidate cache
  }

  return <form action={createInvoice}>...</form>;
}
```

## Handling Form State

To check if the form is submitting in React, use the `useFormStatus` hook. This
hook returns the status for a specific `<form>` and must be defined as a child
of the `<form>` element.

```tsx
'use client'
 
import { useFormStatus } from 'react-dom'
 
export function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button type="submit" disabled={pending}>
      Add
    </button>
  )
}
```

Since `useFormStatus` is a React hook, it should be used within a Client
Component.

## Submit a Form Programmatically

The requestSubmit method allows you to trigger the form's submit event,
including validation and event listeners, as if the form was submitted by a
user.

```jsx
// app/page.js
import { submitForm } from './actions';
import { useState } from 'react';

export default function HomePage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProgrammaticSubmit = async (e) => {
    e.preventDefault();
    formRef.current.requestSubmit();
  };

  return (
    <form ref={formRef} action={submitForm} method="post">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <button type="button" onClick={handleProgrammaticSubmit}>
        Submit Programmatically
      </button>
      <button type="submit">Submit Normally</button>
    </form>
  );
}
```
