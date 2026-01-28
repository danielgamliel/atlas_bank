// transactions.controller.js
import { transferAtomic } from "../services/transactions.service.js";

export async function getTransactions(req, res) {
  const offset = Number(req.query?.offset ?? 0);
  const limit = Number(req.query?.limit ?? 100);

  if (Number.isNaN(offset) || Number.isNaN(limit) || offset < 0 || limit < 1) {
    return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Invalid offset/limit" } });
  }

  const db = getDB();
  const userId = new ObjectId(req.user.id);

  const filter = { userId };
  const col = db.collection(TRANSACTIONS_COLLECTION);

  const total = await col.countDocuments(filter);
  const transactions = await col.find(filter).sort({ timestamp: -1 }).skip(offset).limit(limit).toArray();

  return res.status(200).json({ success: true, data: { transactions, total, offset, limit } });
}


import { ObjectId } from "mongodb";
import { getDB } from "../db/mongodb.js";
import { TRANSACTIONS_COLLECTION } from "../models/transaction.model.js";

export async function getTransactionById(req, res) {
  const { transactionId } = req.params || {};
  if (!transactionId) return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Missing transactionId" } });
  
  const db = getDB();
  const userId = new ObjectId(req.user.id);
  const tx = await db.collection(TRANSACTIONS_COLLECTION).findOne({_id: new ObjectId(transactionId), userId});
  if (!tx) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Transaction not found" } });
  
  return res.status(200).json({ success: true, data: tx });
}


export async function transferMoney(req, res) {
  const { recipientEmail, amount, description } = req.body || {};

  if (!recipientEmail || (typeof amount !== "number" && typeof amount !== "string")) {
    return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Missing recipientEmail or amount" } });}

  if (Number(amount) <= 0) {
    return res.status(422).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Amount must be > 0" } });}

  try {
    const { status, ids } = await transferAtomic(req.user.id, recipientEmail, amount, description);
    return res.status(201).json({ success: true,status, data: { ...ids, recipientEmail, amount, timestamp: new Date().toISOString() }  });
  } catch (err) {
    return res.status(err.status || 400).json({ success: false, error: { code: "TRANSFER_FAILED", message: err.message } });
  }
}
