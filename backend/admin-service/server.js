const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ride-sharing-admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB - Admin Service');
});

// Routes
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Admin Service' });
});

app.listen(PORT, () => {
  console.log(`Admin Service running on port ${PORT}`);
}); 