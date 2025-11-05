"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import { LogIn, LogOut } from "lucide-react";
import React from "react";
import { useAtproto } from "@/components/providers/AtprotoProvider";
import AuthModal, { AuthModalId } from "../modals/auth";

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
            id: AuthModalId,
            content: <AuthModal />,
          },
          true
        );
        show();
      }}
    >
      {isAuthenticated ?
        <LogOut />
      : <LogIn />}
      {isAuthenticated ? "Sign out" : "Sign in or Register"}
    </Button>
  );
};

export default AtprotoSignInButton;
