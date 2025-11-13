import { CID, Version } from "multiformats/cid";
import z from "zod";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { TRPCError } from "@trpc/server";

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

export const toFile = async (fileGenerator: FileGenerator) => {
  const file = new File(
    [Buffer.from(fileGenerator.dataBase64, "base64")],
    fileGenerator.name,
    { type: fileGenerator.type }
  );
  return file;
};

export const validateRecordOrThrow = <T>(
  record: T,
  { validateRecord }: { validateRecord: (record: T) => ValidationResult }
) => {
  const validation = validateRecord(record);
  if (!validation.success) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: validation.error.message,
    });
  }
  return record;
};
