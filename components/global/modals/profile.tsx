"use client";
import { trpcApi } from "@/components/providers/TrpcProvider";
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
  Copy,
  Check,
  Loader2,
  LogOut,
  UploadIcon,
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

  // Parse handle into username and domain (must be before early return for hooks rules)
  const { username, domain } = useMemo(() => {
    const fullHandle = profile?.handle || auth.user?.handle || "";
    const parts = fullHandle.split(".");
    return {
      username: parts[0] || "",
      domain: parts.slice(1).join("."),
    };
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
      <div className="flex flex-col items-center gap-4 pb-4">
        <ProfileAvatar
          did={auth.user.did}
          size={72}
          className="ring-2 ring-border/40 ring-offset-2 ring-offset-background"
        />

        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-serif font-medium text-foreground">
            {username}
          </h2>
          <p className="text-sm text-muted-foreground">
            .{domain}
          </p>
        </div>

        {/* DID with copy */}
        <button
          onClick={copyDid}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 hover:bg-secondary transition-colors group"
        >
          <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">
            {auth.user.did}
          </span>
          {copied ? (
            <Check className="size-3 text-primary shrink-0" />
          ) : (
            <Copy className="size-3 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
          )}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 py-4 border-t border-border/40">
        <Link
          href={links.myOrganization(auth.user.did)}
          onClick={() => {
            hide().then(() => popModal());
          }}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
        >
          <Building className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium text-foreground">My Organization</span>
        </Link>

        <Link
          href={links.upload.organization(auth.user.did)}
          onClick={() => {
            hide().then(() => popModal());
          }}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
        >
          <UploadIcon className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium text-foreground">Upload</span>
        </Link>
      </div>

      {/* Footer */}
      <ModalFooter className="border-t border-border/40 pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            signOut({ service: "climateai.org" });
          }}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          Sign out
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
