import { CID, Version } from "multiformats/cid";
import z from "zod";
import { BlobRef } from "@atproto/lexicon";

export const BlobRefJSONSchema = z.object({
  $type: z.literal("blob"),
  ref: z.object({
    $link: z.string(),
  }),
  mimeType: z.string(),
  size: z.number(),
});

export type BlobRefJSON = z.infer<typeof BlobRefJSONSchema>;

export const toBlobRef = (input: BlobRefJSON) => {
  const validCID: CID<unknown, number, number, Version> = CID.parse(
    input.ref.$link
  );
  return BlobRef.fromJsonRef({
    $type: "blob",
    ref: validCID,
    mimeType: input.mimeType,
    size: input.size,
  });
};

export const FileGeneratorSchema = z.object({
  name: z.string(),
  type: z.string(),
  dataBase64: z.string(),
});

export type FileGenerator = z.infer<typeof FileGeneratorSchema>;
