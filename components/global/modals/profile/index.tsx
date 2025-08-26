"use client";
import EthAvatar from "@/components/eth-avatar";
import useAccount from "@/hooks/use-account";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/modal/modal";
import React, { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import { usePrivy } from "@privy-io/react-auth";
import {
  LogOutIcon,
  ArrowLeftRight,
  Copy,
  ExternalLink,
  Wallet,
  Check,
  Loader2,
} from "lucide-react";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import {
  ChainSwitchModal,
  ChainSwitchModalId,
} from "@/components/providers/ChainSwitchProvider";
import { useBalance } from "wagmi";
import Link from "next/link";
import useCopy from "@/hooks/use-copy";

export const ProfileModalId = "profile-modal";

const ProfileModal = () => {
  const { hide, clear, pushModal, show } = useModal();
  const { authenticated, address, chainId } = useAccount();
  const { logout, ready } = usePrivy();
  const { isCopied, copy } = useCopy();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: balance } = useBalance({
    address,
    chainId,
  });

  useEffect(() => {
    if (!authenticated || !address) {
      hide().then(() => clear());
      setIsLoggingOut(false);
    }
  }, [address, authenticated]);

  if (!authenticated || !address) {
    return null;
  }

  const currentChain = SUPPORTED_CHAINS.find(
    (supportedChain) => supportedChain.id === chainId
  );

  const handleSwitchChain = () => {
    pushModal({
      id: ChainSwitchModalId,
      content: <ChainSwitchModal />,
    });
    show();
  };

  return (
    <ModalContent dismissible={true}>
      <VisuallyHidden>
        <ModalTitle>Profile</ModalTitle>
        <ModalDescription>View your profile information.</ModalDescription>
      </VisuallyHidden>

      {/* Profile Header */}
      <div className="w-full flex flex-col items-center">
        <div className="rounded-full p-1 border-4 border-primary">
          <EthAvatar address={address} className="h-24 w-24" />
        </div>
        <span className="mt-4 text-2xl font-bold text-primary">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>

        {/* Quick Actions */}
        <div className="mt-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(address)}
            className="flex items-center space-x-2"
          >
            {isCopied ? <Check /> : <Copy />}
            {isCopied ? "Copied!" : "Copy"}
          </Button>
          <Link
            href={`${currentChain?.blockExplorers?.default?.url}/address/${address}`}
            target="_blank"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ExternalLink />
              View in Explorer
            </Button>
          </Link>
        </div>
      </div>

      {/* Wallet Balance */}
      {balance && (
        <div className="mt-6 w-full">
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold">
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Wallet Balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chain Information */}
      {currentChain && (
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <currentChain.logo className="text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{currentChain.name}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  Connected Chain
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchChain}
              className="flex items-center"
            >
              <ArrowLeftRight />
              <span>Switch</span>
            </Button>
          </div>
        </div>
      )}

      <ModalFooter>
        <Button
          variant="destructive"
          onClick={() => {
            setIsLoggingOut(true);
            logout();
          }}
          disabled={!ready || isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <LogOutIcon />
              Sign out
            </>
          )}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default ProfileModal;
