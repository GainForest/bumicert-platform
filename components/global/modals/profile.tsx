"use client";

import { useState } from "react";
import { useAtprotoStore } from "@/components/stores/atproto";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import { links } from "@/lib/links";
import { Building, Loader2, LogOut, UploadIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/components/actions/oauth";

export const ProfileModalId = "profile";

export const ProfileModal = () => {
  const { stack, popModal, hide } = useModal();
  const auth = useAtprotoStore((state) => state.auth);
  const setAuth = useAtprotoStore((state) => state.setAuth);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      setAuth(null);
      await hide();
      popModal();
    } catch (error) {
      console.error("Logout error:", error);
      setIsSigningOut(false);
    }
  };

  if (!auth.authenticated) {
    return (
      <ModalContent>
        <ModalHeader
          backAction={
            stack.length === 1
              ? undefined
              : () => {
                  popModal();
                }
          }
        >
          <ModalTitle>Not signed in.</ModalTitle>
        </ModalHeader>
      </ModalContent>
    );
  }

  // Prefer displayName from profile, fallback to handle prefix, fallback to truncated DID
  const displayName = auth.user.displayName
    ?? (auth.user.handle
      ? auth.user.handle.split(".")[0]
      : auth.user.did.slice(0, 16) + "...");

  const domain = auth.user.handle
    ? auth.user.handle.split(".").slice(1).join(".")
    : "DID";

  return (
    <ModalContent>
      <ModalHeader
        backAction={
          stack.length === 1
            ? undefined
            : () => {
                popModal();
              }
        }
      >
        <ModalTitle></ModalTitle>
        <ModalDescription></ModalDescription>
      </ModalHeader>
      <div className="flex flex-col items-center gap-2">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {auth.user.avatar ? (
            <Image
              src={auth.user.avatar}
              alt={displayName}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-2xl font-bold text-muted-foreground">
              {displayName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-serif font-bold">{displayName}</span>
          <span className="text-sm text-muted-foreground">{domain}</span>
        </div>
        <div className="flex items-center gap-2 w-full my-4">
          <Link
            href={links.myOrganization(auth.user.did)}
            className="flex-1 flex items-center"
          >
            <Button
              className="flex-1 h-auto flex-col"
              variant={"outline"}
              onClick={() => {
                hide().then(() => {
                  popModal();
                });
              }}
            >
              <Building className="size-8 text-muted-foreground mt-2" />
              <span>My Organization</span>
            </Button>
          </Link>
          <Link
            href={links.upload.organization(auth.user.did)}
            className="flex-1 flex items-center"
          >
            <Button
              className="flex-1 h-auto flex-col"
              variant={"outline"}
              onClick={() => {
                hide().then(() => {
                  popModal();
                });
              }}
            >
              <UploadIcon className="size-8 text-muted-foreground mt-2" />
              <span>Upload</span>
            </Button>
          </Link>
        </div>
      </div>
      <ModalFooter>
        <Button
          variant={"destructive"}
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? <Loader2 className="animate-spin" /> : <LogOut />}
          Sign out
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
