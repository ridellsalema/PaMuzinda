# PaMuzinda API - Backend Documentation

## 1. Project Overview
PaMuzinda is a comprehensive housing and services platform backend connecting developers, landlords, handymen, transport providers, and students/general users.
Built with Node.js, Express, Supabase (PostgreSQL), and ImageKit.
- Supabase is queried using the `@supabase/supabase-js` SDK via service role key.
- Images are strictly kept only in ImageKit, while the URL is saved in the Database.

## 2. Setup Instructions
1. Clone the repository.
2. Run `npm install` to grab dependencies.
3. Copy `.env.example` to `.env` and fill in necessary Supabase, JWT, and ImageKit credentials.
4. Run `npm run dev` to start the server at `http://localhost:5000`.

## 3. Authentication Guide
The system uses stateless JSON Web Tokens (JWT).
- Login returns a `token`.
- Include it in subsequent requests: `Authorization: Bearer <token>`.
- Roles: `Student`, `General`, `Landlord`, `Handyman`, `Transport`, `Admin`.

## 4. Full Endpoint Reference

### Auth
- `POST /api/auth/register` (Public) - Body: `full_name, email, password, phone_number, role`. Success: 201. Error: 422, 409.
- `POST /api/auth/login` (Public) - Body: `email, password`. Success: 200. Error: 401.
- `POST /api/auth/logout` (Protected) - Success: 200.

### Users
- `GET /api/users/me` (Protected) - Profile object.
- `PUT /api/users/me` (Protected) - Body: `full_name?, phone_number?`.
- `POST /api/users/me/verify-student` (Student) - Multipart: `student_id`. Success: 200. Uploads ImageKit.
- `POST /api/users/me/verify-vehicle` (Transport) - Multipart: `vehicle_license`.
- `PUT /api/users/me/availability` (Handyman, Transport) - Body: `is_available` (bool).

### Properties
- `GET /api/properties` (Public) - Query params available: `min_price`, `max_price`, `is_student_only`, `sharing_type`, `property_type`, `status`.
- `GET /api/properties/:id` (Public) - Increments views.
- `POST /api/properties` (Landlord) - Body limits detailed in Joi scheme.
- `PUT /api/properties/:id` (Landlord, Owner) - Update existing.
- `DELETE /api/properties/:id` (Landlord, Owner) - Delete property.
- `PUT /api/properties/:id/status` (Landlord, Owner) - Body: `status`.
- `GET /api/properties/:id/images` (Public)
- `POST /api/properties/:id/images` (Landlord, Owner) - Multipart: `image`.
- `DELETE /api/properties/:id/images/:imageId` (Landlord, Owner) 

### Bookings
- `POST /api/bookings` (Student/General) - Body: `property_id, start_date, end_date`. Checks if 'Available'.
- `GET /api/bookings/my` (Protected) - User bookings.
- `GET /api/bookings/landlord` (Landlord) - Landlord bookings.
- `GET /api/bookings/:id` (Protected) - Check role matching.
- `PUT /api/bookings/:id/status` (Landlord) - Body: `status`. Note trigger sets Property to 'Occupied' automatically on 'Approved'.

### Maintenance
- `POST /api/maintenance` (Student/General) - Multipart: `issue_photo`. Body: `property_id, issue_type, description`. Verify active booking.
- `GET /api/maintenance/my` (Protected)
- `GET /api/maintenance/open` (Handyman) - Open without `handyman_id`.
- `GET /api/maintenance/:id` (Protected)
- `PUT /api/maintenance/:id/accept` (Handyman)
- `PUT /api/maintenance/:id/status` (Handyman, Assigned) - In Progress/Completed. Trigger assigns `completed_at`.
- `GET /api/maintenance/admin` (Admin) - Computed difference.

### Transport
- `GET /api/transport` (Public)
- `GET /api/transport/:id` (Public)
- `POST /api/transport` (Transport)
- `PUT /api/transport/:id` (Transport, Owner)
- `PUT /api/transport/:id/status` (Transport, Owner)

### Transport Bookings
- `POST /api/transport/:id/book` (Student) - Body: `pickup_time`. Postgres Trigger checks capacity/verification (P0001 raised on failure).
- `GET /api/transport-bookings/my` (Student)
- `GET /api/transport/:id/bookings` (Transport, Owner)
- `PUT /api/transport-bookings/:id/status` (Transport, Owner)

### Ratings
- `POST /api/ratings` (Protected) - Protect from self/duplicate.
- `GET /api/ratings/user/:userId` (Public)

### Messages
- `POST /api/messages` (Protected)
- `GET /api/messages/conversations` (Protected)
- `GET /api/messages/conversation/:userId` (Protected)
- `GET /api/messages/admin/:userId1/:userId2` (Admin)

### Admin
- `GET /api/admin/users` (Admin)
- `GET /api/admin/users/:id` (Admin)
- `PUT /api/admin/users/:id/verify-student` (Admin)
- `PUT /api/admin/users/:id/verify-handyman` (Admin)
- `PUT /api/admin/users/:id/verify-vehicle` (Admin)
- `PUT /api/admin/users/:id/role` (Admin)
- `DELETE /api/admin/properties/:id` (Admin)
- `GET /api/admin/stats` (Admin)

## 5. Error Handling Reference
- 400 Bad Request: Trigger failures, Invalid requests.
- 401 Unauthorized: JWT invalid or missing.
- 403 Forbidden: Missing privileges for action / RBAC failures.
- 404 Not Found: Entity missing.
- 409 Conflict: Duplications. 23505 codes in DB.
- 422 Unprocessable: Validation error from Joi.
- 502 Bad Gateway: Upstream ImageKit failed.
- 500 Internal: Logic exception.

## 6. Database Trigger Explanations
1. **prevent_overbooking**: Throws P0001 exception if available_seats drops to 0 or below during booking.
2. **reduce_available_seats**: Subtracts 1 from available_seats upon valid insert into Transport_Bookings.
3. **verify_student_transport**: Blocks transport booking specifically if `is_student_verified = false`.
4. **update_property_status**: Hooks into Booking 'Approved' status and automatically alters properties status to 'Occupied'.
5. **set_maintenance_completion**: Watches maintenance update. If `status = 'Completed'`, auto-stamps `completed_at=now()`.

## 7. ImageKit Integration
Multer ingests images into MemoryStorage. The `uploadToImageKit` helper uploads directly via buffer. 
Returned URLs are saved to the Supabase column (e.g., `image_url`).

## 8. Debugging Guide
When bugs happen:
- Watch Morgan logs in terminal (`npm run dev`). Look for 400 or 500 statuses.
- See detailed stack traces inside global errorHandler logic. If DB throws 23505, check parameters logic in the Controller before passing to next(err).
- Use `P0001` intercept inside `errorHandlers.js` if custom triggers throw string-based messages.
