"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import { Loader2, LogIn, User } from "lucide-react";
import React from "react";
import AuthModal, { AuthModalId } from "../modals/auth";
import { useAtprotoStore } from "@/components/stores/atproto";
import { ProfileModal, ProfileModalId } from "../modals/profile";

const AtprotoSignInButton = () => {
  const { pushModal, show } = useModal();
  const auth = useAtprotoStore((state) => state.auth);

  if (auth.status === "RESUMING") {
    return <Loader2 className="animate-spin text-primary size-5 mx-1" />;
  }

  const isAuthenticated = auth.status === "AUTHENTICATED";

  return (
    <Button
      size={"sm"}
      variant={isAuthenticated ? "ghost" : "default"}
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
    >
      {isAuthenticated ? <User /> : <LogIn />}
      {isAuthenticated ? auth.user.handle.split(".")[0] : "Sign in or Register"}
    </Button>
  );
};

export default AtprotoSignInButton;
