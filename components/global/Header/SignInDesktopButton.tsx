"use client";
import { Button } from "@/components/ui/button";
import { SUPPORTED_CHAINS } from "@/config/wagmi";
import useAccount from "@/hooks/use-account";
import { Loader2, LogIn } from "lucide-react";
import { useLogin } from "@privy-io/react-auth";
import { useModal } from "@/components/ui/modal/context";
import {
  ChainSwitchModal,
  ChainSwitchModalId,
} from "@/components/providers/ChainSwitchProvider";
import { ProfileModal, ProfileModalId } from "../modals/profile";

const SignInDesktopButton = () => {
  const { address, isConnecting, isConnected, authenticated, chainId } =
    useAccount();
  const { login } = useLogin();

  const { pushModal, show, clear } = useModal();

  if (isConnecting)
    return <Loader2 className="animate-spin text-primary size-5 mx-1" />;

  // TODO: In case when user disconnects the wallet manually, he still remains authenticated.
  // It is not expected behavior, we need to fix this.
  if (!authenticated || !isConnected || !address) {
    return (
      <Button size={"sm"} onClick={() => login()}>
        <LogIn />
        Sign in
      </Button>
    );
  }

  const chain = SUPPORTED_CHAINS.find(
    (supportedChain) => supportedChain.id === chainId
  );

  const displaySwitchChainModal = () => {
    clear();
    pushModal({
      id: ChainSwitchModalId,
      content: <ChainSwitchModal />,
    });
    show();
  };

  if (!chain) {
    return (
      <Button
        size={"sm"}
        variant={"destructive"}
        onClick={displaySwitchChainModal}
      >
        Unsupported Chain
      </Button>
    );
  }

  const displayProfileModal = () => {
    clear();
    pushModal({
      id: ProfileModalId,
      content: <ProfileModal />,
    });
    show();
  };

  return (
    <Button
      size={"sm"}
      variant={"outline"}
      className="border-primary"
      onClick={displayProfileModal}
    >
      <chain.logo className="text-primary" />
      <span className="text-xs text-primary">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    </Button>
  );
};

export default SignInDesktopButton;
