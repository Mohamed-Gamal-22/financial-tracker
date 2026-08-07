# Auth API

Base path: https://finance-tracker-five-liart.vercel.app

---

## Response Format

### Success

```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {}
}
```

| Field | Type | Description |
| --- | --- | --- |
| message | string | Human-readable success message. |
| success | boolean | Always `true` for successful requests. |
| status | number | HTTP status code. |
| data | object | Returned resource or response data. May be omitted. |

**Example — success with data**

```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {
    "_id": "6865d1f4b6b0d4d1d2a1f123",
    "fullname": "Raneem Magdy",
    "email": "raneem@example.com"
  }
}
```

**Example — success without data**

```json
{
  "message": "Password reset successfully",
  "success": true,
  "status": 200
}
```

### Error

```json
{
  "message": "Validation Error",
  "success": false,
  "status": 400,
  "errors": {}
}
```

| Field | Type | Description |
| --- | --- | --- |
| message | string | Description of the error. |
| success | boolean | Always `false` for failed requests. |
| status | number | HTTP status code. |
| errors | object | Additional validation details when available. |
| stack | string | Stack trace. Returned **only in Development mode**. Omitted in Production. |

**Example — validation error**

```json
{
  "message": "Validation failed",
  "success": false,
  "status": 400,
  "errors": [
    {
      "key": "body",
      "issues": [
        {
          "path": "email",
          "message": "Invalid email address"
        },
        {
          "path": "password",
          "message": "Invalid input: expected string, received undefined"
        }
      ]
    }
  ]
}
```

**Example — business logic error**

```json
{
  "message": "Email already exists",
  "success": false,
  "status": 409
}
```

---

## Flows

### Registration flow

1. Sign Up → OTP sent to email (temp data in Redis for 24 hours)
2. Confirm Email with OTP → account created in DB
3. Login → receive tokens

Optional: Resend OTP if the user did not receive / verify the code in time (subject to OTP rules).

### Forgot password flow

1. Forgot Password (send OTP) → OTP sent to verified email
2. Reset Password with OTP + new password → password updated, sessions invalidated

---

## 1. Sign Up (Register)

**Method:** `POST`  
**Path:** `/auth/signup`  
**Full URL:** `{{BASE_URL_FINANCE_TRACKER}}/auth/signup`

### Description

Creates a new account.

The account is **not created immediately in the database**. User information is temporarily stored in **Redis** for **24 hours** until the email is verified using the OTP sent to the user's email.

If the OTP is not verified within 24 hours, the temporary account data is automatically deleted and the user must register again.

### Request Body

| Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- |
| fullname | string | Yes | Must contain exactly two words separated by one space. Only English letters are allowed. | User full name |
| email | string | Yes | Must be a valid email address. | Used as the unique account identifier. |
| password | string | Yes | Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character. | User password |
| confirmPassword | string | Yes | Must follow the same password rules and match the password field exactly. | Password confirmation |
| role | number | No | `0 = USER`, `1 = ADMIN`. Default is `USER (0)`. | User role |

### Example Request

```json
{
  "fullname": "Raneem Magdy",
  "email": "raneemmagdy2002@gmail.com",
  "password": "Raneem123@",
  "confirmPassword": "Raneem123@"
}
```

---

## 2. Login

**Method:** `POST`  
**Path:** `/auth/login`  
**Full URL:** `{{BASE_URL_FINANCE_TRACKER}}/auth/login`

### Description

Authenticates a user using their email and password.

If the credentials are valid and the email has already been verified, the API returns the authentication tokens required for accessing protected endpoints.

### Request Body

| Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- |
| email | string | Yes | Must be a valid email address. | Registered user email. |
| password | string | Yes | Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character. | User password. |

### Example Request

```json
{
  "email": "raneemmagdy2002@gmail.com",
  "password": "Raneem123@"
}
```

### Notes

- On success, `data` typically includes `access_token` and `refresh_token` (used for protected endpoints).

---

## 3. Confirm Email

