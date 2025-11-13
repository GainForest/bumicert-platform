import {
  createContext,
  createTRPCRouter,
  publicProcedure,
} from "../../server/trpc";
import { putOrganizationInfo } from "./atproto/gainforest/organizationInfo/put";
import { uploadFileAsBlob } from "./atproto/common/uploadFileAsBlob";
import { login } from "./atproto/auth/login";
import { resume } from "./atproto/auth/resume";
import { logout } from "./atproto/auth/logout";
import { getOrganizationInfo } from "./atproto/gainforest/organizationInfo/get";
import { listSites } from "./atproto/gainforest/site/list";
import { getProjectSite } from "./atproto/gainforest/site/get";
import { getDefaultProjectSite } from "./atproto/gainforest/site/getDefault";
import { createHypercertClaim } from "./atproto/hypercerts/claim/create";
import { updateOrganizationInfo } from "./atproto/gainforest/organizationInfo/update";
import { getAllSites } from "./atproto/gainforest/site/getAll";
import { createSite } from "./atproto/gainforest/site/create";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ status: "ok" })),
  common: {
    uploadFileAsBlob,
  },
  auth: {
    login,
    resume,
    logout,
  },
  organizationInfo: {
    get: getOrganizationInfo,
    put: putOrganizationInfo,
    update: updateOrganizationInfo,
  },
  gainforest: {
    site: {
      list: listSites,
      create: createSite,
      getAll: getAllSites,
      get: getProjectSite,
      getDefault: getDefaultProjectSite,
    },
  },
  hypercerts: {
    claim: {
      create: createHypercertClaim,
    },
  },
});
export type AppRouter = typeof appRouter;
export const getServerCaller = () => {
  return appRouter.createCaller(async () => await createContext());
};
