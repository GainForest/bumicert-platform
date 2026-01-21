import { create } from "zustand";
import { type AuthUser } from "@/lib/auth/auth-actions";
import { logout as logoutAction } from "@/lib/auth/auth-actions";
import { getAuthState } from "@/lib/auth/auth-actions";

export type User = AuthUser;

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
  setAuth: (user: User | null) => void;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAtprotoStore = create<AtprotoStoreState & AtprotoStoreActions>(
  (set, get) => ({
    isReady: false,
    auth: {
      status: "RESUMING",
      authenticated: false,
      user: null,
    },
    setAuth: (user: User | null) => {
      if (user) {
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
    refreshAuth: async () => {
      const state = await getAuthState();
      if (state.status === "AUTHENTICATED") {
        set({
          isReady: true,
          auth: {
            status: "AUTHENTICATED",
            authenticated: true,
            user: state.user,
          },
        });
      } else {
        set({
          isReady: true,
          auth: {
            status: "UNAUTHENTICATED",
            authenticated: false,
            user: null,
          },
        });
      }
    },
    logout: async () => {
      await logoutAction();
      set({
        auth: {
          status: "UNAUTHENTICATED",
          authenticated: false,
          user: null,
        },
      });
    },
  })
);
