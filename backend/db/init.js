// db/init.js
import { getDB } from "./mongodb.js";
import { USERS_COLLECTION } from "../models/user.model.js"; 
import { hashPassword } from "../utils/password.js";

export async function initDB() {
  const db = getDB();

 
  await db.collection(USERS_COLLECTION).createIndex(
    { email: 1 },
    { unique: true }
  );


  if (process.env.SEED_DB === "true") {
    await seedUsers(db);
    console.log("DB seed completed");
  }
}

async function seedUsers(db) {
  const users = [
    {
      email: "user1@test.com",
      password: "12345678",
      phone: "0523881275"
    },
    {
      email: "user2@test.com",
      password: "12345678",
      phone: "0523901275"
    },
    {
      email: "user3@test.com",
      password: "12345678",
      phone: "0523572751"
    }
  ];

  for (const u of users) {
    const exists = await db
      .collection(USERS_COLLECTION)
      .findOne({ email: u.email });

    if (exists) continue;

    const now = new Date();

    await db.collection(USERS_COLLECTION).insertOne({
      email: u.email,
      passwordHash: await hashPassword(u.password),
      isVerified: "ACTIVE",
      firstName: null,
      lastName: null,
      phone: u.phone, 
      verificationTokenHash: null,
      verificationExpiresAt: null,
      createdAt: now,
      updatedAt: now
    });
  }
}
