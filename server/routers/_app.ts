import {
  createContext,
  createTRPCRouter,
  publicProcedure,
} from "../../server/trpc";
import { putOrganizationInfo } from "./atproto/organizationInfo/put";
import { uploadFileAsBlob } from "./atproto/common/uploadFileAsBlob";
import { login } from "./atproto/auth/login";
import { resume } from "./atproto/auth/resume";
import { logout } from "./atproto/auth/logout";
import { getOrganizationInfo } from "./atproto/organizationInfo/get";
import { listProjectSites } from "./atproto/projectSite/list";
import { getProjectSite } from "./atproto/projectSite/get";
import { getDefaultProjectSite } from "./atproto/projectSite/getDefault";

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
});
export type AppRouter = typeof appRouter;
export const getServerCaller = () => {
  return appRouter.createCaller(async () => await createContext());
};
