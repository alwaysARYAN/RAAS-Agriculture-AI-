const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS for MongoDB Atlas resolution
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      family: 4 // Use IPv4
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('⚠️  Server will continue but database features may not work');
    console.error('💡 Check: 1) MongoDB URI is correct 2) IP is whitelisted 3) Network access');
    // DON'T crash the server - let it run without DB for health checks
    // process.exit(1); // Removed to prevent server crash
  }
};

module.exports = connectDatabase;
