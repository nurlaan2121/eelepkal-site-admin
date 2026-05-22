# Endpoints Mapping

## Super Admin Endpoints
- **Venues**: `/api/super-admin-venue/*`
- **Admins**: `/api/super-admin/*`
- **Promo**: `/api/super-admin-promo/*`
- **Feedback**: `/api/super-admin-feedback/*`

## Admin Endpoints
- **My Venue**: `/api/admin-venue/*`
- **Bookings**: `/api/admin-booking/*`
- **Tables**: `/api/admin-table/*`
- **Menu**: `/api/admin-menu/*`
- **Promo**: `/api/admin-promo/*`
- **Feedback**: `/api/admin-feedback/*`

## Auth Endpoints
- **Sign In (Admins)**: `POST /api/auth/admins/sign-in`
- **SuperAdmin Verify**: `POST /api/auth/super-admin/verify-email`
- **SuperAdmin OTP**: `POST /api/auth/super-admin/send-otp-email`

## Utility (Developer) Endpoints
- **Cuisine**: `/api/dev/cuisine/*`
- **Category**: `/api/dev/category/*`
- **Venue Amenities**: `/api/dev/amenities/*`
- **Table Amenities**: `/api/dev/e-table-amenities/*`
- **Table Type**: `/api/dev/e-table-type/*`
- **Notification Type**: `/api/dev/notification-type/*`
