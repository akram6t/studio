
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If we already have a connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a promise, create a new connection promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME || 'logical-book',
      maxPoolSize: 10, // Optimize for serverless
      serverSelectionTimeoutMS: 10000, // Wait up to 10s for initial connection
      socketTimeoutMS: 45000,
    };

    console.log('🔄 Initializing MongoDB Atlas connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB connection established');
      return mongooseInstance;
    }).catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      cached.promise = null; // Reset cache so we can try again on next request
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default connectDB;
