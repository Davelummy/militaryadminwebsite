import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;

const getKey = () => {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is missing.");
  }
  // WARNING: Prototype only. Replace with KMS/HSM-managed keys in production.
  return crypto.scryptSync(ENCRYPTION_KEY, "identity-portal-salt", KEY_LENGTH);
};

export const encryptSensitive = (value: string) => {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
};

export const decryptSensitive = (payload: string) => {
  const key = getKey();
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, IV_LENGTH);
  const tag = raw.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = raw.subarray(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
};
