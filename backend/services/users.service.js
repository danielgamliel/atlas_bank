// users.service.js
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { USERS_COLLECTION } from "../models/user.model.js";
import { getDB, getClient } from "../db/mongodb.js";

function hashVerificationToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createUser({
  email,
  passwordHash,
  firstName,
  lastName,
  phone,
  verificationToken,
  verificationExpiresAt,
}) {
  const db = getDB();
  const client = getClient();
  const session = client.startSession();

  try {
    const now = new Date();
    let created = null;

    await session.withTransaction(async () => {
      const userDoc = {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,

        balance: 800.0, 

        isVerified: "PENDING",
        verificationTokenHash: hashVerificationToken(verificationToken),
        verificationExpiresAt,

        createdAt: now,
        updatedAt: now,
      };

      const u = await db.collection(USERS_COLLECTION).insertOne(userDoc, { session });
      created = { ...userDoc, _id: u.insertedId };
    });

    return created;
  } finally {
    await session.endSession();
  }
}

export async function findUserByEmail(email) {
  const db = getDB();
  return db.collection(USERS_COLLECTION).findOne({ email });
}

export async function findUserByVerificationToken(token) {
  const db = getDB();
  const tokenHash = hashVerificationToken(token);
  return db.collection(USERS_COLLECTION).findOne({ verificationTokenHash: tokenHash });
}

export async function markUserVerified(userId) {
  const db = getDB();
  return db.collection(USERS_COLLECTION).updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        isVerified: "ACTIVE",
        verificationTokenHash: null,
        verificationExpiresAt: null,
        updatedAt: new Date(),
      },
    }
  );
}
