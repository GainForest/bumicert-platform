"use client";
import { blo } from "blo";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const GenericAvatar = ({
  src,
  alt,
  size = 80,
  className,
}: {
  src: string;
  alt: string;
  size?: number | string;
  className?: string;
}) => {
  const sizeStyle = typeof size === "number" ? `${size}px` : size;
  return (
    <Avatar
      className={className}
      style={{ height: sizeStyle, width: sizeStyle }}
    >
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
};

const UserAvatar = ({
  did,
  size = 80,
  className,
}: {
  did: `did:plc:${string}`;
  size?: number | string;
  className?: string;
}) => {
  const address = did.startsWith("did:plc:") ? did.split(":")[2] : did;
  const addressHex = `0x${address}` as `0x${string}`;
  return (
    <GenericAvatar
      src={blo(addressHex)}
      alt={did}
      size={size}
      className={className}
    />
  );
};

export default UserAvatar;
