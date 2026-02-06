import { createHash, randomInt, timingSafeEqual } from "crypto";

const parsedExpiry = Number.parseInt(
  process.env.OTP_EXPIRY_MINUTES ?? "10",
  10
);
export const OTP_EXPIRY_MINUTES =
  Number.isFinite(parsedExpiry) && parsedExpiry > 0 ? parsedExpiry : 10;

const parsedAttempts = Number.parseInt(
  process.env.OTP_MAX_ATTEMPTS ?? "5",
  10
);
export const OTP_MAX_ATTEMPTS =
  Number.isFinite(parsedAttempts) && parsedAttempts > 0 ? parsedAttempts : 5;

/**
 * Generate a cryptographically secure 6-digit OTP
 * Covers the full 000000–999999 range.
 */
export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
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

  return timingSafeEqual(
    Buffer.from(codeHash, "hex"),
    Buffer.from(hash, "hex")
  );
}

/**
 * Calculate OTP expiration timestamp
 */
export function getOtpExpiration(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}
