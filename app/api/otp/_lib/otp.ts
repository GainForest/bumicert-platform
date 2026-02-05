import { createHash, randomInt } from "crypto";

export const OTP_EXPIRY_MINUTES = parseInt(
  process.env.OTP_EXPIRY_MINUTES || "10",
  10
);
export const OTP_MAX_ATTEMPTS = parseInt(
  process.env.OTP_MAX_ATTEMPTS || "5",
  10
);

/**
 * Generate a cryptographically secure 6-digit OTP
 */
export function generateOtp(): string {
  return randomInt(100000, 999999).toString();
}

/**
 * Hash OTP code using SHA-256 for secure storage
 */
export function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

/**
 * Constant-time comparison to prevent timing attacks
 */
export function verifyOtpHash(code: string, hash: string): boolean {
  const codeHash = hashOtp(code);
  if (codeHash.length !== hash.length) return false;

  let result = 0;
  for (let i = 0; i < codeHash.length; i++) {
    result |= codeHash.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Calculate OTP expiration timestamp
 */
export function getOtpExpiration(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}
