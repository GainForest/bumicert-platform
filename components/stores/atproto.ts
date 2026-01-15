import { create } from "zustand";

import { allowedPDSDomains, trpcClient } from "@/config/climateai-sdk";

type ResumeSessionParams = Parameters<typeof trpcClient.auth.resume.query>[0];
type ResumeSessionResult = Awaited<
  ReturnType<typeof trpcClient.auth.resume.query>
>;
const resumeSession = (params: ResumeSessionParams) => {
  const RETRY_COUNT = 3;
  let currentRetry = 0;

  function attempt(): Promise<ResumeSessionResult | undefined> {
    return trpcClient.auth.resume
      .query(params)
      .then((result) => result)
      .catch((error) => {
        if (currentRetry < RETRY_COUNT - 1) {
          currentRetry++;
          return attempt();
        } else {
          trpcClient.auth.logout.mutate({ service: params.service });
          throw error;
        }
      });
  }

  return attempt();
};

export type User = {
  did: string;
  handle: string;
};

export type AtprotoAuthCatalog = {
  unauthenticated: {
    status: "UNAUTHENTICATED";
    authenticated: false;
    user: null;
  };
  authenticated: {
    status: "AUTHENTICATED";
    authenticated: true;
    user: {
      did: string;
      handle: string;
    };
  };
  resuming: {
    status: "RESUMING";
    authenticated: false;
    user: null;
  };
};

export type AtprotoStoreState = {
  isReady: boolean;
  auth: AtprotoAuthCatalog[keyof AtprotoAuthCatalog];
};

export type AtprotoStoreActions = {
  setAuth: (session: User | null, service?: string) => void;
};

export const useAtprotoStore = create<AtprotoStoreState & AtprotoStoreActions>(
  (set) => {
    const resumeSessionPromise = resumeSession({
      service: allowedPDSDomains[0],
    });
    resumeSessionPromise
      .then((result) => {
        if (result) {
          set({
            auth: {
              status: "AUTHENTICATED",
              authenticated: true,
              user: {
                did: result.did,
                handle: result.handle,
              },
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error resuming session:", error);
        set({
          auth: {
            status: "UNAUTHENTICATED",
            authenticated: false,
            user: null,
          },
        });
      });

    return {
      isReady: false,
      auth: {
        status: "RESUMING",
        authenticated: false,
        user: null,
      },
      setAuth: async (user: User | null, service?: string) => {
        if (user) {
          if (!service) {
            throw new Error("Service is required");
          }
          set({
            auth: {
              status: "AUTHENTICATED",
              authenticated: true,
              user,
            },
          });
        } else {
          set({
            auth: {
              status: "UNAUTHENTICATED",
              authenticated: false,
              user: null,
            },
          });
        }
      },
    };
  }
);
