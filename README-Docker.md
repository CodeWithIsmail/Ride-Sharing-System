# Ride Sharing System - Docker Setup

A complete microservice-based ride-sharing application with Docker containerization.

## 🐳 Quick Start with Docker

### Prerequisites

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ride-Sharing-System
   ```

2. **Run the Docker setup script**
   ```bash
   npm run docker:setup
   ```
   
   Or manually:
   ```bash
   chmod +x docker-setup.sh
   ./docker-setup.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - User Service: http://localhost:3001
   - Ride Service: http://localhost:3002
   - Payment Service: http://localhost:3003
   - Admin Service: http://localhost:3004

## 🏗️ Architecture

The application runs in 6 containers:

| Service | Port | Description |
|---------|------|-------------|
| **MongoDB** | 27017 | Database with authentication |
| **User Service** | 3001 | Authentication & user management |
| **Ride Service** | 3002 | Ride requests & applications |
| **Payment Service** | 3003 | Payment processing |
| **Admin Service** | 3004 | Admin dashboard |
| **Frontend** | 3000 | React application |

## 🚀 Docker Commands

### Basic Operations

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# Build and start (force rebuild)
npm run docker:build

# View logs
npm run docker:logs

# Clean up everything (including volumes)
npm run docker:clean
```

### Manual Docker Commands

```bash
# Start services in background
docker-compose up -d

# Start services with logs
docker-compose up

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# View service status
docker-compose ps

# View logs for specific service
docker-compose logs -f user-service

# Execute commands in container
docker-compose exec user-service sh
```

## 🗄️ Database Setup

MongoDB is automatically initialized with:

- **Authentication**: `admin/password123`
- **Databases**: 
  - `ride-sharing-users`
  - `ride-sharing-rides`
  - `ride-sharing-payments`
  - `ride-sharing-admin`
- **Collections**: Automatically created with proper indexes
- **Test Admin User**: `admin@ridesystem.com` / `admin123`

## 🔧 Environment Variables

All environment variables are configured in `docker-compose.yml`:

### MongoDB
```yaml
MONGO_INITDB_ROOT_USERNAME: admin
MONGO_INITDB_ROOT_PASSWORD: password123
```

### User Service
```yaml
MONGODB_URI: mongodb://admin:password123@mongodb:27017/ride-sharing-users?authSource=admin
JWT_SECRET: your-super-secret-jwt-key-change-in-production
```

### Ride Service
```yaml
MONGODB_URI: mongodb://admin:password123@mongodb:27017/ride-sharing-rides?authSource=admin
USER_SERVICE_URL: http://user-service:3001
```

### Payment Service
```yaml
MONGODB_URI: mongodb://admin:password123@mongodb:27017/ride-sharing-payments?authSource=admin
RIDE_SERVICE_URL: http://ride-service:3002
USER_SERVICE_URL: http://user-service:3001
```

### Admin Service
```yaml
MONGODB_URI: mongodb://admin:password123@mongodb:27017/ride-sharing-admin?authSource=admin
USER_SERVICE_URL: http://user-service:3001
RIDE_SERVICE_URL: http://ride-service:3002
```

## 📊 Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "email": String,
  "password": String,
  "name": String,
  "role": String,
  "phone": String,
  "isActive": Boolean,
  "createdAt": Date
}
```

### RideRequests Collection
```json
{
  "_id": ObjectId,
  "passengerId": ObjectId,
  "pickupLocation": String,
  "dropoffLocation": String,
  "targetTime": Date,
  "desiredFare": Number,
  "status": String,
  "driverId": ObjectId,
  "createdAt": Date
}
```

### RideApplications Collection
```json
{
  "_id": ObjectId,
  "rideRequestId": ObjectId,
  "driverId": ObjectId,
  "appliedAt": Date
}
```

### Payments Collection
```json
{
  "_id": ObjectId,
  "rideRequestId": ObjectId,
  "amount": Number,
  "paymentMethod": String,
  "status": String,
  "receiptSentAt": Date,
  "createdAt": Date
}
```

## 🔍 Troubleshooting

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

4. **Permission issues (Linux/Mac)**
   ```bash
   # Make setup script executable
   chmod +x docker-setup.sh
   ```

### Health Checks

Each service includes health checks. Check status with:

```bash
docker-compose ps
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service

# Last 100 lines
docker-compose logs --tail=100
```

## 🧪 Testing

### API Testing

Test the services using curl:

```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"passenger"}'

# Login
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Database Access

```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh -u admin -p password123

# List databases
show dbs

# Use specific database
use ride-sharing-users

# Show collections
show collections
```

## 🚀 Production Deployment

For production deployment:

1. **Update environment variables** in `docker-compose.yml`
2. **Use production MongoDB** (MongoDB Atlas recommended)
3. **Set proper JWT secrets**
4. **Configure reverse proxy** (nginx/traefik)
5. **Set up monitoring** (Prometheus/Grafana)
6. **Use Docker secrets** for sensitive data

### Production Docker Compose Example

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  user-service:
    build: ./backend/user-service
    environment:
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
    networks:
      - app-network
    depends_on:
      - mongodb
```

## 📝 Development

### Adding New Services

1. Create service directory in `backend/`
2. Add Dockerfile
3. Update `docker-compose.yml`
4. Add service to npm scripts

### Modifying Services

```bash
# Rebuild specific service
docker-compose up --build user-service

# View service logs
docker-compose logs -f user-service

# Execute commands in service
docker-compose exec user-service sh
```

## 🎯 Next Steps

- [ ] Add Redis for caching
- [ ] Implement message queues (RabbitMQ)
- [ ] Add monitoring and logging
- [ ] Set up CI/CD pipeline
- [ ] Add automated testing
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger)

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review service logs
3. Open an issue in the repository 