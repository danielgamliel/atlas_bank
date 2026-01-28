import bcrypt from "bcrypt";

const COST = 12;

export async function hashPassword(password) {
  return bcrypt.hash(password, COST);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
