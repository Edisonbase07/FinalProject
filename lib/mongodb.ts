import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local file");
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

let cached: NonNullable<typeof global.mongoose> = global.mongoose!;

async function connectDB() {
  if (cached.conn) {
    console.log("✅ MongoDB already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "cluster0", 
      bufferCommands: false,
    });
  }

  try {
    await cached.promise;
    cached.conn = mongoose.connection;
    console.log("✅ MongoDB connected successfully!");
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'Unknown'}`);
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

export default connectDB;