**Method:** `PATCH`  
**Path:** `/auth/confirm-email`  
**Full URL:** `{{BASE_URL_FINANCE_TRACKER}}/auth/confirm-email`

### Description

Verifies a user's email address using the **6-digit OTP** sent during the registration process.

If the OTP is valid, the user's account is permanently created in the database, marked as verified, and all temporary registration data stored in Redis is removed.

> **Important:** This endpoint completes the registration process. Until the email is verified, the account is **not stored in the database**.

### Request Body

| Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- |
| email | string | Yes | Must be a valid email address. | Email used during registration. |
| otp | string | Yes | Must be exactly 6 numeric digits. | OTP received via email. |

### Example Request

```json
{
  "email": "raneemmagdy2002@gmail.com",
  "otp": "530996"
}
```

---

## 4. Resend OTP

**Method:** `PATCH`  
**Path:** `/auth/resend-otp`  
**Full URL:** `{{BASE_URL_FINANCE_TRACKER}}/auth/resend-otp`

### Description

Sends a new **6-digit One-Time Password (OTP)** to the user's email for email verification.

This endpoint is intended for users who have registered but have **not yet verified their email**.

To prevent abuse, the API applies rate limiting and temporary blocking rules.

### Request Body

| Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- |
| email | string | Yes | Must be a valid email address. | Email used during registration. |

### Example Request

```json
{
  "email": "raneemmagdy2002@gmail.com"
}
```

### OTP Rules

**OTP Expiration**

- Every OTP is valid for **5 minutes**.
- While the OTP is still valid, a new OTP **cannot** be requested.

**Request Limit**

- A user can request a maximum of **5 OTPs**.
- If the limit is exceeded:
  - The user is temporarily blocked.
  - The request counter is reset.
  - No new OTP can be requested until the block expires.

**Temporary Block**

- When the request limit is exceeded, the account is blocked for **10 minutes**.
- During this period, all resend requests will be rejected.

---

## 5. Forgot Password (Send OTP)

**Method:** `POST`  
**Path:** `/auth/forgot-password-otp`  
**Full URL:** `{{BASE_URL_FINANCE_TRACKER}}/auth/forgot-password-otp`

### Description

Sends a **6-digit One-Time Password (OTP)** to the user's registered email address to begin the password reset process.

This endpoint is available only for users who registered using **Email & Password** and have already verified their email.

The OTP received from this endpoint is used in the **Reset Password** process (endpoint 6).

### Request Body

| Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- |
| email | string | Yes | Must be a valid email address. | Registered and verified user email. |

### Example Request

```json
{
  "email": "raneemmagdy2002@gmail.com"
}
```

### OTP Rules

**OTP Expiration**

- Every OTP is valid for **5 minutes**.
- While the OTP is still valid, a new OTP **cannot** be requested.

**Request Limit**

- A user can request a maximum of **5 OTPs**.
- If the limit is exceeded:
  - The user is temporarily blocked.
  - The request counter is reset.
  - No new OTP can be requested until the block expires.

**Temporary Block**

- When the request limit is exceeded, the account is blocked for **10 minutes**.
- During this period, all resend requests will be rejected.

---

## 6. Reset Password

**Method:** `PATCH`  
**Path:** `/auth/reset-password`  
**Full URL:** `{{BASE_URL_FINANCE_TRACKER}}/auth/reset-password`

### Description

Resets the user's password using the **6-digit OTP** received from the **Forgot Password** process.

The user must provide:

- Registered email address
- Valid OTP
- New password
- Password confirmation

If the OTP is valid, the password is updated, all active sessions are invalidated, and all password reset OTP data is removed.

### Request Body

| Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- |
| email | string | Yes | Must be a valid email address. | Registered user email. |
| otp | string | Yes | Must contain exactly 6 numeric digits. | OTP received via email. |
| password | string | Yes | Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character. | New password. |
| confirmPassword | string | Yes | Must match the `password` field exactly. | Password confirmation. |

### Example Request

```json
{
  "email": "raneemmagdy2002@gmail.com",
  "otp": "145229",
  "password": "Raneem123@",
  "confirmPassword": "Raneem123@"
}
```
