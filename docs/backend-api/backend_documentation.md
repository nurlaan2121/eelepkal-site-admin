# Backend Documentation General Summary

The Eelep Kal API is a comprehensive backend for managing a restaurant booking platform. It provides sophisticated control over venue details, multi-level administration, and complex booking logic.

## Key Observations

- **Multi-step Venue Creation**: SuperAdmin creates venues in multiple stages (Basic info -> Details -> Hours -> Cuisines -> Amenities -> Contacts -> Conditions).
- **Table Dynamics**: Tables have statuses (OPEN/CLOSE), types, and amenities.
- **Booking Lifecycle**: Bookings go through a cycle (WAITING -> APPROVED/REJECTED -> COMPLETED).
- **Rich Menu System**: Support for categories and items with active/inactive states.

## Missing Endpoints / Notes

- **Statistics**: While "Statistics" is mentioned in the requirements, the OpenAPI reveals primarily management endpoints. Global analytics might need to be aggregated from list responses if specific statistics endpoints are not found.
- **Roles in JWT**: The frontend must verify if the role is returned explicitly in the login response or needs to be decoded from the JWT.
