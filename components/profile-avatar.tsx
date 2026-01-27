"use client";

import Image from "next/image";
import { useAtprotoProfile } from "@/hooks/use-atproto-profile";
import UserAvatar from "./user-avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  did: string;
  size?: number;
  className?: string;
  showFallback?: boolean;
}

/**
 * Shows the actual ATProto/Bluesky profile avatar if available,
 * otherwise falls back to a generated blocky avatar.
 */
export function ProfileAvatar({
  did,
  size = 32,
  className,
  showFallback = true,
}: ProfileAvatarProps) {
  const { profile, isLoading } = useAtprotoProfile(did);

  // Show loading placeholder
  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-full bg-secondary animate-pulse",
          className
        )}
        style={{ width: size, height: size }}
      />
    );
  }

  // Show actual avatar if available
  if (profile?.avatar) {
    return (
      <Image
        src={profile.avatar}
        alt={profile.displayName || profile.handle}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  // Fallback to generated avatar
  if (showFallback) {
    return (
      <UserAvatar
        did={did as `did:plc:${string}`}
        size={size}
        className={className}
      />
    );
  }

  // No avatar placeholder
  return (
    <div
      className={cn(
        "rounded-full bg-secondary flex items-center justify-center text-muted-foreground",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {(profile?.displayName || profile?.handle || "?").charAt(0).toUpperCase()}
    </div>
  );
}

export default ProfileAvatar;
