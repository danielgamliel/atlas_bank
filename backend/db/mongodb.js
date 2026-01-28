import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDB(uri) {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();

  db = client.db(); 
  return db;
}

export function getDB() {
  if (!db) throw new Error("DB is not connected. ");
  return db;
}

export function getClient() {
  if (!client) throw new Error("MongoClient is not connected.");
  return client;
}
