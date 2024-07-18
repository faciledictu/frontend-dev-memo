---
sidebar_position: 5
---

# Authentication

## Authentication Process

Authentication is the process of verification of a user's identity.

To implement authentication in Next.js, you can use various methods. Here is the
basic email-password authentication system using a custom `signIn` function.

### Using Page Router

#### API Route for Authentication

Handles the login request and authenticates the user.

```jsx title="pages/api/auth/login.js"
import { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from '@/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body;
    await signIn({ email, password });

    res.status(200).json({ status: 'success', message: null });
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res
        .status(401)
        .json({ status: 'error', message: 'Invalid credentials.' });
    } else {
      res
        .status(500)
        .json({ status: 'error', message: 'Something went wrong.' });
    }
  }
}
```

It calls the `signIn` function, which should authenticate the user with the
provided credentials.

If the credentials are incorrect, it sends a 401 status with an error message.
For other errors, it sends a 500 status.

#### Sign-In Page

Provides a form for users to enter their credentials and submit them to the
login API.

```jsx title="pages/auth/signin.js"
import { signIn } from 'next-auth/react';

const SignIn = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push('/profile');
    } else {
      // Handle errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" name="email" required />
      </label>
      <label>
        Password:
        <input type="password" name="password" required />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
```

When the form is submitted, the handleSubmit function is called. This function
sends a POST request to the `/api/auth/login` endpoint with the email and
password

### Using App Router

#### Server Action

Implement a Server Action to handle authentication process

```jsx
'use server';

import { signIn } from '@/auth';

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      return 'Invalid credentials.';
    }
    return 'Something went wrong.';
  }
}
```

#### Sign-In Page

```jsx
'use client';

import { authenticate } from '@/app/lib/actions';
import { useActionState, useFormStatus } from 'react-dom';

export default function Page() {
  const [errorMessage, dispatch] = useActionState(authenticate, null);

  return (
    <form action={dispatch}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <div>{errorMessage && <p>{errorMessage}</p>}</div>
      <button type="submit">Login</button>
    </form>
  );
}
```

The form uses `action={dispatch}`, meaning the `dispatch` function will be
called when the form is submitted. errorMessage is used to display error
messages returned from the authentication process.

### Authentication Strategies

Theere are various methods and protocols used to verify the identity of a user
or system before granting access to resources or services. Here is a few of
them.

1. **Password-Based Authentication**. Users provide a username and password to
   log in.
2. **Multi-Factor Authentication (MFA)**. Requires two or more verification
   methods. Combines something the user knows (password), something the user has
   (security token), and/or something the user is (biometrics).
3. **Passwordless Authentication**. Eliminates the need for passwords by using
   alternative methods like magic links, biometrics, or one-time codes.
4. **OAuth**. An authorization framework that allows third-party services to
   exchange information without sharing passwords.

## Authorizaton

This is the process of determining what an authenticated user is allowed to do.

### Route Types

#### Public Routes

Routes accessible to all users, regardless of authentication status.

All routes are public by default. Simply create pages without any authentication
checks.

#### Private Routes

Routes that require users to be authenticated.

#### Restricted Routes

Routes accessible only to users with specific roles or permissions.

```jsx
const RestrictedRoute = ({ children, roles }) => {
  const { data: session } = useSession();
  if (!session || !roles.includes(session.user.role)) {
    return <Unauthorized />;
  }
  return children;
};
```

### HOC-Based Route Protection

Use a higher-order component (HOC) or middleware to check authentication status
before rendering the component.

```jsx
const PrivateRoute = ({ children }) => {
  const { data: session } = useSession();
  if (!session) {
    return <Login />;
  }
  return children;
};
```

### Middleware-Based Route Protection

Middleware allows you to run code before a request is completed. Then, based on
the incoming request, you can modify the response by rewriting, redirecting,
modifying the request or response headers, or responding directly.

In Next.js 13 and later, middleware can be placed in the middleware.js or
middleware.ts file in the root or specific directories of your project.

Example of Route Protection Middleware

```jsx
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Example: Protect routes that start with "/dashboard"
  if (pathname.startsWith('/dashboard')) {
    // Check for authentication (e.g., check cookies or headers)
    const isAuthenticated = Boolean(req.cookies.get('auth-token'));

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Continue processing if authenticated or if route does not need protection
  return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // Apply middleware to these paths
};
```

:::info

`NextResponse` and `NextRequest` extend the Web Request API with additional
convenience methods.

:::

- `matcher` option in middleware configuration allows you to specify which paths
  the middleware should apply to, providing control over where and how route
  protection is enforced.
