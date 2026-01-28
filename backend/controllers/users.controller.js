import { ObjectId } from "mongodb";
import { getDB } from "../db/mongodb.js";
import { USERS_COLLECTION } from "../models/user.model.js";

export async function getMe(req, res) {
  try {
    const userIdStr = req.user && (req.user.id || req.user.sub);
    if (!userIdStr) return res.status(401).json({ success: false, error: "Unauthorized" });
    
    const db = getDB();
    const userId = new ObjectId(userIdStr);

    const user = await db.collection(USERS_COLLECTION).findOne(
      { _id: userId },
      {
        projection: {
          passwordHash: 0,
          verificationTokenHash: 0,
          verificationExpiresAt: 0,
        },
      }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        phone: user.phone || null,
        balance: user.balance || 0,
        isVerified: !!user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

