"use client";

import { trpcApi } from "@/components/providers/TrpcProvider";
import { useAtprotoStore } from "@/components/stores/atproto";
import { allowedPDSDomains } from "@/config/climateai-sdk";
import { links } from "@/lib/links";
import { parseAtUri } from "climateai-sdk/utilities/atproto";
import { getEcocertsFromClaimActivities as getBumicertsFromClaimActivities } from "climateai-sdk/utilities/hypercerts";
import { ArrowUpRight, Inbox, Loader2, Award } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

const MyBumicerts = () => {
  const auth = useAtprotoStore((state) => state.auth);
  const { data: activityClaims } = trpcApi.hypercerts.claim.activity.getAll.useQuery(
    {
      did: auth.authenticated ? auth.user.did : "",
      pdsDomain: allowedPDSDomains[0],
    },
    {
      enabled: auth.authenticated,
    }
  );
  const { data: organizationInfo } = trpcApi.gainforest.organization.info.get.useQuery(
    {
      did: auth.authenticated ? auth.user.did : "",
      pdsDomain: allowedPDSDomains[0],
    },
    {
      enabled: auth.authenticated,
    }
  );
  const bumicerts = useMemo(() => {
    if (!auth.authenticated) return undefined;
    if (!activityClaims || !organizationInfo) return undefined;
    const bumicerts = getBumicertsFromClaimActivities(
      [
        {
          activities: activityClaims.activities,
          organizationInfo: organizationInfo.value,
          repo: {
            did: auth.user.did,
          },
        },
      ],
      allowedPDSDomains[0]
    );
    return bumicerts;
  }, [activityClaims, organizationInfo, auth]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Award className="size-4 text-muted-foreground/50" strokeWidth={1.5} />
        <h2 className="text-sm font-medium text-muted-foreground">My Bumicerts</h2>
        {bumicerts !== undefined && bumicerts.length > 0 && (
          <span className="text-xs text-muted-foreground/50">{bumicerts.length}</span>
        )}
      </div>

      {bumicerts === undefined ? (
        <div className="flex items-center justify-center py-8 text-center rounded-lg border border-border/30">
          <Loader2 className="size-4 text-muted-foreground/50 animate-spin" strokeWidth={1.5} />
          <span className="ml-2 text-sm text-muted-foreground/70">Loading...</span>
        </div>
      ) : bumicerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-border/30">
          <Inbox className="size-5 text-muted-foreground/40" strokeWidth={1.5} />
          <span className="mt-2 text-sm text-muted-foreground/60">No bumicerts yet</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {bumicerts.map((bumicert) => (
            <Link
              key={bumicert.claimActivity.uri}
              href={links.bumicert.view(
                `${bumicert.repo.did}-${parseAtUri(bumicert.claimActivity.uri).rkey}`
              )}
              className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:bg-secondary/30 transition-colors group"
            >
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {bumicert.claimActivity.value.title}
              </span>
              <ArrowUpRight className="size-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyBumicerts;
