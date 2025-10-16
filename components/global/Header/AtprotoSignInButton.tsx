"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import { LogIn, LogOut } from "lucide-react";
import React from "react";
import SignInModal, { SignInModalId } from "../modals/sign-in";
import { useAtproto } from "@/components/providers/AtprotoProvider";

const AtprotoSignInButton = () => {
  const { pushModal, show } = useModal();
  const { isAuthenticated, signOut } = useAtproto();
  return (
    <Button
      size={"sm"}
      variant={isAuthenticated ? "destructive" : "default"}
      onClick={() => {
        if (isAuthenticated) {
          signOut();
          return;
        }
        pushModal(
          {
            id: SignInModalId,
            content: <SignInModal />,
          },
          true
        );
        show();
      }}
    >
      {isAuthenticated ? <LogOut /> : <LogIn />}
      {isAuthenticated ? "Sign out" : "Sign in"}
    </Button>
  );
};

export default AtprotoSignInButton;
