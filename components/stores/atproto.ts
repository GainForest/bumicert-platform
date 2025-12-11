import { Agent, CredentialSession } from "@atproto/api";
import { create } from "zustand";
import { StoredSession } from "climateai-sdk/session";
import { tryCatch } from "@/lib/tryCatch";
import { allowedPDSDomains, trpcClient } from "@/config/climateai-sdk";

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
        const [result, error] = await tryCatch(
          credentialSession.resumeSession({
            accessJwt: session.accessJwt,
            refreshJwt: session.refreshJwt,
            handle: session.handle,
            did: session.did,
            active: true,
          })
        );
        if (error || !result || !result.success) {
          trpcClient.auth.logout.mutate({ service: allowedPDSDomains[0] });
          set({
            auth: {
              status: "UNAUTHENTICATED",
              authenticated: false,
              user: null,
              agent: null,
            },
          });
          return;
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
