import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedLeads } from '../services/leadService.js';

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB() {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.log('📦 No MONGODB_URI provided. Initializing in-memory MongoDB Server fallback for local testing...');
      mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
      console.log(`InMemory MongoDB Server running at ${mongoUri}`);
    } else {
      console.log('🌐 MONGODB_URI detected. Connecting to persistent MongoDB database...');
    }

    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected successfully to host: ${mongoose.connection.host} (Database: ${mongoose.connection.name})`);

    // Seed database automatically if empty
    await seedLeads();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
