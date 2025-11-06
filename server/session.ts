import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { JwtPayload } from "@atproto/oauth-client-node";

export interface StoredSession extends JwtPayload {
  accessJwt: string;
  refreshJwt: string;
  did: string;
  handle: string;
}

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "your-secret-key-min-32-chars-long"
);

async function encrypt(payload: StoredSession): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);
}

async function decrypt(token: string): Promise<StoredSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as StoredSession;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(
  service = "climateai.org"
): Promise<StoredSession | null> {
  const cookieStore = await cookies();
  const encryptedSession = cookieStore.get(`${service}_session`);

  if (!encryptedSession) {
    return null;
  }

  return await decrypt(encryptedSession.value);
}

export async function saveSession(
  session: StoredSession,
  service = "climateai.org"
) {
  const cookieStore = await cookies();
  const encrypted = await encrypt(session);

  cookieStore.set(`${service}_session`, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return encrypted;
}

export async function clearSession(service = "climateai.org") {
  const cookieStore = await cookies();
  cookieStore.delete(`${service}_session`);
}
