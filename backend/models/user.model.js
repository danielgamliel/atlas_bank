// users.schema.js
export const USERS_COLLECTION = "users";

export function userJsonSchema() {
  return {
    bsonType: "object",
    required: [
      "email",
      "passwordHash",
      "isVerified",
      "balance",
      "createdAt",
      "updatedAt",
    ],
    additionalProperties: false,
    properties: {
      _id: {},

      email: { bsonType: "string", minLength: 5 },
      passwordHash: { bsonType: "string", minLength: 20 },

      phone: { bsonType: ["string", "null"], minLength: 6 },
      firstName: { bsonType: ["string", "null"], minLength: 2, maxLength: 50 },
      lastName: { bsonType: ["string", "null"], minLength: 2, maxLength: 50 },

      isVerified: { bsonType: "string", enum: ["PENDING", "ACTIVE", "BLOCKED"] },

      balance: { bsonType: "double", minimum: 0 },

      verificationTokenHash: { bsonType: ["string", "null"] },
      verificationExpiresAt: { bsonType: ["date", "null"] },

      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" },
    },
  };
}
