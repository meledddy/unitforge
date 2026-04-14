import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const PASSWORD_HASH_PREFIX = "scrypt";
const PASSWORD_KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH);

  return `${PASSWORD_HASH_PREFIX}$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, storedPasswordHash: string) {
  const [prefix, saltHex, derivedKeyHex] = storedPasswordHash.split("$");

  if (prefix !== PASSWORD_HASH_PREFIX || !saltHex || !derivedKeyHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const derivedKey = Buffer.from(derivedKeyHex, "hex");
  const attemptedKey = scryptSync(password, salt, derivedKey.length);

  return attemptedKey.length === derivedKey.length && timingSafeEqual(attemptedKey, derivedKey);
}
