"use client";

import { useState, useEffect } from "react";

export interface AtprotoProfile {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  description?: string;
}

/**
 * Fetches ATProto profile data from the public Bluesky AppView.
 * This includes the actual profile avatar and display name.
 */
export function useAtprotoProfile(did: string | undefined) {
  const [profile, setProfile] = useState<AtprotoProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!did) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use the public Bluesky AppView API to get profile
        const response = await fetch(
          `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        if (!cancelled) {
          setProfile({
            did: data.did,
            handle: data.handle,
            displayName: data.displayName,
            avatar: data.avatar,
            description: data.description,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          // Fall back to basic info
          setProfile({
            did,
            handle: did,
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [did]);

  return { profile, isLoading, error };
}
