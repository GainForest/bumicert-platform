import { protectedProcedure } from "@/server/trpc";
import z from "zod";
import { BlobRefJSON } from "../utils";
import { getWriteAgent } from "@/server/utils/agent";

export const uploadFileAsBlob = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      type: z.string(),
      dataBase64: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const agent = await getWriteAgent();
    const data = Buffer.from(input.dataBase64, "base64");
    const file = new File([data], input.name, { type: input.type });
    const response = await agent.uploadBlob(file);

    // Convert the response to json blobref like object
    return {
      success: response.success,
      headers: response.headers,
      data: {
        blob: response.data.blob.toJSON() as BlobRefJSON,
      },
    };
  });
