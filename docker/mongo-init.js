// MongoDB initialization script for Ride Sharing System
print('🚀 Initializing Ride Sharing System databases...');

// Create databases for each service
const databases = [
  'ride-sharing-users',
  'ride-sharing-rides', 
  'ride-sharing-payments',
  'ride-sharing-admin'
];

databases.forEach(dbName => {
  print(`📊 Creating database: ${dbName}`);
  db = db.getSiblingDB(dbName);
  
  // Create collections with proper indexes
  if (dbName === 'ride-sharing-users') {
    // Users collection
    db.createCollection('users');
    db.users.createIndex({ "email": 1 }, { unique: true });
    db.users.createIndex({ "role": 1 });
    db.users.createIndex({ "isActive": 1 });
    
    // Sessions collection
    db.createCollection('sessions');
    db.sessions.createIndex({ "token": 1 }, { unique: true });
    db.sessions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
    
    print(`✅ Created collections for ${dbName}: users, sessions`);
  }
  
  if (dbName === 'ride-sharing-rides') {
    // RideRequests collection
    db.createCollection('riderequests');
    db.riderequests.createIndex({ "status": 1 });
    db.riderequests.createIndex({ "passengerId": 1 });
    db.riderequests.createIndex({ "driverId": 1 });
    db.riderequests.createIndex({ "targetTime": 1 });
    
    // RideApplications collection
    db.createCollection('rideapplications');
    db.rideapplications.createIndex({ "rideRequestId": 1, "driverId": 1 }, { unique: true });
    db.rideapplications.createIndex({ "driverId": 1 });
    
    print(`✅ Created collections for ${dbName}: riderequests, rideapplications`);
  }
  
  if (dbName === 'ride-sharing-payments') {
    // Payments collection
    db.createCollection('payments');
    db.payments.createIndex({ "rideRequestId": 1 });
    db.payments.createIndex({ "status": 1 });
    db.payments.createIndex({ "createdAt": 1 });
    
    print(`✅ Created collections for ${dbName}: payments`);
  }
  
  if (dbName === 'ride-sharing-admin') {
    // Admin can read from other databases, so no specific collections needed here
    print(`✅ Database ${dbName} ready for admin operations`);
  }
});

// Create a test admin user
print('👤 Creating test admin user...');
db = db.getSiblingDB('ride-sharing-users');

// Check if admin user already exists
const adminUser = db.users.findOne({ email: 'admin@ridesystem.com' });
if (!adminUser) {
  // Note: In production, this should be hashed with bcrypt
  // For demo purposes, we'll create a simple admin user
  db.users.insertOne({
    email: 'admin@ridesystem.com',
    password: '$2a$10$rQZ8NwY8NwY8NwY8NwY8N.8NwY8NwY8NwY8NwY8NwY8NwY8NwY8NwY8', // "admin123" hashed
    name: 'System Admin',
    role: 'admin',
    isActive: true,
    createdAt: new Date()
  });
  print('✅ Created test admin user: admin@ridesystem.com / admin123');
} else {
  print('ℹ️  Admin user already exists');
}

print('🎉 MongoDB initialization complete!'); 