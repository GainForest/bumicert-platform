"use client";
import React, { useEffect } from "react";
import { useAtprotoStore } from "../stores/atproto";
import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { trpcClient } from "@/config/climateai-sdk";

const AtprotoHydrationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const setAuth = useAtprotoStore((state) => state.setAuth);

  // Extend the resume session mutation to handle errors every time it fails
  // so that the atproto store is updated as soon as possible.
  const resumeSessionMutationFn = trpcClient.auth.resume.mutate;
  const { mutate: resumeSession } = useMutation({
    mutationFn: async (params: Parameters<typeof resumeSessionMutationFn>) => {
      try {
        const response = await resumeSessionMutationFn(...params);
        return response;
      } catch (error) {
        if (
          error instanceof TRPCClientError &&
          error.data.code === "UNAUTHORIZED"
        ) {
          setAuth(null);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      setAuth(data.context, data.service as string);
    },
    retry: 3,
  });

  useEffect(() => {
    resumeSession([{ service: "climateai.org" }]);
  }, [resumeSession]);

  return children;
};

export default AtprotoHydrationProvider;
