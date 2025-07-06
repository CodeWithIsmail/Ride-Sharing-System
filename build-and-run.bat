@echo off
echo 🚀 Starting Ride Sharing System Build and Run Process...

echo 🛑 Stopping existing containers...
docker-compose down

echo 🧹 Cleaning up existing images...
docker-compose down --rmi all

echo 🔨 Building all services...
docker-compose build --no-cache

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed! Please check the error messages above.
    pause
    exit /b 1
)

echo 🚀 Starting all services...
docker-compose up -d

if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to start services! Please check the error messages above.
    pause
    exit /b 1
)

echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak > nul

echo 📊 Checking service status...
docker-compose ps

echo.
echo ✅ Ride Sharing System is now running!
echo.
echo 📋 Access Information:
echo    Frontend: http://localhost:3000
echo    User Service: http://localhost:3001
echo    Ride Service: http://localhost:3002
echo    Payment Service: http://localhost:3003
echo    Admin Service: http://localhost:3004
echo    MongoDB: localhost:27017

echo.
echo 🔑 Test Accounts:
echo    Admin: admin@example.com / admin123
echo    Passenger: passenger@example.com / passenger123
echo    Driver: driver@example.com / driver123

echo.
echo 📝 Useful Commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart

echo.
echo 🎉 Setup complete! Open http://localhost:3000 in your browser.
pause 