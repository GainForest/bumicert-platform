"use client";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { useAtprotoStore } from "@/components/stores/atproto";

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
  Copy,
  Check,
  Loader2,
  ArrowRightFromLine,
  Building2,
  CloudUpload,
} from "lucide-react";
import Link from "next/link";
import { ProfileAvatar } from "@/components/profile-avatar";
import { useAtprotoProfile } from "@/hooks/use-atproto-profile";
import { useState, useMemo } from "react";

export const ProfileModalId = "profile";

export const ProfileModal = () => {
  const { stack, popModal, hide } = useModal();
  const auth = useAtprotoStore((state) => state.auth);
  const setAuth = useAtprotoStore((state) => state.setAuth);
  const [copied, setCopied] = useState(false);
  const { profile } = useAtprotoProfile(auth.user?.did);

  const { mutate: signOut, isPending: isSigningOut } =
    trpcApi.auth.logout.useMutation({
      onSuccess: () => {
        setAuth(null);
        hide().then(() => popModal());
      },
    });

  // Parse handle into username (must be before early return for hooks rules)
  const username = useMemo(() => {
    const fullHandle = profile?.handle || auth.user?.handle || "";
    return fullHandle.split(".")[0] || "";
  }, [profile?.handle, auth.user?.handle]);

  const copyDid = () => {
    if (auth.authenticated && auth.user) {
      navigator.clipboard.writeText(auth.user.did);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
          <ModalTitle>Not signed in</ModalTitle>
          <ModalDescription>
            Sign in to access your profile and organization.
          </ModalDescription>
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
        <ModalTitle className="sr-only">Profile</ModalTitle>
        <ModalDescription className="sr-only">
          Your account details
        </ModalDescription>
      </ModalHeader>

      {/* Profile Header */}
      <div className="flex flex-col items-center gap-3 pb-6">
        <ProfileAvatar
          did={auth.user.did}
          size={64}
          className="ring-1 ring-border/30"
        />

        <h2 className="text-xl font-serif font-medium text-foreground">
          {profile?.displayName || username}
        </h2>

        {/* DID with copy */}
        <button
          onClick={copyDid}
          className="flex items-center gap-1.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <span className="text-[10px] font-mono truncate max-w-[180px]">
            {auth.user.did}
          </span>
          {copied ? (
            <Check className="size-2.5 text-primary shrink-0" strokeWidth={1.5} />
          ) : (
            <Copy className="size-2.5 shrink-0" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-0.5 py-4 border-t border-border/30">
        <Link
          href={links.myOrganization(auth.user.did)}
          onClick={() => {
            hide().then(() => popModal());
          }}
          className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-secondary/40 transition-colors group"
        >
          <Building2 className="size-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors" strokeWidth={1.25} />
          <span className="text-sm text-muted-foreground/70 group-hover:text-foreground transition-colors">My Organization</span>
        </Link>

        <Link
          href={links.upload.organization(auth.user.did)}
          onClick={() => {
            hide().then(() => popModal());
          }}
          className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-secondary/40 transition-colors group"
        >
          <CloudUpload className="size-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors" strokeWidth={1.25} />
          <span className="text-sm text-muted-foreground/70 group-hover:text-foreground transition-colors">Upload</span>
        </Link>
      </div>

      {/* Footer */}
      <ModalFooter className="border-t border-border/30 pt-3">
        <button
          className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors disabled:opacity-50"
          onClick={() => {
            signOut({ service: "climateai.org" });
          }}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <ArrowRightFromLine className="size-3" strokeWidth={1.25} />
          )}
          Sign out
        </button>
      </ModalFooter>
    </ModalContent>
  );
};
