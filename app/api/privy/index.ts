import { PrivyClient } from "@privy-io/server-auth";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;
const privySecret = process.env.PRIVY_APP_SECRET;

if (!appId || !clientId || !privySecret) {
  throw new Error("Privy app ID, client ID, or secret are not set");
}

export const privy = new PrivyClient(appId, privySecret);
