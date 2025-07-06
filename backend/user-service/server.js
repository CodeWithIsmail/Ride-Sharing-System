const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ride-sharing-users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB - User Service');
});

// Routes
console.log('Loading auth routes...');
const authRoutes = require('./routes/auth');
console.log('Auth routes loaded successfully');
app.use('/api/auth', authRoutes);

console.log('Loading user routes...');
const userRoutes = require('./routes/users');
console.log('User routes loaded successfully');
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'User Service' });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
}); 