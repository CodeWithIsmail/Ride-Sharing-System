#!/bin/bash

echo "🚀 Setting up Ride Sharing System with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p docker

# Build and start all services
echo "🔨 Building and starting all services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if all services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Services are running on:"
echo "   Frontend: http://localhost:3000"
echo "   User Service: http://localhost:3001"
echo "   Ride Service: http://localhost:3002"
echo "   Payment Service: http://localhost:3003"
echo "   Admin Service: http://localhost:3004"
echo "   MongoDB: localhost:27017"
echo ""
echo "👤 Test Admin Account:"
echo "   Email: admin@ridesystem.com"
echo "   Password: admin123"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Remove everything: docker-compose down -v" 