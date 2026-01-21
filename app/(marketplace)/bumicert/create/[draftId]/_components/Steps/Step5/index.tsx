"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  Loader2,
  LucideIcon,
  ShieldCheckIcon,
  ShieldXIcon,
} from "lucide-react";
import Link from "next/link";

import { useAtprotoStore } from "@/components/stores/atproto";
import { allowedPDSDomains, trpcClient } from "@/config/climateai-sdk";
import { cn } from "@/lib/utils";
import { useFormStore } from "../../../form-store";
import { useStep5Store } from "./store";
import { toFileGenerator } from "climateai-sdk/zod";
import { links } from "@/lib/links";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parseAtUri } from "climateai-sdk/utilities/atproto";
import { trpcApi } from "@/components/providers/TrpcProvider";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { trackBumicertPublished, getFlowDurationSeconds } from "@/lib/analytics";

const ProgressItem = ({
  iconset,
  title,
  description,
  status,
  isLastStep = false,
}: {
  iconset: {
    Error: LucideIcon;
    Success: LucideIcon;
  };
  title: string;
  description: string;
  status: "pending" | "success" | "error";
  isLastStep?: boolean;
}) => {
  return (
    <motion.div
      className={cn(
        "flex items-start gap-4 p-4 relative",
        status === "success" && "items-center"
      )}
      initial={{
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.6,
        y: 10,
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        y: 0,
      }}
    >
      {!isLastStep && (
        <motion.div
          className={cn(
            "absolute z-0 top-8 left-8 w-4 rounded-full bg-primary transition-colors",
            status === "error" && "bg-destructive"
          )}
          animate={{
            bottom: status === "success" ? "-2rem" : "unset",
          }}
        ></motion.div>
      )}

      <div
        className={cn(
          "relative z-5 bg-primary p-2 rounded-full",
          status === "error" && "bg-destructive",
          status === "pending" && "bg-background border border-border"
        )}
      >
        {status === "error" ? (
          <iconset.Error className="size-8 text-white" />
        ) : status === "success" ? (
          <iconset.Success className="size-8 text-primary-foreground" />
        ) : (
          <Loader2 className="size-8 animate-spin text-primary" />
        )}
      </div>

      <div>
        <h3
          className={cn(
            "text-xl font-medium",
            status === "error" && "text-destructive",
            status === "success" && "text-primary"
          )}
        >
          {title}
        </h3>
        {status !== "success" && (
          <p className="text-base text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

const Step5 = () => {
  const auth = useAtprotoStore((state) => state.auth);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const authStatus =
    auth.status === "RESUMING"
      ? "pending"
      : auth.status === "AUTHENTICATED"
      ? "success"
      : "error";

  const formValues = useFormStore((state) => state.formValues);
  const step1FormValues = formValues[0];
  const step2FormValues = formValues[1];
  const step3FormValues = formValues[2];

  const setOverallStatus = useStep5Store((state) => state.setOverallStatus);

  useEffect(() => {
    setOverallStatus("pending");
  }, []);

  const createBumicertMutationFn =
    trpcClient.hypercerts.claim.activity.create.mutate;
  type CreateBumicertResponse = Awaited<
    ReturnType<typeof createBumicertMutationFn>
  >;
  const [createdBumicertResponse, setCreatedBumicertResponse] =
    useState<CreateBumicertResponse | null>(null);
  const [createBumicertError, setCreateBumicertError] = useState<string | null>(
    null
  );
  const [
    isBumicertCreationMutationInFlight,
    setIsBumicertCreationMutationInFlight,
  ] = useState(false);
  const [hasClickedPublish, setHasClickedPublish] = useState(false);

  const createBumicertStatus: "pending" | "success" | "error" =
    createBumicertError
      ? "error"
      : createdBumicertResponse === null
      ? "pending"
      : "success";

  const { mutate: createBumicert } =
    trpcApi.hypercerts.claim.activity.create.useMutation({
      onSuccess: async (data) => {
        setCreatedBumicertResponse(data);

        // Delete draft if it exists (non-zero draftId in URL)
        const draftIdMatch = pathname.match(/\/create\/(\d+)$/);
        const draftId = draftIdMatch ? parseInt(draftIdMatch[1], 10) : null;

        if (draftId && draftId !== 0 && !isNaN(draftId)) {
          try {
            await fetch(links.api.drafts.bumicert.delete, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ draftIds: [draftId] }),
            });

            // Invalidate drafts query to refresh the list
            if (auth.user?.did) {
              queryClient.invalidateQueries({
                queryKey: ["drafts", auth.user.did],
              });
            }
          } catch (error) {
            // Silently fail - draft deletion is not critical
            console.error("Failed to delete draft after publishing:", error);
          }
        }

        // Track successful bumicert publication
        const duration = getFlowDurationSeconds() ?? 0;
        trackBumicertPublished({
          draftId: data.data?.cid ?? "unknown",
          totalDurationSeconds: duration,
        });
      },
      onError: (error) => {
        console.error(error);
        setCreateBumicertError(error.message);
      },
      onMutate: () => {
        setIsBumicertCreationMutationInFlight(true);
      },
      onSettled: () => {
        setIsBumicertCreationMutationInFlight(false);
      },
    });

  const handlePublishClick = async () => {
    if (
      hasClickedPublish ||
      isBumicertCreationMutationInFlight ||
      createBumicertStatus === "success"
    ) {
      return;
    }

    setCreateBumicertError(null);

    if (!step1FormValues.coverImage) {
      setCreateBumicertError("Cover image is required");
      return;
    }

    try {
      const coverImageFileGen = await toFileGenerator(
        step1FormValues.coverImage
      );

      const data = {
        activity: {
          title: step1FormValues.projectName,
          shortDescription: step2FormValues.shortDescription,
          description: step2FormValues.impactStory,
          workScopes: step1FormValues.workType,
          startDate: step1FormValues.projectDateRange[0].toISOString(),
          endDate: step1FormValues.projectDateRange[1].toISOString(),
          contributors: step3FormValues.contributors,
          locations: step3FormValues.siteBoundaries.map((sb) => ({
            $type: "com.atproto.repo.strongRef" as const,
            cid: sb.cid,
            uri: sb.uri,
          })),
        },
        uploads: {
          image: coverImageFileGen,
        },
        pdsDomain: allowedPDSDomains[0],
      };

      if (authStatus === "success") {
        setHasClickedPublish(true);
        createBumicert(data);
      } else {
        setCreateBumicertError("You must be signed in to publish.");
      }
    } catch (error) {
      console.error(error);
      setCreateBumicertError(
        error instanceof Error
          ? error.message
          : "Failed to prepare publish data."
      );
    }
  };

  useEffect(() => {
    if (authStatus === "success" && createBumicertStatus === "success") {
      setOverallStatus("success");
    }
  }, [authStatus, createBumicertStatus, setOverallStatus]);

  return (
    <div>
      {authStatus === "success" && createBumicertStatus !== "success" && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handlePublishClick}
            disabled={isBumicertCreationMutationInFlight}
          >
            Publish Bumicert <ArrowRightIcon className="ml-2" />
          </Button>
        </div>
      )}
      <ProgressItem
        iconset={{
          Error: ShieldXIcon,
          Success: ShieldCheckIcon,
        }}
        title="Authenticated"
        description={
          authStatus === "pending"
            ? "We are checking if you are authenticated."
            : "You are not signed in. Please sign in to continue."
        }
        status={authStatus}
      />
      {authStatus === "success" && (
        <ProgressItem
          iconset={{
            Error: CircleAlertIcon,
            Success: CircleCheckIcon,
          }}
          title={
            createBumicertError
              ? "Failed to publish."
              : createBumicertStatus === "success"
              ? "Published!"
              : "Ready to publish your bumicert"
          }
          description={
            createBumicertError
              ? createBumicertError
              : isBumicertCreationMutationInFlight
              ? "We are publishing your bumicert."
              : "Review your details, then publish your bumicert."
          }
          status={createBumicertStatus}
          isLastStep={true}
        />
      )}
      {createBumicertStatus === "success" &&
        createdBumicertResponse?.data.cid && (
          <div className="mt-4 flex flex-col items-center border border-border rounded-lg">
            <CircleCheckIcon className="size-6" />
            <span className="mt-1">
              Your bumicert has been published successfully.
            </span>
            <Button className="mt-2">
              <Link
                href={links.bumicert.view(
                  `${parseAtUri(createdBumicertResponse.data.uri).did}-${
                    parseAtUri(createdBumicertResponse.data.uri).rkey
                  }`
                )}
              >
                View bumicert <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        )}
    </div>
  );
};

export default Step5;
