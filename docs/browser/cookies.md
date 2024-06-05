---
sidebar_position: 4
---

# Cookies

Cookies are small pieces of data that websites store on a clients's device to
keep track of their activity and preferences. Each cookie consists of a name,
value, and several attributes like domain, path, expiration date, and flags
(e.g., secure, HttpOnly).

## Working with Cookies

To work wiht a cookie in JavaScript, you can use the `document.cookie` property.

This code creates a cookie named `username` with the value `JohnDoe`, which
expires on June 05, 2024, and is accessible across the entire site (`path=/`).

```javascript
document.cookie =
  'username=JohnDoe; expires=Wed, 5 Jun 2024 12:00:00 UTC; path=/';
```

:::tip

When setting a cookie, you can specify an expiration date using the `expires`
attribute or a maximum age using the `max-age` attribute. If not set, the cookie
will expire when the browser is closed.

```javascript
document.cookie = 'username=JohnDoe; max-age=3600; path=/'; // Expires in 1 hour

document.cookie = 'username=JohnDoe; path=/'; // Expires when the browser is closed
```

:::

To retrieve a cookie, you can read the document.cookie property, which returns
all cookies in a single string, separated by semicolons.

```javascript
function getCookie(name) {
  let match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  if (match) {
    return match[2];
  }
  return null;
}

const username = getCookie('username');
console.log(username); // Output will be the value of 'username' cookie if it exists
```

`` new RegExp(`(^| )${name}=([^;]+)`) `` creates a regular expression to find
the cookie by name. It looks for the cookie name at the start of the string or
preceded by a space `(^| )${name}=`, followed by the cookie value until the next
semicolon`([^;]+)`.
