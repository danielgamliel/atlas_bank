
import crypto from "crypto";

export function createVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex"); // 64 chars
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 min

  return { token, expiresAt };
}
