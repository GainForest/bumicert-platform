"use server";

import { hypercertsSdk } from "../hypercerts/sdk.server";

export async function getLoginUrl(handle: string) {
  const pdsUrl = process.env.NEXT_PUBLIC_PDS_URL || "https://climateai.org";
  const hostname = new URL(pdsUrl).hostname;

  let finalHandle = handle.trim();
  if (!finalHandle.includes(".")) {
    finalHandle = `${finalHandle}.${hostname}`;
  }

  const redirectUrl = await hypercertsSdk.authorize(finalHandle);
  return redirectUrl;
}
