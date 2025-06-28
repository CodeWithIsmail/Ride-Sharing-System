# Ride-Sharing System MVP Design

## 🏗️ Architecture Overview
The application follows a microservice architecture with the following services:
- **User Service**: Handles user registration, authentication, and account management.
- **Ride Service**: Manages ride requests, driver applications, and ride lifecycle.
- **Payment Service**: Processes cash payments and generates receipts.
- **Admin Service**: Provides admin functionalities for user and ride oversight.

Each service has its own MongoDB database (or collection within a shared database for simplicity) and exposes RESTful APIs. Services communicate via HTTP APIs. The frontend is built with React and Tailwind CSS, interacting with the backend via these APIs.

---

## 📊 Database Schema (MongoDB)
The database is split into collections aligned with the microservices. Below is the schema design:

### User Service Collections
- **Users**
  ```json
  {
    "_id": ObjectId,
    "email": String, // Unique, e.g., "user@example.com"
    "password": String, // Hashed password
    "name": String, // Full name
    "role": String, // Enum: ["passenger", "driver", "admin"]
    "phone": String, // Optional for drivers
    "isActive": Boolean, // For admin deactivation
    "createdAt": Date
  }
  ```

- **Sessions**
  ```json
  {
    "_id": ObjectId,
    "userId": ObjectId, // Reference to Users
    "token": String, // JWT token
    "createdAt": Date,
    "expiresAt": Date
  }
  ```

### Ride Service Collections
- **RideRequests**
  ```json
  {
    "_id": ObjectId,
    "passengerId": ObjectId, // Reference to Users
    "pickupLocation": String, // e.g., "Shahbag"
    "dropoffLocation": String, // e.g., "Dhanmondi"
    "targetTime": Date, // Desired pickup time
    "desiredFare": Number, // Proposed fare
    "status": String, // Enum: ["posted", "confirmed", "completed", "cancelled"]
    "driverId": ObjectId, // Reference to Users (null until selected)
    "createdAt": Date
  }
  ```

- **RideApplications**
  ```json
  {
    "_id": ObjectId,
    "rideRequestId": ObjectId, // Reference to RideRequests
    "driverId": ObjectId, // Reference to Users
    "appliedAt": Date
  }
  ```

### Payment Service Collections
- **Payments**
  ```json
  {
    "_id": ObjectId,
    "rideRequestId": ObjectId, // Reference to RideRequests
    "amount": Number, // Paid amount
    "paymentMethod": String, // "cash" for MVP
    "status": String, // Enum: ["pending", "completed"]
    "receiptSentAt": Date, // When receipt was emailed
    "createdAt": Date
  }
  ```

### Admin Service
- Uses the same `Users` and `RideRequests` collections for oversight (read-only access).

---

## 🛠️ Microservices and APIs
Below are the minimal APIs required to cover the MVP scope, organized by microservice.

### User Service APIs
Handles user account management and authentication.

- **POST /api/users/register**
  - Description: Register a new passenger or driver.
  - Request Body:
    ```json
    {
      "email": String,
      "password": String,
      "name": String,
      "role": String, // "passenger" or "driver"
      "phone": String // Optional, required for drivers
    }
    ```
  - Response: `201 { userId, email, name, role }`

- **POST /api/users/login**
  - Description: Authenticate user and return JWT token.
  - Request Body:
    ```json
    {
      "email": String,
      "password": String
    }
    ```
  - Response: `200 { token, userId, role }`

- **POST /api/users/logout**
  - Description: Invalidate user session.
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 { message: "Logged out" }`

- **GET /api/users/:userId**
  - Description: Get user details (for passenger viewing driver details).
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 { userId, name, phone, role }`

### Ride Service APIs
Manages ride lifecycle for passengers and drivers.

- **POST /api/rides**
  - Description: Passenger posts a new ride request.
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "pickupLocation": String,
      "dropoffLocation": String,
      "targetTime": ISODate,
      "desiredFare": Number
    }
    ```
  - Response: `201 { rideRequestId, pickupLocation, dropoffLocation, targetTime, desiredFare }`

- **GET /api/rides**
  - Description: Drivers browse available ride requests (status: "posted").
  - Headers: `Authorization: Bearer <token>`
  - Query Params: `?status=posted`
  - Response: `200 [{ rideRequestId, pickupLocation, dropoffLocation, targetTime, desiredFare, passengerId }]`

- **POST /api/rides/:rideRequestId/apply**
  - Description: Driver applies to a ride request.
  - Headers: `Authorization: Bearer <token>`
  - Response: `201 { applicationId, rideRequestId, driverId }`

- **GET /api/rides/:rideRequestId/applications**
  - Description: Passenger views driver applications for their ride.
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 [{ applicationId, driverId, driverName, driverPhone, appliedAt }]`

- **POST /api/rides/:rideRequestId/select**
  - Description: Passenger selects a driver for the ride.
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "driverId": String
    }
    ```
  - Response: `200 { rideRequestId, driverId, status: "confirmed" }`

- **POST /api/rides/:rideRequestId/cancel**
  - Description: Passenger or driver cancels a ride (before start).
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 { rideRequestId, status: "cancelled" }`

