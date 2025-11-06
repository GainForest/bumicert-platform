import { protectedProcedure } from "@/server/trpc";
import { getWriteAgent } from "@/server/utils";
import z from "zod";

export const uploadFileAsBlob = protectedProcedure
  .input(
    z.object({
      file: z.instanceof(File),
    })
  )
  .mutation(async ({ input }) => {
    const agent = await getWriteAgent();
    const arrayBuffer = await input.file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const response = await agent.uploadBlob(uint8Array, {
      encoding: input.file.type,
    });
    return response;
  });
