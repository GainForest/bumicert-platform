import { create } from "zustand";
import { StoredSession } from "climateai-sdk/session";
import { tryCatch } from "@/lib/tryCatch";
import { allowedPDSDomains, trpcClient } from "@/config/climateai-sdk";

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
  (set) => ({
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
  })
);
