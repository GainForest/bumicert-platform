import { Agent, CredentialSession } from "@atproto/api";
import { create } from "zustand";
import { StoredSession } from "@/server/session";

export type AtprotoAuthCatalog = {
  unauthenticated: {
    status: "UNAUTHENTICATED";
    authenticated: false;
    user: null;
    agent: null;
  };
  authenticated: {
    status: "AUTHENTICATED";
    authenticated: true;
    user: {
      did: string;
      handle: string;
    };
    agent: Agent;
  };
  resuming: {
    status: "RESUMING";
    authenticated: false;
    user: null;
    agent: null;
  };
};

export type AtprotoStoreState = {
  isReady: boolean;
  auth: AtprotoAuthCatalog[keyof AtprotoAuthCatalog];
};

export type AtprotoStoreActions = {
  setAuth: (session: StoredSession | null, service?: string) => void;
};

export const useAtprotoStore = create<AtprotoStoreState & AtprotoStoreActions>(
  (set) => ({
    isReady: false,
    auth: {
      status: "RESUMING",
      authenticated: false,
      user: null,
      agent: null,
    },
    setAuth: async (session: StoredSession | null, service?: string) => {
      if (session) {
        if (!service) {
          throw new Error("Service is required");
        }
        const credentialSession = new CredentialSession(
          new URL(`https://${service}`)
        );
        const result = await credentialSession.resumeSession({
          accessJwt: session.accessJwt,
          refreshJwt: session.refreshJwt,
          handle: session.handle,
          did: session.did,
          active: true,
        });
        if (!result.success) {
          throw new Error("Failed to resume session");
        }
        const agent = new Agent(credentialSession);
        set({
          auth: {
            status: "AUTHENTICATED",
            authenticated: true,
            user: { did: session.did, handle: session.handle },
            agent: agent,
          },
        });
      } else {
        set({
          auth: {
            status: "UNAUTHENTICATED",
            authenticated: false,
            user: null,
            agent: null,
          },
        });
      }
    },
  })
);
