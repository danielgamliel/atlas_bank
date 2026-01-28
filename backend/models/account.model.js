// accounts.schema.js
export const ACCOUNTS_COLLECTION = "accounts";

export function accountJsonSchema() {
  return {
    bsonType: "object",
    required: [
      "userId",
      "accountNumber",
      "balance",
      "currency",
      "status",
      "createdAt",
      "updatedAt",
    ],
    additionalProperties: false,
    properties: {
      _id: {},

      userId: { bsonType: "objectId" },

      accountNumber: { bsonType: "string", minLength: 6 },

      balance: { bsonType: "double", minimum: 0 },

      currency: { enum: ["ILS", "USD", "EUR"] },
      status: { enum: ["ACTIVE", "FROZEN", "CLOSED"] },

      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" },
    },
  };
}

// Recommended indexes (create separately):
// db.accounts.createIndex({ accountNumber: 1 }, { unique: true })
// db.accounts.createIndex({ userId: 1 })
// db.accounts.createIndex({ userId: 1, status: 1 })
