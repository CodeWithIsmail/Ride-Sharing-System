# 🐳 Docker Setup for Ride Sharing System

## Quick Start

### Prerequisites
- Docker & Docker Compose installed

### Run the Application
```bash
# One-command setup
npm run docker:setup

# Or manually:
docker-compose up --build -d
```

### Access Services
- **Frontend**: http://localhost:3000
- **User Service**: http://localhost:3001
- **Ride Service**: http://localhost:3002
- **Payment Service**: http://localhost:3003
- **Admin Service**: http://localhost:3004
- **MongoDB**: localhost:27017

### Test Account
- **Email**: admin@ridesystem.com
- **Password**: admin123

## Docker Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Clean everything
npm run docker:clean
```

## Architecture

- **MongoDB**: Database with authentication
- **User Service**: Authentication & user management
- **Ride Service**: Ride requests & applications
- **Payment Service**: Payment processing
- **Admin Service**: Admin dashboard
- **Frontend**: React application

## Troubleshooting

```bash
# Check service status
docker-compose ps

# View specific service logs
docker-compose logs user-service

# Restart services
docker-compose restart
```

## Production

For production, update environment variables in `docker-compose.yml` and use proper secrets management. 