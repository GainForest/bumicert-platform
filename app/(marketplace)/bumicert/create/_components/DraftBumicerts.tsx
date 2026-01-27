"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, AlertCircle, Inbox } from "lucide-react";

import { useAtprotoStore } from "@/components/stores/atproto";
import TimeText from "@/components/time-text";
import { links } from "@/lib/links";
import {
  DraftBumicertDataV0,
  DraftBumicertResponse,
  GetDraftBumicertResponse,
} from "@/app/api/supabase/drafts/bumicert/type";

// Calculate progress based on filled fields
const calculateProgress = (data: DraftBumicertDataV0): number => {
  const fields = [
    data.title,
    data.startDate,
    data.endDate,
    data.workScopes?.length,
    data.coverImage,
    data.description,
    data.shortDescription,
    data.contributors?.length,
    data.siteBoundaries?.length,
  ];

  const filledFields = fields.filter(
    (field) => field !== undefined && field !== null && field !== ""
  ).length;

  return Math.round((filledFields / fields.length) * 100);
};

const getDrafts = async (): Promise<DraftBumicertResponse[]> => {
  const response = await fetch(links.api.drafts.bumicert.get(), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch drafts");
  }

  const data: GetDraftBumicertResponse = await response.json();

  if (!data.success || !data.drafts) {
    throw new Error("Invalid response from server");
  }

  return data.drafts;
};

const DraftBumicerts = () => {
  const auth = useAtprotoStore((state) => state.auth);

  const {
    data: drafts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["drafts", auth.user?.did],
    queryFn: getDrafts,
    enabled: auth.authenticated && !!auth.user?.did,
  });

  const draftsWithProgress = useMemo(() => {
    if (!drafts) return [];
    return drafts.map((draft) => ({
      ...draft,
      title: draft.data.title || "Untitled",
      progress: calculateProgress(draft.data),
    }));
  }, [drafts]);

  if (!auth.authenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <AlertCircle className="size-4 text-muted-foreground/40" strokeWidth={1.5} />
        <span className="mt-2 text-xs text-muted-foreground/60">Sign in to view drafts</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="size-4 text-muted-foreground/40 animate-spin" strokeWidth={1.5} />
        <span className="ml-2 text-xs text-muted-foreground/60">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <AlertCircle className="size-4 text-muted-foreground/40" strokeWidth={1.5} />
        <span className="mt-2 text-xs text-muted-foreground/60">
          {error instanceof Error ? error.message : "Failed to load"}
        </span>
      </div>
    );
  }

  if (!draftsWithProgress || draftsWithProgress.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Inbox className="size-4 text-muted-foreground/40" strokeWidth={1.5} />
        <span className="mt-2 text-xs text-muted-foreground/60">No pending drafts</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {draftsWithProgress.map((draft) => (
        <Link
          key={draft.id}
          href={links.bumicert.createWithDraftId(draft.id.toString())}
          className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:bg-secondary/30 transition-colors group"
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors truncate">
              {draft.title}
            </span>
            <span className="text-[10px] text-muted-foreground/50">
              <TimeText date={new Date(draft.updated_at)} />
              {" · "}
              {draft.progress}%
            </span>
          </div>
          <ArrowRight className="size-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" strokeWidth={1.5} />
        </Link>
      ))}
    </div>
  );
};

export default DraftBumicerts;
