# Ride Sharing System

A modern, microservice-based ride-sharing application built with React, Node.js, Express, MongoDB, and Docker. This system enables passengers to post ride requests and drivers to apply for rides, with integrated payment processing and admin oversight.

## 🏗️ System Architecture

The application follows a **microservice architecture** with the following services:

### Backend Services
- **User Service** (Port 3001): User authentication, registration, and profile management
- **Ride Service** (Port 3002): Ride request management, driver applications, and ride lifecycle
- **Payment Service** (Port 3003): Cash payment processing and receipt generation
- **Admin Service** (Port 3004): Administrative functions for user and ride oversight

### Frontend
- **React Application** (Port 3000): Modern UI built with React and Tailwind CSS

### Database
- **MongoDB**: Document-based database with separate collections for each service

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ride-Sharing-System
   ```

2. **Start all services with Docker Compose**
   ```bash
   # For Windows PowerShell
   .\docker-setup.ps1
   
   # For Linux/Mac
   ./docker-setup.sh
   
   # Or manually
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - User Service: http://localhost:3001
   - Ride Service: http://localhost:3002
   - Payment Service: http://localhost:3003
   - Admin Service: http://localhost:3004

## 🛠️ Manual Setup (Development)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Install dependencies for all services**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**

   Create `.env` files in each service directory:

   **User Service** (`backend/user-service/.env`):
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/ride-sharing-users
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

   **Ride Service** (`backend/ride-service/.env`):
   ```env
   PORT=3002
   MONGODB_URI=mongodb://localhost:27017/ride-sharing-rides
   USER_SERVICE_URL=http://localhost:3001
   ```

   **Payment Service** (`backend/payment-service/.env`):
   ```env
   PORT=3003
   MONGODB_URI=mongodb://localhost:27017/ride-sharing-payments
   RIDE_SERVICE_URL=http://localhost:3002
   USER_SERVICE_URL=http://localhost:3001
   ```

   **Admin Service** (`backend/admin-service/.env`):
   ```env
   PORT=3004
   MONGODB_URI=mongodb://localhost:27017/ride-sharing-admin
   USER_SERVICE_URL=http://localhost:3001
   RIDE_SERVICE_URL=http://localhost:3002
   ```

3. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

4. **Run the application**
   ```bash
   # Start all services
   npm run dev
   ```

## 📱 Application Features

### User Roles
- **Passenger**: Can post ride requests, select drivers, and make payments
- **Driver**: Can browse available rides, apply for rides, and complete trips
- **Admin**: Can manage users, monitor rides, and oversee system operations

### Core Workflows

#### Passenger Workflow
1. **Registration & Login**: Create account and authenticate
2. **Post Ride Request**: Specify pickup/dropoff locations, time, and fare
3. **Review Applications**: View driver applications for their ride
4. **Select Driver**: Choose a driver from applications
5. **Complete Ride**: Ride is completed by selected driver
6. **Payment**: Record cash payment and generate receipt

#### Driver Workflow
1. **Registration & Login**: Create account with phone number
2. **Browse Rides**: View available ride requests
3. **Apply for Rides**: Submit applications for desired rides
4. **Complete Rides**: Mark selected rides as completed
5. **Receive Payment**: Collect cash payment from passenger

#### Admin Workflow
1. **User Management**: View all users and deactivate accounts
2. **Ride Monitoring**: Track ride requests and completion rates
3. **System Oversight**: Monitor overall system performance

## 🔌 Complete API Documentation

### User Service APIs (Port 3001)

#### Authentication Endpoints

**POST** `/api/auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "passenger|driver|admin",
    "phone": "+1234567890" // Required for drivers
  }
  ```
- **Response**: `201` - User created successfully

**POST** `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200` - Returns JWT token and user details

**POST** `/api/auth/logout`
- **Description**: Logout user and invalidate session
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - Logout successful

#### User Management Endpoints

**GET** `/api/users/verify`
- **Description**: Verify JWT token and get user details
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - User details

**GET** `/api/users/:userId`
- **Description**: Get user details by ID
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - User profile (without password)

**GET** `/health`
- **Description**: Health check endpoint
- **Response**: `200` - Service status

### Ride Service APIs (Port 3002)

#### Ride Request Management

**POST** `/api/rides`
- **Description**: Create a new ride request (Passengers only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "pickupLocation": "Shahbag, Dhaka",
    "dropoffLocation": "Dhanmondi, Dhaka",
    "targetTime": "2024-01-15T10:00:00.000Z",
    "desiredFare": 150
  }
  ```
- **Response**: `201` - Ride request created

**GET** `/api/rides`
- **Description**: Get available ride requests (Drivers only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `status=posted|confirmed|completed|cancelled`
- **Response**: `200` - List of ride requests

#### Driver Applications

**POST** `/api/rides/:rideRequestId/apply`
- **Description**: Apply for a ride request (Drivers only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `201` - Application submitted

**GET** `/api/rides/:rideRequestId/applications`
- **Description**: Get applications for a ride request (Passenger only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - List of driver applications

#### Ride Management

**POST** `/api/rides/:rideRequestId/select`
- **Description**: Select a driver for ride (Passenger only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "driverId": "driver_user_id"
  }
  ```
