// src/services/memoryService.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'takoyaki';

const client = new MongoClient(mongoUri);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log("[MemoryService] Connected to MongoDB");
  }
  return db;
}

/**
 * saveMemory:
 *  - Saves a memory record (object) to the "memories" collection.
 */
export async function saveMemory(memory) {
  const db = await connectDB();
  const collection = db.collection('memories');
  const result = await collection.insertOne(memory);
  return result.insertedId;
}

/**
 * getMemories:
 *  - Retrieves memory records matching a query.
 *  - The query can filter by fields like userId, sessionId, tags, etc.
 */
export async function getMemories(query = {}) {
  const db = await connectDB();
  const collection = db.collection('memories');
  return await collection.find(query).toArray();
}
