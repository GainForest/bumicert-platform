import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { tryCatch } from "@/lib/tryCatch";
import { XRPCError } from "@atproto/xrpc";
import {
  ClassifiedError,
  ClassifiedSuccess,
  getReadAgent,
  classifyXRPCError,
  GetRecordResponse,
} from "@/server/utils";
import { AppGainforestOrganizationInfo } from "@/lexicon-api";

export const getOrganizationInfo = publicProcedure
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
  });
