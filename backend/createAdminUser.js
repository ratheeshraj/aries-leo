const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/userModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authentic-weavers';
console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected for admin user creation'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@authenticweavers.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@1234', salt);
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@authenticweavers.com',
      password: hashedPassword,
      isAdmin: true,
    });
    
    // Save admin user
    await adminUser.save();
    
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdminUser();
