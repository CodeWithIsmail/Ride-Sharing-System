# Ride Sharing System - Docker Build and Run Script
# This script builds and runs all microservices using Docker Compose

Write-Host "🚀 Starting Ride Sharing System Build and Run Process..." -ForegroundColor Green

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Remove any existing images to ensure fresh build
Write-Host "🧹 Cleaning up existing images..." -ForegroundColor Yellow
docker-compose down --rmi all

# Build all services
Write-Host "🔨 Building all services..." -ForegroundColor Yellow
docker-compose build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please check the error messages above." -ForegroundColor Red
    exit 1
}

# Start all services
Write-Host "🚀 Starting all services..." -ForegroundColor Green
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start services! Please check the error messages above." -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service status
Write-Host "📊 Checking service status..." -ForegroundColor Cyan
docker-compose ps

Write-Host "`n✅ Ride Sharing System is now running!" -ForegroundColor Green
Write-Host "`n📋 Access Information:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   User Service: http://localhost:3001" -ForegroundColor White
Write-Host "   Ride Service: http://localhost:3002" -ForegroundColor White
Write-Host "   Payment Service: http://localhost:3003" -ForegroundColor White
Write-Host "   Admin Service: http://localhost:3004" -ForegroundColor White
Write-Host "   MongoDB: localhost:27017" -ForegroundColor White

Write-Host "`n🔑 Test Accounts:" -ForegroundColor Cyan
Write-Host "   Admin: admin@example.com / admin123" -ForegroundColor White
Write-Host "   Passenger: passenger@example.com / passenger123" -ForegroundColor White
Write-Host "   Driver: driver@example.com / driver123" -ForegroundColor White

Write-Host "`n📝 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop services: docker-compose down" -ForegroundColor White
Write-Host "   Restart services: docker-compose restart" -ForegroundColor White

Write-Host "`n🎉 Setup complete! Open http://localhost:3000 in your browser." -ForegroundColor Green 