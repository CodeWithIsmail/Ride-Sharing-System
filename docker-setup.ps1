Write-Host "Setting up Ride Sharing System with Docker..." -ForegroundColor Green

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed. Please install Docker Desktop for Windows first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Write-Host "Docker Compose is installed" -ForegroundColor Green
} catch {
    Write-Host "Docker Compose is not installed. Please install Docker Desktop for Windows first." -ForegroundColor Red
    exit 1
}

# Create necessary directories
Write-Host "Creating necessary directories..." -ForegroundColor Yellow
if (!(Test-Path "docker")) {
    New-Item -ItemType Directory -Path "docker" | Out-Null
}

# Build and start all services
Write-Host "Building and starting all services..." -ForegroundColor Yellow
docker-compose up --build -d

# Wait for services to be ready
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check if all services are running
Write-Host "Checking service status..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Services are running on:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   User Service: http://localhost:3001" -ForegroundColor White
Write-Host "   Ride Service: http://localhost:3002" -ForegroundColor White
Write-Host "   Payment Service: http://localhost:3003" -ForegroundColor White
Write-Host "   Admin Service: http://localhost:3004" -ForegroundColor White
Write-Host "   MongoDB: localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "Test Admin Account:" -ForegroundColor Cyan
Write-Host "   Email: admin@ridesystem.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop services: docker-compose down" -ForegroundColor White
Write-Host "   Restart services: docker-compose restart" -ForegroundColor White
Write-Host "   Remove everything: docker-compose down -v" -ForegroundColor White