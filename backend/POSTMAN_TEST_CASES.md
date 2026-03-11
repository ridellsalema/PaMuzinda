# POSTMAN_TEST_CASES.md

Use these test cases within Postman to systematically check the backend functionality of PaMuzinda API.

## 1. Authentication

**Register Student**
- Method: `POST`
- Path: `/api/auth/register`
- Payload (JSON):
  ```json
  {
    "full_name": "John Doe",
    "email": "johndoe@university.edu",
    "password": "securepassword123",
    "phone_number": "123-456-7890",
    "role": "Student"
  }
  ```
- Expected Result: `201 Created`

**Login**
- Method: `POST`
- Path: `/api/auth/login`
- Payload (JSON):
  ```json
  {
    "email": "johndoe@university.edu",
    "password": "securepassword123"
  }
  ```
- Expected Result: `200 OK` (Store `data.token` as a Bearer Token variable)

## 2. Properties

**Create Property (Requires Landlord Token)**
- Method: `POST`
- Path: `/api/properties`
- Payload (JSON):
  ```json
  {
    "title": "Quiet Studio near campus",
    "description": "Perfect for studying.",
    "address": "123 Elm St.",
    "price_per_month": 500,
    "property_type": "Apartment",
    "sharing_type": "Solo",
    "is_student_only": true
  }
  ```
- Expected Result: `201 Created`

**Get All Properties**
- Method: `GET`
- Path: `/api/properties?is_student_only=true`
- Expected Result: `200 OK` with listed property array.

## 3. Maintenance

**Create Maintenance Request (Requires Student Token)**
- Method: `POST`
- Path: `/api/maintenance`
- Type: `multipart/form-data`
- Text fields: `property_id=1`, `issue_type=Plumbing`, `description=Leaky pipe.`
- Files field: `issue_photo=select_an_image`
- Expected Result: `403 Forbidden` (if you don't actually hold an approved booking yet). Note: Good test for logic failure prevention!

## 4. Users

**Verify Student (Requires Student Token)**
- Method: `POST`
- Path: `/api/users/me/verify-student`
- Type: `multipart/form-data`
- Files field: `student_id=select_id_card.png`
- Expected: `200 OK`, `is_student_verified` false while pending info URL mapped to ImageKit.

## 5. Transport Booking Trigger

**Attempt Booking Unverified (Requires Unverified Student Token)**
- Method: `POST`
- Path: `/api/transport/1/book` // Assume transport ID 1 exists
- Payload (JSON):
  ```json
  {
    "pickup_time": "2026-03-12T10:00:00Z"
  }
  ```
- Expected Result: `400 Bad Request` with message intercepted directly from postgres `verify_student_transport` trigger block.

## 6. Admin Stats

**Get System Stats (Requires Admin Token)**
- Method: `GET`
- Path: `/api/admin/stats`
- Expected Result: `200 OK` JSON wrapper computing users counts and aggregation layers rapidly representing PaMuzinda overall active statistics.
