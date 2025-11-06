import { publicProcedure } from "@/server/trpc";
import z from "zod";
import { getWriteAgent } from "../_app";

export const uploadFileAsBlob = publicProcedure
  .input(
    z.object({
      file: z.instanceof(File),
    })
  )
  .mutation(async ({ input }) => {
    const agent = getWriteAgent();
    const arrayBuffer = await input.file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const response = await agent.uploadBlob(uint8Array, {
      encoding: input.file.type,
    });
    return response;
  });
