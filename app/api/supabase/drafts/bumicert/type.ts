import z from "zod";
import {
  draftBumicertDataSchemaV0,
  getDraftBumicertRequestSchema,
  createDraftBumicertRequestSchema,
  updateDraftBumicertRequestSchema,
  deleteDraftBumicertRequestSchema,
} from "./schema";

export type DraftBumicertDataV0 = z.infer<typeof draftBumicertDataSchemaV0>;
export type DraftBumicertData = DraftBumicertDataV0;

export type GetDraftBumicertRequest = z.infer<
  typeof getDraftBumicertRequestSchema
>;

export type CreateDraftBumicertRequest = z.infer<
  typeof createDraftBumicertRequestSchema
>;

export type UpdateDraftBumicertRequest = z.infer<
  typeof updateDraftBumicertRequestSchema
>;

export type DeleteDraftBumicertRequest = z.infer<
  typeof deleteDraftBumicertRequestSchema
>;
