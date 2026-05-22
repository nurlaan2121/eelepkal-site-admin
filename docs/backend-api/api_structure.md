# API Structure

The Eelep Kal Backend API is organized into several functional areas, primarily distinguished by the roles they serve: SuperAdmin, Admin, Client, and Guest.

## Core Components

1.  **Auth**: Authentication and authorization (Sign-in for admins, OTP for clients/super-admins).
2.  **SuperAdmin**: High-level management of venues, admins, and system settings.
3.  **Admin**: Management of a specific venue (Tables, Bookings, Menu, Promo, Feedback).
4.  **Client**: APIs for registered users to manage their profile, bookings, and favorites.
5.  **Guest**: Public APIs for viewing venues, menu, and searching without authentication.
6.  **Developer**: Utility APIs for managing system-wide entities like cuisines, cities, categories, and amenities.
7.  **S3**: File uploads and downloads.

## Technical Details

- **OpenAPI Version**: 3.0.1
- **Base URL**: `https://eelepkal.com`
- **Security**: Bearer Token (JWT)
