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
import { listProjectSites } from "./atproto/gainforest/projectSite/list";
import { getProjectSite } from "./atproto/gainforest/projectSite/get";
import { getDefaultProjectSite } from "./atproto/gainforest/projectSite/getDefault";
import { postHypercertClaim } from "./atproto/hypercerts/claim/post";

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
  },
  projectSites: {
    list: listProjectSites,
    get: getProjectSite,
    getDefault: getDefaultProjectSite,
  },
  hypercerts: {
    createClaim: postHypercertClaim,
  },
});
export type AppRouter = typeof appRouter;
export const getServerCaller = () => {
  return appRouter.createCaller(async () => await createContext());
};
