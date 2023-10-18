import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri);

  const db = await client.db(process.env.DB_NAME);

  cachedDb = db;
  return db;
}

export async function insertSeedData(data) {
  const db = await connectToDatabase();

  const result = await db
    .collection(process.env.COLLECTION_NAME)
    .insertMany(data);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };

  return response;
}
