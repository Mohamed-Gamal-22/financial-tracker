# Update Budget

## Endpoint

**PATCH** `/budget/:id`

Used to update an existing budget for the authenticated user.

### Authentication

Bearer token is required:

```http
Authorization: Bearer <USER_ACCESS_TOKEN>
```

## URL

```http
PATCH {{BASE_URL_FINANCE_TRACKER}}/budget/6a7f1e655300c122abf27c4b
```

The `id` in the URL is the ID of the budget that should be updated.

## Request Body

```json
{
  "category": "6a7b2544b7e711374175c0a8",
  "amount": 111,
  "month": "2026-07"
}
```

### Fields

| Field | Type | Example |
|---|---|---|
| `category` | string (ObjectId) | `"6a7b2544b7e711374175c0a8"` |
| `amount` | number | `111` |
| `month` | string | `"2026-07"` |

## Example

```http
PATCH {{BASE_URL_FINANCE_TRACKER}}/budget/6a7f1e655300c122abf27c4b
```

```json
{
  "category": "6a7b2544b7e711374175c0a8",
  "amount": 111,
  "month": "2026-07"
}
```

> **Note:** The Postman collection provides the HTTP method, endpoint, authentication header, and example request body for `Update Budget`. It does not include a detailed endpoint description or validation rules for these fields.
