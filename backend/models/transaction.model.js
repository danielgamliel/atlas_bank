// transactions.model.js
export const TRANSACTIONS_COLLECTION = "transactions";

export function transactionJsonSchema() {
  return {
    bsonType: "object",
    required: [
      "userId",
      "type",
      "amount",
      "timestamp",
      "status",
      "balanceAfter",
    ],
    additionalProperties: false,
    properties: {
      _id: {},

      userId: { bsonType: "objectId" },

      counterpartyUserId: { bsonType: ["objectId", "null"] }, // במקום from/to accounts
      type: { enum: ["CREDIT", "DEBIT", "TRANSFER"] },

      amount: { bsonType: "double", minimum: 0.01 },
      description: { bsonType: ["string", "null"], maxLength: 200 },

      timestamp: { bsonType: "date" },
      balanceAfter: { bsonType: "double" },

      status: { enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"] },
      reference: { bsonType: ["string", "null"] },
      fee: { bsonType: ["double", "null"], minimum: 0 },
      metadata: { bsonType: ["object", "null"] },
    },
  };
}
