---
sidebar_position: 7
description: Authentication vs authorization, sessions vs JWT, OAuth and OIDC
---

# Authentication and Authorization

**Authentication** answers "who are you?": the user proves their identity. If it
fails, the server responds with `401`. **Authorization** answers "what are you
allowed to do?": the server checks the rights of an already known user. If it
fails, the response is `403`. Since HTTP is stateless, after login the user is
recognized on every request either by a **server session** or by a signed
**token** (JWT).

## Details

### Sessions vs JWT

|                  | Server session                          | JWT                                              |
| ---------------- | --------------------------------------- | ------------------------------------------------ |
| The client holds | a random session ID                     | a signed token with claims (user ID, expiration) |
| The server holds | the session data in a database or Redis | nothing; it only verifies the signature          |
| Revocation       | delete the session                      | hard: the token is valid until it expires        |
| Scaling          | all servers need access to the store    | any server with the key can verify the token     |
| Usually sent in  | a cookie                                | the `Authorization: Bearer` header, or a cookie  |

- A JWT is **signed, not encrypted**: anyone can decode and read the payload, so
  it must not contain secrets.
- Because a JWT is hard to revoke, the **access token** is made short-lived
  (minutes) and is renewed with a long-lived **refresh token** that the server
  can revoke.

### Where to Keep the Token in the Browser

| Place             | XSS                                                                       | CSRF                                                 |
| ----------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- |
| `HttpOnly` cookie | the script cannot read the token, but can still send requests as the user | sent automatically; needs `SameSite` or a CSRF token |
| `localStorage`    | any script can read the token                                             | not affected: the header is added by code            |
| Memory (variable) | harder to steal, lost on reload                                           | not affected                                         |

The usual recommendation is an `HttpOnly; Secure; SameSite` cookie. See
[Browser Storage](./storage.md#cookie-attributes).

### Ways to Authenticate

- **Password.** The server stores only a salted hash made by a slow algorithm
  (bcrypt, Argon2).
- **Multi-factor (MFA).** Two or more of: something the user knows (a password),
  has (a phone, a security key), is (biometrics).
- **Passwordless.** Magic links, one-time codes, passkeys (WebAuthn).
- **Single sign-on and social login.** Identity is confirmed by another service
  usually through OpenID Connect (or SAML in corporate SSO).

### OAuth 2.0 and OpenID Connect

- **OAuth 2.0** is a framework for **authorization**: an application gets
  limited access to the user's data in another service without seeing the
  password. The result is an access token.
- **OpenID Connect** (OIDC) is a layer on top of OAuth 2.0 that adds
  **authentication**: an ID token (a JWT) that says who the user is. "Sign in
  with Google" is OIDC.
- Browser and mobile applications use the **Authorization Code flow with PKCE**.
  The implicit flow is deprecated.

### Authorization

- Typical models: roles (RBAC) or per-resource checks ("the author can edit the
  post").
- Rights are checked **on the server** for every request. Hiding a button or a
  route in the UI is convenience, not protection.

## Follow-up Questions

- How do you log a user out with JWT? Delete the token on the client and revoke
  the refresh token on the server; the access token lives until it expires.
- What is the difference between `401` and `403`? `401`: not authenticated.
  `403`: authenticated, but not allowed.
- Why is `localStorage` a risky place for a token? Any script on the page can
  read it, so one XSS hole gives away the session.

## Common Mistakes

- "A JWT is encrypted." It is only signed; the payload is readable.
- "OAuth is an authentication protocol." It is about authorization;
  authentication is added by OpenID Connect.
- Checking rights only on the client.

## See Also

- [Authentication in Next.js](../nextjs/authentication.md)
- [CORS and the Same-Origin Policy](./cors.md)
