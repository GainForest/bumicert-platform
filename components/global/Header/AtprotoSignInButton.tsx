"use client";
import { useModal } from "@/components/ui/modal/context";
import { Loader2 } from "lucide-react";
import React from "react";
import AuthModal, { AuthModalId } from "../modals/auth";
import { useAtprotoStore } from "@/components/stores/atproto";
import { ProfileModal, ProfileModalId } from "../modals/profile";
import ProfileAvatar from "@/components/profile-avatar";
import { useAtprotoProfile } from "@/hooks/use-atproto-profile";

const AtprotoSignInButton = () => {
  const { pushModal, show } = useModal();
  const auth = useAtprotoStore((state) => state.auth);
  const { profile } = useAtprotoProfile(auth.user?.did);

  if (auth.status === "RESUMING") {
    return <Loader2 className="animate-spin text-primary size-5 mx-1" />;
  }

  const isAuthenticated = auth.status === "AUTHENTICATED";
  const displayName = profile?.displayName || auth.user?.handle?.split(".")[0];

  return (
    <button
      onClick={() => {
        pushModal(
          {
            id: isAuthenticated ? ProfileModalId : AuthModalId,
            content: isAuthenticated ? <ProfileModal /> : <AuthModal />,
          },
          true
        );
        show();
      }}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
    >
      {isAuthenticated && auth.user ? (
        <>
          <ProfileAvatar
            did={auth.user.did}
            size={24}
            className="ring-1 ring-border/40"
          />
          <span className="text-sm text-foreground max-w-[120px] truncate">
            {displayName}
          </span>
        </>
      ) : (
        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Sign in
        </span>
      )}
    </button>
  );
};

export default AtprotoSignInButton;
