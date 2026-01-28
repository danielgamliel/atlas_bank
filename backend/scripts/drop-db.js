import { MongoClient } from "mongodb";
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url) });


import { USERS_COLLECTION } from "../models/user.model.js";
import { TRANSACTIONS_COLLECTION } from "../models/transaction.model.js";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

async function dropIfExists(db, name) {
  const collections = await db.listCollections({ name }).toArray();
  if (collections.length > 0) {
    await db.collection(name).drop();
    console.log(`Dropped collection: ${name}`);
  } else {
    console.log(`Collection not found (skipped): ${name}`);
  }
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);

  await dropIfExists(db, TRANSACTIONS_COLLECTION);
  await dropIfExists(db, USERS_COLLECTION);

  console.log("DB drop done 🧨");
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
