import { NextResponse } from "next/server";
import { privy } from "..";
import { tryCatch } from "@/lib/tryCatch";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const [user, error] = await tryCatch(
    privy.importUser({
      linkedAccounts: [
        {
          type: "email",
          address: email,
        },
      ],
      createEthereumWallet: true,
      createEthereumSmartWallet: false,
      createSolanaWallet: false,
    })
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(user);
}
