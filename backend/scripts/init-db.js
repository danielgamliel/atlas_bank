
import { MongoClient } from "mongodb";
import "dotenv/config";

import { USERS_COLLECTION, userJsonSchema } from "../models/user.model.js";
import { TRANSACTIONS_COLLECTION, transactionJsonSchema } from "../models/transaction.model.js";


const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

async function ensureCollection(db, name, schemaFn) {
  const collections = await db.listCollections({ name }).toArray();
  if (collections.length === 0) {
    await db.createCollection(name, {
      validator: { $jsonSchema: schemaFn() },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log(`Created collection: ${name}`);
  } else {
    await db.command({
      collMod: name,
      validator: { $jsonSchema: schemaFn() },
      validationLevel: "strict",
      validationAction: "error",
    });
    console.log(`Updated validator: ${name}`);
  }
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);

  await ensureCollection(db, USERS_COLLECTION, userJsonSchema);
  await ensureCollection(db, TRANSACTIONS_COLLECTION, transactionJsonSchema);

  // Indexes (critical)
  await db.collection(USERS_COLLECTION).createIndex({ email: 1 }, { unique: true });
  await db.collection(TRANSACTIONS_COLLECTION).createIndex({ accountId: 1, timestamp: -1 });

  console.log("DB init done ✅");
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