- **POST /api/rides/:rideRequestId/complete**
  - Description: Driver marks ride as completed.
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 { rideRequestId, status: "completed" }`

### Payment Service APIs
Handles cash payments and receipt generation.

- **POST /api/payments/:rideRequestId**
  - Description: Record cash payment after ride completion.
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "amount": Number
    }
    ```
  - Response: `201 { paymentId, rideRequestId, amount, status: "completed" }`

- **POST /api/payments/:paymentId/receipt**
  - Description: Generate and send digital receipt via email.
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 { paymentId, receiptSentAt }`

### Admin Service APIs
Provides admin oversight functionalities.

- **GET /api/admin/users**
  - Description: Admin views all users.
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 [{ userId, email, name, role, isActive }]`

- **PATCH /api/admin/users/:userId/deactivate**
  - Description: Admin deactivates a user account.
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 { userId, isActive: false }`

- **GET /api/admin/rides**
  - Description: Admin views all rides (posted, ongoing, completed).
  - Headers: `Authorization: Bearer <token>`
  - Query Params: `?status=posted|confirmed|completed|cancelled`
  - Response: `200 [{ rideRequestId, passengerId, driverId, status, pickupLocation, dropoffLocation, targetTime, desiredFare }]`

---

## 🔄 Workflows
Below are the key workflows for the MVP, describing how users interact with the system.

### 1. User Registration and Login
- **Passenger/Driver**:
  1. Registers via `/api/users/register` with email, password, name, and role.
  2. Logs in via `/api/users/login` to receive a JWT token.
  3. Uses the token for authenticated requests.
  4. Logs out via `/api/users/logout` to invalidate the session.

### 2. Passenger Posting and Selecting a Ride
- **Passenger**:
  1. Posts a ride request via `/api/rides` with pickup, drop-off, time, and fare.
  2. Views driver applications via `/api/rides/:rideRequestId/applications`.
  3. Selects a driver via `/api/rides/:rideRequestId/select`.
  4. Optionally cancels the ride via `/api/rides/:rideRequestId/cancel`.

### 3. Driver Applying and Completing a Ride
- **Driver**:
  1. Browses available rides via `/api/rides?status=posted`.
  2. Applies to a ride via `/api/rides/:rideRequestId/apply`.
  3. If selected, completes the ride via `/api/rides/:rideRequestId/complete`.
  4. Optionally cancels a confirmed ride via `/api/rides/:rideRequestId/cancel`.

### 4. Payment Processing
- **Passenger/Driver**:
  1. After ride completion, driver records cash payment via `/api/payments/:rideRequestId`.
  2. System generates and sends a receipt via `/api/payments/:paymentId/receipt`.

### 5. Admin Oversight
- **Admin**:
  1. Views all users via `/api/admin/users`.
  2. Deactivates a user via `/api/admin/users/:userId/deactivate`.
  3. Monitors rides via `/api/admin/rides` with optional status filtering.

---

## 🖥️ Frontend Structure (React + Tailwind CSS)
The React frontend is a single-page application (SPA) that interacts with the above APIs. Key components include:

- **Auth Components**:
  - `Register`: Form for user signup (email, password, name, role, phone).
  - `Login`: Form for user login.
  - `Logout`: Button to clear session.

- **Passenger Components**:
  - `RideForm`: Form to post a ride request (pickup, drop-off, time, fare).
  - `RideList`: Displays user’s posted rides.
  - `DriverApplications`: Shows driver applications for a ride with a "Select" button.
  - `CancelRide`: Button to cancel a ride.

- **Driver Components**:
  - `AvailableRides`: Lists posted ride requests with an "Apply" button.
  - `MyRides`: Shows driver’s applied and confirmed rides with "Complete" or "Cancel" buttons.

- **Admin Components**:
  - `UserManagement`: Table of users with a "Deactivate" button.
  - `RideMonitoring`: Table of rides with status filters.

- **Shared Components**:
  - `Navbar`: Navigation with role-based links (Passenger, Driver, Admin).
  - `ReceiptView`: Displays ride details and payment receipt.

The frontend uses Tailwind CSS for styling, with a responsive design for mobile and desktop.

---

## 🔐 Authentication
- JWT-based authentication for all APIs except `/api/users/register` and `/api/users/login`.
- Tokens are stored in the browser’s localStorage and sent in the `Authorization` header.
- Role-based access control ensures passengers, drivers, and admins access only their respective endpoints.

---

## 📧 Receipt Generation
- Receipts are generated as plain text emails with ride details (pickup, drop-off, fare, driver name, etc.).
- Sent via an email service (e.g., Nodemailer or a third-party provider like SendGrid) triggered by `/api/payments/:paymentId/receipt`.

---

## 🛠️ Implementation Notes
- **Microservice Communication**: Services communicate via HTTP REST APIs. For scalability, consider an API Gateway (e.g., Kong or Express Gateway) in production.
- **Database**: MongoDB collections can be in a single database for the MVP, with separate databases per service in production.
- **Security**:
  - Hash passwords using bcrypt.
  - Validate JWT tokens for protected routes.
  - Sanitize user inputs to prevent injection attacks.
- **Error Handling**: Return standardized error responses (e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).
- **Scalability**: Use MongoDB indexes on `email`, `rideRequestId`, and `status` for efficient queries.

This design covers the complete MVP scope with minimal APIs and a clear microservice structure, ready for implementation with React, Node.js, Express, MongoDB, and Tailwind CSS.