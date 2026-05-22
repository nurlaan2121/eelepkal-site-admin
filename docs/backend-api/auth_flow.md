# Authentication Flow

## Admin Authentication (Super Admin & Admin)

1.  **Endpoint**: `POST /api/auth/admins/sign-in`
2.  **Request**:
    - `email`: string
    - `password`: string
3.  **Response**: `AuthResponse`
    - `accessToken`: JWT token
    - `role`: string (`SUPER_ADMIN` or `ADMIN`)
    - `venueId`: ID of the venue (if role is `ADMIN`)

## Token Management

- The `accessToken` should be sent in the `Authorization: Bearer <token>` header for all protected requests.
- Refresh logic: (To be determined based on OpenAPI models, usually involves a refresh token or sliding expiration).

## Protected Routes

- `SUPER_ADMIN` has access to `/api/super-admin-*` endpoints.
- `ADMIN` has access to `/api/admin-*` endpoints.
