import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { seedLeads } from '../services/leadService.js';

// Ensure backend/.env is accessible whether executed from workspace root or backend directory
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(process.cwd(), '../.env')
];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
  }
}
dotenv.config();

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

    // Seed database automatically only if empty
    const seedResult = await seedLeads();
    if (seedResult.count && seedResult.message === 'Database already populated') {
      console.log(`📊 Persistent Database status: ${seedResult.count} leads present (Seed skipped to avoid duplicates).`);
    } else {
      console.log(`🌱 Initial seed completed: ${seedResult.count} leads inserted.`);
    }
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message || error);
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== '') {
      console.error('\n⚠️  Troubleshooting MongoDB Atlas Connection:');
      console.error(' 1. Verify your database username and password in backend/.env (ensure special characters in password are URL-encoded).');
      console.error(' 2. Verify your IP address is whitelisted in MongoDB Atlas under Network Access (e.g., allow 0.0.0.0/0 for development).');
      console.error(' 3. Ensure your connection string includes a database name (e.g., mongodb+srv://.../leadiq).');
      console.error(' 4. If credentials fail or are misconfigured, remove or comment out MONGODB_URI in backend/.env to use the local in-memory fallback.\n');
    }
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
