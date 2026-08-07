# Google / Gmail Auth API

Base path: `{{BASE_URL_FINANCE_TRACKER}}`

Shared response format: see [auth-api.md](./auth-api.md#response-format).

---

## Overview

These endpoints authenticate users with a Google **ID Token** (`idToken`) from Google Sign-In.

| # | Endpoint | Method | Path |
| --- | --- | --- | --- |
| 1 | Continue with Google (Sign up or login) | `POST` | `/auth/gmail` |
| 2 | Login with Gmail (existing account only) | `POST` | `/auth/login/gmail` |

---

## 1. Continue with Google (Sign Up or Login)

**Method:** `POST`  
**Path:** `/auth/gmail`  
**Full URL:** `{{BASE_URL_FINANCE_TRACKER}}/auth/gmail`

### Description

Authenticates users using their Google account.

This endpoint automatically determines whether the user is new or already registered:

- **New Google account:** A new account is created and the user is logged in immediately.
- **Existing Google account:** The user is logged in directly.
- **Existing account with Email/Password:** Login is rejected because the account was created using a different authentication provider.

The email provided by Google must already be verified by Google.

### Request Body

| Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- |
| idToken | string | Yes | Must be a valid Google ID Token. | Token returned by Google Sign-In after successful authentication. |

### Example Request

```json
{
  "idToken": "<google-id-token>"
}
```

### Notes

- Use this endpoint when the client wants a single “Continue with Google” action that can register or log in.
- Provider mismatch (email/password account vs Google) is rejected.

---

## 2. Login with Gmail

**Method:** `POST`  
**Path:** `/auth/login/gmail`  
**Full URL:** `{{BASE_URL_FINANCE_TRACKER}}/auth/login/gmail`

### Description

Authenticates an **existing** user using their Google account.

The backend verifies the provided Google ID Token, checks that a corresponding Google account exists in the system, and returns authentication tokens.

### Request Body

| Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- |
| idToken | string | Yes | Must be a valid Google ID Token. | Token returned by Google Sign-In after successful authentication. |

### Example Request

```json
{
  "idToken": "<google-id-token>"
}
```

### Notes

- On success, `data` typically includes `access_token` and `refresh_token` (same pattern as email/password login).
- This endpoint expects an account that already exists via Google; it does not create a new account (unlike endpoint 1).
