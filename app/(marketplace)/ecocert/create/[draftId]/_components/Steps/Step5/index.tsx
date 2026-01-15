"use client";
import { useAtprotoStore } from "@/components/stores/atproto";
import { allowedPDSDomains, trpcClient } from "@/config/climateai-sdk";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  Loader2,
  LucideIcon,
  ShieldCheckIcon,
  ShieldXIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useFormStore } from "../../../form-store";
import { useStep5Store } from "./store";
import { toFileGenerator } from "climateai-sdk/zod";
import { links } from "@/lib/links";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  const createEcocertMutationFn =
    trpcClient.hypercerts.claim.activity.create.mutate;
  type CreateEcocertResponse = Awaited<
    ReturnType<typeof createEcocertMutationFn>
  >;
  const [createdEcocertResponse, setCreatedEcocertResponse] =
    useState<CreateEcocertResponse | null>(null);
  const [createEcocertError, setCreateEcocertError] = useState<string | null>(
    null
  );
  const createEcocertStatus = createEcocertError
    ? "error"
    : createdEcocertResponse === null
    ? "pending"
    : "success";
  const { mutate: createEcocert } = useMutation({
    mutationKey: ["create-ecocert"],
    mutationFn: async () => {
      if (!step1FormValues.coverImage)
        throw new Error("Cover image is required");
      const response = await createEcocertMutationFn({
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
          image: await toFileGenerator(step1FormValues.coverImage),
        },
        pdsDomain: allowedPDSDomains[0],
      });
      if (response.success !== true)
        throw new Error("Failed to create ecocert");
      return response;
    },
    onSuccess: (data) => {
      setCreatedEcocertResponse(data);
    },
    onError: (error) => {
      console.error(error);
      setCreateEcocertError(error.message);
    },
  });

  useEffect(() => {
    if (authStatus === "success") {
      createEcocert();
    }
  }, [authStatus]);

  useEffect(() => {
    if (authStatus === "success" && createEcocertStatus === "success") {
      setOverallStatus("success");
    }
  }, [authStatus, createEcocertStatus]);

  return (
    <div>
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
            createEcocertError
              ? "Failed to publish."
              : createdEcocertResponse === null
              ? "Publishing your ecocert"
              : "Published!"
          }
          description={
            createEcocertError
              ? createEcocertError
              : createdEcocertResponse === null
              ? "We are publishing your ecocert."
              : ""
          }
          status={createEcocertStatus}
          isLastStep={true}
        />
      )}
      {createEcocertStatus === "success" &&
        createdEcocertResponse?.data.cid && (
          <div className="mt-4 flex flex-col items-center border border-border rounded-lg">
            <CircleCheckIcon className="size-6" />
            <span className="mt-1">
              Your ecocert has been published successfully.
            </span>
            <Button className="mt-2">
              <Link href={links.ecocert.view(createdEcocertResponse.data.cid)}>
                View ecocert <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        )}
    </div>
  );
};

export default Step5;
