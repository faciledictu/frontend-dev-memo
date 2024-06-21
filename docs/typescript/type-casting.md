---
sidebar_position: 3
---

# Type Casting

Type casting in TypeScript allows you to tell the compiler to treat a variable
as a different type. This can be useful when you know more about the type of a
variable than TypeScript does, such as when interacting with third-party
libraries or when dealing with dynamic data.

## Type Assertions

TypeScript provides two syntaxes for type assertions: Angle-bracket and
As-syntax.

```typescript
let someValue: any = 'this is a string';
let strLength: number = (<string>someValue).length;
```

```typescript
let someValue: any = 'this is a string';
let strLength: number = (someValue as string).length;
```

:::tip

The as syntax is preferred in JSX contexts (like with React), where the
angle-bracket syntax conflicts with the JSX syntax. In JSX you can still use
angle-bracket syntax but you need to add a comma after the type:

```typescript
<string,>someValue
```

:::

:::warning

type assertions do not perform any runtime type checking or data manipulation.
They purely inform the TypeScript compiler of how you want it to treat the
variable. Therefore, incorrect type assertions can lead to runtime errors if the
actual data does not match the asserted type.

:::

## Type Casting with Classes and Interfaces

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const employee = {} as User;
employee.id = 123;
employee.name = 'John Doe';
employee.email = 'j.doe@example.com';
```

Here, we're asserting that employee is of type Employee, even though we're
initializing it as an empty object and then assigning properties later.

## Examples

This example will illustrate how you might handle dynamic data fetched from an
API and assert its type for further processing. Suppose you are fetching user
data from an API, and you want to ensure that the data conforms to a specific
interface once it's fetched.

```typescript
async function fetchUserData(userId: number): Promise<User | null> {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Use a type assertion to tell TypeScript that 'data' is of type 'User'
    const user = data as User;

    // Optionally, you can add runtime checks to ensure 'data' has the expected structure
    if (
      typeof user.id === 'number' &&
      typeof user.name === 'string' &&
      typeof user.email === 'string'
    ) {
      return user;
    } else {
      console.error('Invalid user data structure:', data);
      return null;
    }
  } catch (error) {
    console.error('Fetching user data failed:', error);
    return null;
  }
}

// Usage example
fetchUserData(1).then((user) => {
  if (user) {
    console.log('User data:', user);
  } else {
    console.log('User data could not be fetched or was invalid.');
  }
});
```

After parsing the JSON response, we use const `user = data as User`; to assert
that data conforms to the User interface.

TypeScript type assertions don't perform runtime checks, that's why we add an
optional runtime validation to ensure `user` has the expected structure. This
helps avoid potential issues if the data format changes or if there's an error
in the API response.
