// transactions.service.js
import { ObjectId } from "mongodb";
import { getClient } from "../db/mongodb.js";
import { TRANSACTIONS_COLLECTION } from "../models/transaction.model.js";
import { USERS_COLLECTION } from "../models/user.model.js";

function unwrapDoc(res) {
  if (!res) return null;
  if (typeof res === "object" && "value" in res) return res.value;
  return res;
}

export async function transferAtomic(senderUserIdStr, recipientEmail, amount, description) {
  const client = getClient();
  const db = client.db();
  const session = client.startSession();

  try {
    const senderUserId = new ObjectId(senderUserIdStr);
    const email = String(recipientEmail).trim().toLowerCase();
    const amt = Number(amount);
    const now = new Date();

    if (!Number.isFinite(amt) || amt <= 0) {
      throw Object.assign(new Error("Amount must be a positive number"), { status: 422 });
    }

    console.log("[transferAtomic] sender:", senderUserIdStr, "recipient:", email, "amount:", amt);

    let result = { status: "PENDING", ids: null };

    await session.withTransaction(async () => {
      // 1) sender exists + has enough balance (atomic debit with condition)
      const debitRes = await db.collection(USERS_COLLECTION).findOneAndUpdate(
        { _id: senderUserId, balance: { $gte: amt } },
        { $inc: { balance: -amt }, $set: { updatedAt: now } },
        { session, returnDocument: "after", includeResultMetadata: false }
      );

      const senderAfter = unwrapDoc(debitRes);
      console.log("[transferAtomic] senderAfter:", senderAfter ? senderAfter.balance : null);

      if (!senderAfter) {
        // could be: sender not found OR insufficient funds
        const senderExists = await db.collection(USERS_COLLECTION).findOne({ _id: senderUserId }, { session });
        if (!senderExists) throw Object.assign(new Error("Sender not found"), { status: 404 });
        throw Object.assign(new Error("Insufficient funds"), { status: 409 });
      }

      // 2) recipient user
      const recipientUser = await db.collection(USERS_COLLECTION).findOne({ email }, { session });
      if (!recipientUser) throw Object.assign(new Error("Recipient not found"), { status: 404 });

      // 3) credit recipient
      const creditRes = await db.collection(USERS_COLLECTION).findOneAndUpdate(
        { _id: recipientUser._id },
        { $inc: { balance: amt }, $set: { updatedAt: now } },
        { session, returnDocument: "after", includeResultMetadata: false }
      );

      const recipientAfter = unwrapDoc(creditRes);
      console.log("[transferAtomic] recipientAfter:", recipientAfter ? recipientAfter.balance : null);

      if (!recipientAfter) throw Object.assign(new Error("Credit failed"), { status: 500 });

      // 4) transactions log (2 rows like before)
      const base = {
        type: "TRANSFER",
        amount: amt,
        description: description ? String(description).slice(0, 200) : null,
        timestamp: now,
        status: "COMPLETED",
      };

      const ins = await db.collection(TRANSACTIONS_COLLECTION).insertMany(
        [
          {
            ...base,
            userId: senderUserId,
            direction: "out",
            counterpartyEmail: email,
            balanceAfter: senderAfter.balance,
          },
          {
            ...base,
            userId: recipientUser._id,
            direction: "in",
            counterpartyEmail: senderAfter.email || null,
            balanceAfter: recipientAfter.balance,
          },
        ],
        { session }
      );

      result = {
        status: "COMPLETED",
        ids: {
          senderTxId: String(ins.insertedIds["0"]),
          recipientTxId: String(ins.insertedIds["1"]),
        },
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
}
