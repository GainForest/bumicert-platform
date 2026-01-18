"use client";
import { useAtprotoStore } from "@/components/stores/atproto";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const SectionForData = ({
  title,
  userDid,
  manageUrl,
  children,
  isUpdating = false,
}: {
  title: string;
  userDid?: string;
  manageUrl?: string;
  isUpdating?: boolean;
  children: React.ReactNode;
}) => {
  const auth = useAtprotoStore((state) => state.auth);
  const isOwner = Boolean(
    userDid && auth.status === "AUTHENTICATED" && auth.user.did === userDid
  );
  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-2xl">{title}</h2>
        {manageUrl && (
          <Link href={manageUrl}>
            <Button variant={"ghost"}>
              {isOwner ? "Manage all" : "View all"} <ArrowRight />
            </Button>
          </Link>
        )}
      </div>

      <section className={cn("w-full", isUpdating && "animate-pulse")}>
        {children}
      </section>
    </div>
  );
};

export default SectionForData;
