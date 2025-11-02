import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const mongoURI = process.env.MONGO_URI; 

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection successful: Mongoose is ready.');
  } catch (error) {
    console.error(` MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('⚠️ Mongoose connection error (after initial success):', error);
});

db.on('connected', () => {
    console.log('🔗 Mongoose successfully reconnected to MongoDB.');
});

db.on('disconnected', () => {
    console.warn('🔌 Mongoose disconnected. Attempting to reconnect...');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('👋 Mongoose connection closed due to app termination (SIGINT).');
    process.exit(0);
});

export { connectDB };