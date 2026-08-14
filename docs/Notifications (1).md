# Notifications API

**Base URL:** `https://finance-tracker-five-liart.vercel.app`

---

## Response Format

### Success Response

```json
{
  "message": "Done",
  "success": true,
  "status": 200,
  "data": {}
}
```

| Field     | Type    | Description                                      |
|-----------|---------|--------------------------------------------------|
| message   | string  | Human-readable success message                   |
| success   | boolean | Always `true` for successful requests            |
| status    | number  | HTTP status code                                 |
| data      | object  | Returned resource or response data (may be omitted) |

### Error Response

```json
{
  "message": "Validation Error",
  "success": false,
  "status": 400,
  "errors": {}
}
```

| Field   | Type    | Description                                              |
|---------|---------|----------------------------------------------------------|
| message | string  | Description of the error                                 |
| success | boolean | Always `false` for failed requests                       |
| status  | number  | HTTP status code                                         |
| errors  | object  | Additional validation details when available             |
| stack   | string  | Stack trace (only in Development mode, omitted in Production) |

---

## Endpoints

### 1. Get All Notifications for User

Retrieves the list of notifications belonging to the authenticated user.

- **Method:** `GET`
- **URL:** `/notification`
- **Authentication:** Required (Bearer Token)

#### Headers

| Key           | Value                  | Required |
|---------------|------------------------|----------|
| authorization | `Bearer <access_token>` | ✅       |

#### Query Parameters

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| lang      | string | ❌       | Language of the response (e.g. `ar`) |

#### Example Request

```http
GET /notification?lang=ar
Authorization: Bearer <access_token>
```

---

### 2. Get Notification by ID

Retrieves a specific notification by its ID.

- **Method:** `GET`
- **URL:** `/notification/:id`
- **Authentication:** Required (Bearer Token)

#### Headers

| Key           | Value                  | Required |
|---------------|------------------------|----------|
| authorization | `Bearer <access_token>` | ✅       |

#### Path Parameters

| Parameter | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| id        | string | ✅       | The ID of the notification   |

#### Query Parameters

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| lang      | string | ❌       | Language of the response (e.g. `ar`) |

#### Example Request

```http
GET /notification/6a7f6cda463d52b19e7ae303?lang=ar
Authorization: Bearer <access_token>
```

---

## Notes

- Both endpoints require a valid **Access Token** in the `Authorization` header.
- The `lang` query parameter can be used to receive responses in Arabic (`ar`) or other supported languages.
- Token example variable used in Postman: `{{USER_ACCESS_TOKEN}}`
