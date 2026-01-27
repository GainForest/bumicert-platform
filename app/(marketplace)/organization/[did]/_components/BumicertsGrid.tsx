"use client";

import React from "react";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { links } from "@/lib/links";
import { parseAtUri } from "climateai-sdk/utilities/atproto";
import { Button } from "@/components/ui/button";
import { useAtprotoStore } from "@/components/stores/atproto";

interface BumicertsGridProps {
  did: string;
}

const BumicertsGrid = ({ did }: BumicertsGridProps) => {
  const auth = useAtprotoStore((state) => state.auth);
  const isOwner = auth.status === "AUTHENTICATED" && auth.user.did === did;

  const { data, isLoading } = trpcApi.hypercerts.claim.activity.getAll.useQuery(
    { did, pdsDomain: allowedPDSDomains[0] },
    { enabled: !!did }
  );

  const bumicerts = data?.activities ?? [];

  return (
    <div className="mt-10 px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Bumicerts</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" strokeWidth={1.5} />
        </div>
      ) : bumicerts.length === 0 ? (
        <EmptyState isOwner={isOwner} did={did} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bumicerts.map((bumicert) => (
            <BumicertCard key={bumicert.uri} bumicert={bumicert} />
          ))}
        </div>
      )}
    </div>
  );
};

interface BumicertCardProps {
  bumicert: {
    uri: string;
    value: {
      title?: string;
      shortDescription?: string;
      createdAt?: string;
    };
  };
}

const BumicertCard = ({ bumicert }: BumicertCardProps) => {
  const parsed = parseAtUri(bumicert.uri);
  const bumicertUrl = parsed ? links.bumicert.view(`${parsed.did}-${parsed.rkey}`) : "#";

  return (
    <Link href={bumicertUrl}>
      <div className="group p-4 rounded-xl border border-border/50 bg-background hover:border-border hover:shadow-sm transition-all">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="size-5 text-primary" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {bumicert.value.title || "Untitled Bumicert"}
            </h3>
            {bumicert.value.shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {bumicert.value.shortDescription}
              </p>
            )}
            {bumicert.value.createdAt && (
              <p className="text-xs text-muted-foreground/70 mt-2">
                {format(new Date(bumicert.value.createdAt), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const EmptyState = ({ isOwner, did }: { isOwner: boolean; did: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <FileText className="size-7 text-muted-foreground/50" strokeWidth={1.25} />
      </div>
      <h3 className="font-medium text-foreground mb-1">No bumicerts yet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {isOwner
          ? "Create your first bumicert to showcase your impact"
          : "This organization hasn't published any bumicerts yet"}
      </p>
      {isOwner && (
        <Link href={links.bumicert.create}>
          <Button size="sm">Create Bumicert</Button>
        </Link>
      )}
    </div>
  );
};

export default BumicertsGrid;
