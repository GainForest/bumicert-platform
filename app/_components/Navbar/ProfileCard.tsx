"use client";

import { Button } from "@/components/ui/button";
import { UserX2, Loader2, User2 } from "lucide-react";

import EthAvatar from "@/components/eth-avatar";
import { useCreateWallet, usePrivy } from "@privy-io/react-auth";
import { useStackedDialog } from "@/components/ui/StackedDialog/context";
import { useEffect } from "react";

export default function ProfileCard() {
  const { ready, authenticated, user } = usePrivy();
  const { openDialog } = useStackedDialog();
  const { createWallet } = useCreateWallet();

  useEffect(() => {
    if (user && user?.wallet === undefined) {
      createWallet();
    }
  }, [user]);

  if (!ready) {
    return (
      <div className="border border-border w-full rounded-xl p-2 bg-background flex items-center justify-center text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" /> Loading...
      </div>
    );
  }

  return (
    <div className="border border-border w-full rounded-xl p-2 bg-background">
      {authenticated && user ? (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            {user.wallet ? (
              <EthAvatar
                address={user.wallet.address as `0x${string}`}
                className="h-8 w-8"
              />
            ) : (
              <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                <User2 className="size-4" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold truncate">
                {user.email
                  ? user.email.address.slice(0, 10).concat("...")
                  : "Signed in"}
              </span>
              {user.wallet && (
                <span className="text-xs text-muted-foreground">
                  {user.wallet.address.slice(0, 6)}...
                  {user.wallet.address.slice(-4)}
                </span>
              )}
            </div>
          </div>
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => openDialog("account")}
            size={"sm"}
          >
            Manage
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="h-16 w-16 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
            <UserX2 size={24} />
          </div>
          <p className="text-sm text-muted-foreground text-center flex items-center justify-center text-balance">
            Sign in to interact with ecocerts.
          </p>

          <Button
            className="w-full"
            size={"sm"}
            onClick={() => openDialog("onboarding")}
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
}
