"use client";
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
import {
  Building,
  Loader2,
  LogOut,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

export const ProfileModalId = "profile";

export const ProfileModal = () => {
  const { stack, popModal, hide } = useModal();
  const auth = useAtprotoStore((state) => state.auth);
  const logout = useAtprotoStore((state) => state.logout);

  const {
    mutate: handleSignOut,
    isPending: isSigningOut,
  } = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      hide().then(() => popModal());
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

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
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center"></div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-serif font-bold">
            {auth.user.handle.split(".")[0]}
          </span>
          <span className="text-sm text-muted-foreground">
            {auth.user.handle.split(".").slice(1).join(".")}
          </span>
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
          onClick={() => handleSignOut()}
          disabled={isSigningOut}
        >
          {isSigningOut ? <Loader2 className="animate-spin" /> : <LogOut />}
          Sign out
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
