"use client";
import { useQuery } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  BrowserOAuthClient,
  OAuthSession,
} from "@atproto/oauth-client-browser";
import { verifySession } from "./utils/hydrate-from-session";
import { classifyAuthError } from "./utils/classify-auth-error";
import { Agent } from "@atproto/api";

const handleResolvers = ["https://climateai.org", "https://bsky.social"];
export type HandleResolverURL = (typeof handleResolvers)[number];

type AtprotoProviderContext = {
  isReady: boolean;
  isAuthenticated: boolean;
  initializationError: Error | null;
  authError: string | null;
  handleResolver: HandleResolverURL;
  setHandleResolver: (handleResolver: HandleResolverURL) => void;
  signIn: (handle: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  client: BrowserOAuthClient | null;
  agent: Agent | null;
};

const AtprotoProviderContext = createContext<AtprotoProviderContext | null>(
  null
);

export const AtprotoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isReady, setIsReady] = useState(false);
  const [handleResolver, setHandleResolver] = useState<HandleResolverURL>(
    handleResolvers[1]
  );
  const [client, setClient] = useState<BrowserOAuthClient | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [session, setSession] = useState<OAuthSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: clientMetadata, error: clientMetadataError } = useQuery({
    queryKey: ["client-metadata"],
    queryFn: async () => {
      const res = await fetch("/api/atproto/client-metadata.json");
      const data = await res.json();
      return data as BrowserOAuthClient["clientMetadata"];
    },
  });

  useEffect(() => {
    if (clientMetadata) {
      setClient(
        new BrowserOAuthClient({
          handleResolver: handleResolver,
          clientMetadata:
            clientMetadata as BrowserOAuthClient["clientMetadata"],
        })
      );
      setIsReady(true);
      setAgent(new Agent(handleResolver));
    } else {
      setIsReady(false);
    }
  }, [clientMetadata, handleResolver]);

  useEffect(() => {
    initializeSession();
  }, [isReady]);

  const signIn = useCallback(
    async (handle: string) => {
      if (!clientMetadata || !client) throw new Error("Client is not ready");

      const cleanHandle = handle.replace(/^@/, "").trim();

      if (typeof client.signIn === "function") {
        const currentUrl = window.location.href;
        console.log(currentUrl);
        await client.signIn(cleanHandle, {
          scope: "atproto transition:generic",
        });
        return true;
      } else {
        throw new Error("Client is not ready");
      }
    },
    [client, clientMetadata]
  );

  const initializeSession = useCallback(async () => {
    if (!clientMetadata || !client) throw new Error("Client is not ready");

    try {
      const result = await client.init();
      const session = result?.session;
      if (!session) {
        signOut();
        return;
      }
      const verified = await verifySession(session);
      if (!verified) {
        signOut();
        return;
      }
      setSession(session);
      const agent = new Agent(session.fetchHandler.bind(session));
      setAgent(agent);
      setIsAuthenticated(true);
    } catch (error: unknown) {
      const errorString = JSON.stringify(error);
      const errorType = classifyAuthError(errorString);
      switch (errorType) {
        case "stale_session":
          try {
            const restored = await client.initRestore();
            await restored?.session.signOut();
          } catch (cleanupError) {
            console.warn("Failed to cleanup stale session:", cleanupError);
          }
          signOut();
          setAuthError("Session expired. Please sign in again.");
          break;

        case "network":
          console.warn(
            "Network error during OAuth initialization:",
            errorString
          );
          setAuthError(
            "Network error. Please check your connection and try again."
          );
          break;

        case "permission":
          signOut();
          setAuthError("Access denied. Please check your permissions.");
          break;

        default:
          setAuthError(errorString);
      }
    }
  }, [client, clientMetadata]);

  const signOut = useCallback(async () => {
    if (!clientMetadata || !client) throw new Error("Client is not ready");
    if (!session) return;
    session.signOut();
    try {
      const restored = await client.initRestore();
      await restored?.session.signOut();
    } catch {}
    setSession(null);
    setIsAuthenticated(false);
    setAgent(new Agent(handleResolver));
  }, [client, clientMetadata, session]);

  return (
    <AtprotoProviderContext.Provider
      value={{
        isReady,
        handleResolver,
        initializationError: clientMetadataError,
        setHandleResolver,
        signIn,
        signOut,
        refreshSession: initializeSession,
        client,
        agent,
        isAuthenticated,
        authError,
      }}
    >
      {children}
    </AtprotoProviderContext.Provider>
  );
};

export const useAtproto = () => {
  const context = useContext(AtprotoProviderContext);
  if (!context) {
    throw new Error("useAtproto must be used within an AtprotoProvider");
  }
  return context;
};
