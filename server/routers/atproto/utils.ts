import { CID, Version } from "multiformats/cid";
import z from "zod";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { TRPCError } from "@trpc/server";

export const BlobRefGeneratorSchema = z.object({
  ref: z.object({
    $link: z.string(),
  }),
  mimeType: z.string(),
  size: z.number(),
});

export type BlobRefGenerator = z.infer<typeof BlobRefGeneratorSchema>;

export const toBlobRef = (input: BlobRefGenerator) => {
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

export const toBlobRefGenerator = (blobRef: BlobRef): BlobRefGenerator => {
  const json = blobRef.toJSON();
  return {
    ref: json.ref,
    mimeType: json.mimeType,
    size: json.size,
  };
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

export const toFileGenerator = async (file: File) => {
  return {
    name: file.name,
    type: file.type,
    dataBase64: await file
      .arrayBuffer()
      .then((buffer) => Buffer.from(buffer).toString("base64")),
  };
};

export const validateRecordOrThrow = <T>(
  record: T,
  { validateRecord }: { validateRecord: (record: T) => ValidationResult }
) => {
  const validation = validateRecord(record);
  if (!validation.success) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: validation.error.message,
      cause: validation.error,
    });
  }
  return record;
};
