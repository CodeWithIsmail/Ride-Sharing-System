const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Ride Sharing System...\n');

// Create .env files for each service
const services = [
  {
    name: 'User Service',
    path: 'backend/user-service/.env',
    content: `PORT=3001
MONGODB_URI=mongodb://localhost:27017/ride-sharing-users
JWT_SECRET=your-secret-key-change-this-in-production`
  },
  {
    name: 'Ride Service',
    path: 'backend/ride-service/.env',
    content: `PORT=3002
MONGODB_URI=mongodb://localhost:27017/ride-sharing-rides
USER_SERVICE_URL=http://localhost:3001`
  },
  {
    name: 'Payment Service',
    path: 'backend/payment-service/.env',
    content: `PORT=3003
MONGODB_URI=mongodb://localhost:27017/ride-sharing-payments
RIDE_SERVICE_URL=http://localhost:3002
USER_SERVICE_URL=http://localhost:3001`
  },
  {
    name: 'Admin Service',
    path: 'backend/admin-service/.env',
    content: `PORT=3004
MONGODB_URI=mongodb://localhost:27017/ride-sharing-admin
USER_SERVICE_URL=http://localhost:3001
RIDE_SERVICE_URL=http://localhost:3002`
  }
];

// Create .env files
services.forEach(service => {
  try {
    fs.writeFileSync(service.path, service.content);
    console.log(`✅ Created ${service.name} .env file`);
  } catch (error) {
    console.log(`⚠️  Could not create ${service.name} .env file: ${error.message}`);
  }
});

console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Run: npm run install-all');
console.log('3. Run: npm run dev');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n�� Setup complete!'); 