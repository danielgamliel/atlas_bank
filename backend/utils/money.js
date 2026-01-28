import { Decimal128 } from "mongodb";

export function toDec(amount) {
  if (typeof amount === "string") return Decimal128.fromString(amount.trim());
  if (typeof amount === "number") return Decimal128.fromString(amount.toFixed(2));
  throw new Error("amount must be number or string");
}
