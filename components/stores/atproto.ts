import { create } from "zustand";
import { checkSession } from "@/components/actions/oauth";

export type User = {
  did: string;
  handle?: string;
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
    user: User;
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
  refreshSession: () => Promise<void>;
};

/**
 * Zustand store for managing ATProto authentication state.
 *
 * The store automatically checks for an existing session on initialization
 * using the `checkSession` server action. This reads the encrypted app
 * session cookie set during OAuth callback.
 *
 * @example
 * ```tsx
 * const auth = useAtprotoStore((state) => state.auth);
 *
 * if (auth.authenticated) {
 *   console.log(`Logged in as ${auth.user.did}`);
 * }
 * ```
 */
export const useAtprotoStore = create<AtprotoStoreState & AtprotoStoreActions>(
  (set, get) => {
    // Check session on store initialization
    const initializeSession = async () => {
      try {
        const result = await checkSession();

        if (result.authenticated) {
          set({
            isReady: true,
            auth: {
              status: "AUTHENTICATED",
              authenticated: true,
              user: {
                did: result.did,
                handle: result.handle,
              },
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
      } catch (error) {
        console.error("Error checking session:", error);
        set({
          isReady: true,
          auth: {
            status: "UNAUTHENTICATED",
            authenticated: false,
            user: null,
          },
        });
      }
    };

    // Start session check immediately
    initializeSession();

    return {
      isReady: false,
      auth: {
        status: "RESUMING",
        authenticated: false,
        user: null,
      },

      /**
       * Updates the authentication state.
       * Call this after OAuth callback to set the authenticated user,
       * or with null to log out.
       */
      setAuth: (user: User | null) => {
        if (user) {
          set({
            isReady: true,
            auth: {
              status: "AUTHENTICATED",
              authenticated: true,
              user,
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

      /**
       * Refreshes the session by re-checking with the server.
       * Useful after OAuth callback to update the store with the new session.
       */
      refreshSession: async () => {
        set({
          auth: {
            status: "RESUMING",
            authenticated: false,
            user: null,
          },
        });
        await initializeSession();
      },
    };
  }
);
