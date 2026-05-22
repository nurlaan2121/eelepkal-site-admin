# Roles Logic

The application implements Role-Based Access Control (RBAC) with two primary administrative roles.

## SUPER_ADMIN

- **Scope**: Platform-wide.
- **Capabilities**:
    - Manage all Venues.
    - Create and assign Admins to Venues.
    - View global statistics.
    - Manage system-level dictionaries (Cuisines, Amenities, etc. via Developer APIs).

## ADMIN

- **Scope**: Single Venue (assigned by SUPER_ADMIN).
- **Capabilities**:
    - Update venue information (hours, contacts, description).
    - Manage Venue Tables.
    - Manage Bookings for their venue.
    - Manage Venue Menu.
    - Manage Venue Promos and Feedback.

## Backend Verification

The backend enforces role checks for each endpoint prefix (`/api/super-admin/` vs `/api/admin/`). The frontend must also handle this by checking the user's role in the JWT or session state.