- **Response**: `200` - Driver selected

**POST** `/api/rides/:rideRequestId/cancel`
- **Description**: Cancel a ride request
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - Ride cancelled

**POST** `/api/rides/:rideRequestId/complete`
- **Description**: Mark ride as completed (Driver only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - Ride completed

### Payment Service APIs (Port 3003)

#### Payment Processing

**POST** `/api/payments/:rideRequestId`
- **Description**: Record cash payment for completed ride
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "amount": 150
  }
  ```
- **Response**: `201` - Payment recorded

**POST** `/api/payments/:paymentId/receipt`
- **Description**: Generate digital receipt for payment
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - Receipt generated

### Admin Service APIs (Port 3004)

#### User Management

**GET** `/api/admin/users`
- **Description**: Get all users (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - List of all users

**PATCH** `/api/admin/users/:userId/deactivate`
- **Description**: Deactivate a user account (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200` - User deactivated

#### Ride Monitoring

**GET** `/api/admin/rides`
- **Description**: Get all rides with optional status filter (Admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `status=posted|confirmed|completed|cancelled`
- **Response**: `200` - List of all rides

## 🗄️ Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "email": String, // Unique, lowercase
  "password": String, // Hashed with bcrypt
  "name": String,
  "role": String, // "passenger", "driver", "admin"
  "phone": String, // Required for drivers
  "isActive": Boolean, // For admin deactivation
  "createdAt": Date
}
```

### Sessions Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId, // Reference to Users
  "token": String, // JWT token
  "createdAt": Date,
  "expiresAt": Date // TTL index for automatic cleanup
}
```

### RideRequests Collection
```json
{
  "_id": ObjectId,
  "passengerId": ObjectId, // Reference to Users
  "pickupLocation": String,
  "dropoffLocation": String,
  "targetTime": Date,
  "desiredFare": Number,
  "status": String, // "posted", "confirmed", "completed", "cancelled"
  "driverId": ObjectId, // Reference to Users (null until selected)
  "createdAt": Date
}
```

### RideApplications Collection
```json
{
  "_id": ObjectId,
  "rideRequestId": ObjectId, // Reference to RideRequests
  "driverId": ObjectId, // Reference to Users
  "appliedAt": Date
}
```

### Payments Collection
```json
{
  "_id": ObjectId,
  "rideRequestId": ObjectId, // Reference to RideRequests
  "amount": Number,
  "paymentMethod": String, // "cash" for MVP
  "status": String, // "pending", "completed"
  "receiptSentAt": Date, // When receipt was generated
  "createdAt": Date
}
```

## 🔧 Development

### Running Individual Services

```bash
# User Service
cd backend/user-service
npm run dev

# Ride Service
cd backend/ride-service
npm run dev

# Payment Service
cd backend/payment-service
npm run dev

# Admin Service
cd backend/admin-service
npm run dev

# Frontend
cd frontend
npm start
```

### Docker Commands

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart specific service
docker-compose up --build user-service
```

### Database Access

```bash
# Connect to MongoDB container
docker exec -it ride-sharing-mongodb mongosh -u admin -p password123

# List databases
show dbs

# Use specific database
use ride-sharing-users
```

## 🧪 Testing

### API Testing with Postman

1. **Import the provided Postman collection**
2. **Set up environment variables**:
   - `base_url`: `http://localhost:3001`
   - `ride_service_url`: `http://localhost:3002`
   - `payment_service_url`: `http://localhost:3003`
   - `admin_service_url`: `http://localhost:3004`

3. **Test workflow**:
   - Register users (passenger, driver, admin)
   - Login to get JWT tokens
   - Test complete ride flow
   - Test payment processing
   - Test admin functions

### Manual Testing

```bash
# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health

# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"passenger"}'
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Role-based Access Control**: Different permissions for different user roles
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Cross-origin resource sharing configuration
- **Session Management**: Automatic session cleanup with TTL indexes

## 🚀 Deployment

### Production Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://username:password@host:port/database

# JWT
JWT_SECRET=your-super-secure-production-secret-key

# Service URLs (for production)
USER_SERVICE_URL=https://user-service.yourdomain.com
RIDE_SERVICE_URL=https://ride-service.yourdomain.com
```

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Stop conflicting services
   docker-compose down
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Service not starting**
   ```bash
   # Check all logs
   docker-compose logs
   
   # Rebuild specific service
   docker-compose up --build user-service
   ```

### Health Checks

Each service includes health check endpoints:
- User Service: `GET /health`
- Ride Service: `GET /health`
- Payment Service: `GET /health`
- Admin Service: `GET /health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Open an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 📊 System Requirements

- **Node.js**: v14 or higher
- **MongoDB**: v4.4 or higher
- **Docker**: v20.10 or higher (for containerized deployment)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space

## 🔄 Version History

- **v1.0.0**: Initial release with basic ride-sharing functionality
- **v1.1.0**: Added payment processing and receipt generation
- **v1.2.0**: Enhanced admin dashboard and user management
- **v1.3.0**: Docker containerization and production deployment support
