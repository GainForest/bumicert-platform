"use client";
import { useAtprotoStore } from "@/components/stores/atproto";
import { trpcClient } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import {
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
import { useStep4Store } from "../Step4/store";
import { useStep1Store } from "../Step1/store";
import { useStep2Store } from "../Step2/store";
import { useStep3Store } from "../Step3/store";
import { useStep5Store } from "./store";
import { toFileGenerator } from "@/server/routers/atproto/utils";

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
        {status === "error" ?
          <iconset.Error className="size-8 text-white" />
        : status === "success" ?
          <iconset.Success className="size-8 text-primary-foreground" />
        : <Loader2 className="size-8 animate-spin text-primary" />}
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
    auth.status === "RESUMING" ? "pending"
    : auth.status === "AUTHENTICATED" ? "success"
    : "error";

  const step1FormValues = useStep1Store((state) => state.formValues);
  const step2FormValues = useStep2Store((state) => state.formValues);
  const step3FormValues = useStep3Store((state) => state.formValues);

  const setOverallStatus = useStep5Store((state) => state.setOverallStatus);

  useEffect(() => {
    setOverallStatus("pending");
  }, []);

  const createEcocertMutationFn = trpcClient.hypercerts.claim.create.mutate;
  type CreateEcocertResponse = Awaited<
    ReturnType<typeof createEcocertMutationFn>
  >;
  const [createdEcocertResponse, setCreatedEcocertResponse] =
    useState<CreateEcocertResponse | null>(null);
  const [createEcocertError, setCreateEcocertError] = useState<string | null>(
    null
  );
  const createEcocertStatus =
    createEcocertError ? "error"
    : createdEcocertResponse === null ? "pending"
    : "success";
  const { mutate: createEcocert } = useMutation({
    mutationKey: ["create-ecocert"],
    mutationFn: async () => {
      if (!step1FormValues.coverImage)
        throw new Error("Cover image is required");
      const response = await createEcocertMutationFn({
        claim: {
          title: step1FormValues.projectName,
          shortDescription: step2FormValues.shortDescription,
          description: step2FormValues.impactStory,
          workScope: step1FormValues.workType,
          workTimeFrameFrom: step1FormValues.projectDateRange[0].toISOString(),
          workTimeFrameTo:
            (
              step1FormValues.isProjectOngoing ||
              step1FormValues.projectDateRange[1] === null
            ) ?
              new Date(0).toISOString()
            : step1FormValues.projectDateRange[1].toISOString(),
          createdAt: new Date().toISOString(),
        },
        uploads: {
          contributors: step3FormValues.contributors,
          siteAtUri: step3FormValues.siteBoundaries,
          image: await toFileGenerator(step1FormValues.coverImage),
        },
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
          authStatus === "pending" ?
            "We are checking if you are authenticated."
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
            createEcocertError ? "Failed to publish."
            : createdEcocertResponse === null ?
              "Publishing your ecocert"
            : "Published!"
          }
          description={
            createEcocertError ? createEcocertError
            : createdEcocertResponse === null ?
              "We are publishing your ecocert."
            : ""
          }
          status={createEcocertStatus}
          isLastStep={true}
        />
      )}
    </div>
  );
};

export default Step5;
