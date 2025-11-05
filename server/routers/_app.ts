import { promise, z } from "zod";
import {
  createContext,
  createTRPCRouter,
  publicProcedure,
} from "../../server/trpc";
import { PDS_URL } from "@/config/atproto";
import { Agent } from "@atproto/api";
import type {
  AppGainforestOrganizationDefaultSite,
  AppGainforestOrganizationInfo,
  AppGainforestOrganizationSite,
} from "@/lexicon-api";
import { putOrganizationInfo } from "./atproto/putOrganizationInfo";
import { tryCatch } from "@/lib/tryCatch";
import { XRPCError } from "@atproto/xrpc";
import { TRPCError } from "@trpc/server";

export type GetRecordResponse<T> = {
  value: T;
  uri: string;
  cid: string;
};

export const getReadAgent = () => {
  return new Agent({
    service: PDS_URL,
  });
};

export const getWriteAgent = () => {
  return new Agent({
    service: PDS_URL,
  });
};

type ClassifiedError = {
  success: false;
  humanMessage: string;
  code: "ORG_NOT_FOUND" | "RECORD_NOT_FOUND" | "UNKNOWN_ERROR";
};

type ClassifiedSuccess<T> = {
  success: true;
  data: T;
};

const classifyXRPCError = (error: XRPCError): ClassifiedError => {
  if (error.error === "InvalidRequest") {
    return {
      success: false,
      humanMessage: "This organization does not exist.",
      code: "ORG_NOT_FOUND",
    };
  }
  if (error.error === "RecordNotFound") {
    return {
      success: false,
      humanMessage: "No organization found.",
      code: "RECORD_NOT_FOUND",
    };
  }
  return {
    success: false,
    humanMessage: "An unknown error occurred.",
    code: "UNKNOWN_ERROR",
  };
};

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ status: "ok" })),
  getOrganizationInfo: publicProcedure
    .input(z.object({ did: z.string() }))
    .query(async ({ input }) => {
      const agent = getReadAgent();
      const getRecordPromise = agent.com.atproto.repo.getRecord({
        collection: "app.gainforest.organization.info",
        repo: input.did,
        rkey: "self",
      });
      const [response, error] = await tryCatch(getRecordPromise);

      if (error) {
        if (error instanceof XRPCError) {
          const classifiedError = classifyXRPCError(error);
          return classifiedError;
        } else {
          console.error("An error occured:", error);
          console.error("Client will see it as an unknown error");
          return {
            success: false,
            humanMessage: "An unknown error occurred.",
            code: "UNKNOWN_ERROR",
          } satisfies ClassifiedError;
        }
      }

      if (response.success !== true) {
        console.error(
          "Response received but success is false. Response:",
          response
        );
        console.error("Client will see it as an unknown error");
        return {
          success: false,
          humanMessage: "Failed to get organization info.",
          code: "UNKNOWN_ERROR",
        } satisfies ClassifiedError;
      }

      return {
        success: true,
        data: response.data as GetRecordResponse<AppGainforestOrganizationInfo.Record>,
      } satisfies ClassifiedSuccess<
        GetRecordResponse<AppGainforestOrganizationInfo.Record>
      >;
    }),
  listProjectSites: publicProcedure
    .input(z.object({ did: z.string() }))
    .query(async ({ input }) => {
      const agent = getReadAgent();
      const response = await agent.com.atproto.repo.listRecords({
        collection: "app.gainforest.organization.site",
        repo: input.did,
      });
      if (response.success !== true) {
        throw new Error("Failed to list project sites");
      }
      return response.data;
    }),
  putOrganizationInfo,
  getProjectSite: publicProcedure
    .input(z.object({ did: z.string(), rkey: z.string() }))
    .query(async ({ input }) => {
      const agent = getReadAgent();
      const response = await agent.com.atproto.repo.getRecord({
        collection: "app.gainforest.organization.site",
        repo: input.did,
        rkey: input.rkey,
      });
      if (response.success !== true) {
        throw new Error("Failed to get project site");
      }
      return response.data as GetRecordResponse<AppGainforestOrganizationSite.Record>;
    }),
  getDefaultProjectSite: publicProcedure
    .input(z.object({ did: z.string() }))
    .query(async ({ input }) => {
      const agent = getReadAgent();
      const response = await agent.com.atproto.repo.getRecord({
        collection: "app.gainforest.organization.defaultSite",
        repo: input.did,
        rkey: "self",
      });
      if (response.success !== true) {
        throw new Error("Failed to get default project site");
      }
      return response.data as GetRecordResponse<AppGainforestOrganizationDefaultSite.Record>;
    }),
});

export type AppRouter = typeof appRouter;
export const getServerCaller = () => {
  return appRouter.createCaller(createContext());
};
