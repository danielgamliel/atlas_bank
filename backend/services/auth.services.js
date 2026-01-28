//auth.services.js
import { signAccessToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/password.js";
import { findUserByEmail, findUserByVerificationToken, markUserVerified } from "./users.service.js";

export async function loginWithEmailPassword(email, password) {
  const user = await findUserByEmail(email);
  if (!user) throw Object.assign(new Error("Invalid credentials"), { status: 401 });

  const ok = await comparePassword(password, user.passwordHash);

  if (!ok) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  if (user.isVerified === "PENDING") {
    throw Object.assign(new Error("Email not verified"), { status: 403 });
  }
  if (user.isVerified === "BLOCKED") {
    throw Object.assign(new Error("Account blocked"), { status: 403 });
  }
  
  
  const jwt = signAccessToken({sub: String(user._id), email: user.email});

  return {token: jwt, user: {id: user._id, email: user.email, firstName: user.firstName || null, lastName: user.lastName || null}};
}

export async function verifyEmailByToken(token) {
  const user = await findUserByVerificationToken(token);

  if (!user) {
    const err = new Error("Invalid verification token");
    err.status = 400;
    throw err;
  }

  const exp = user.verificationExpiresAt ? new Date(user.verificationExpiresAt) : null;
  if (!exp || exp.getTime() < Date.now()) {
    const err = new Error("Verification token expired");
    err.status = 400;
    throw err;
  }
  await markUserVerified(user._id);

  return {id: user._id, email: user.email};
}

export async function logout(req, res) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ success: true });
}

