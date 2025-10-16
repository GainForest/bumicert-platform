"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "wagmi/query";

type AtprotoAuthContext = {
  authStatus:
    | "initializing"
    | "loading"
    | "redirecting"
    | "authenticated"
    | "unauthenticated";
  login: (handle: string) => void;
  logout: () => void;
  loginError: Error | null;
  logoutError: Error | null;
};

const AtprotoAuthContext = createContext<AtprotoAuthContext | null>(null);

export const AtprotoAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authStatus, setAuthStatus] = useState<
    "initializing" | AtprotoAuthContext["authStatus"]
  >("initializing");
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [logoutError, setLogoutError] = useState<Error | null>(null);
  const router = useRouter();

  const login = useCallback(
    async (handle: string) => {
      if (authStatus !== "unauthenticated") return;

      setLoginError(null);
      setAuthStatus("loading");
      const ATTEMPTS = 3;
      let lastError: Error | null = null;
      for (let i = 0; i < ATTEMPTS; i++) {
        try {
          const res = await fetch("/api/atproto/oauth/login", {
            method: "POST",
            body: JSON.stringify({ handle }),
          });
          if (!res.ok) {
            throw new Error("Failed to fetch login redirect url");
          }
          const data = await res.json();
          const loginRedirectUrl = data.redirectUrl as string;
          console.log("loginRedirectUrl", loginRedirectUrl);
          setAuthStatus("redirecting");
          router.push(loginRedirectUrl);
          break;
        } catch (error) {
          lastError = error as Error;
          if (i === ATTEMPTS - 1) {
            throw error;
          }
        }
      }

      if (lastError) {
        setAuthStatus("unauthenticated");
        setLoginError(lastError);
      }
    },
    [authStatus, router]
  );

  const logout = useCallback(async () => {
    if (authStatus !== "authenticated") return;

    setAuthStatus("loading");
    setLogoutError(null);
    try {
      const res = await fetch("/api/atproto/oauth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      setAuthStatus("unauthenticated");
      setLogoutError(error as Error);
    }
  }, []);

  useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const res = await fetch("/api/atproto/oauth/status");
      if (!res.ok) {
        throw new Error("Failed to fetch auth status");
      }
      const data = await res.json();
      if (authStatus !== "initializing") return false;
      setAuthStatus(data.did ? "authenticated" : "unauthenticated");
      return true;
    },
    enabled: authStatus === "initializing",
  });

  return (
    <AtprotoAuthContext.Provider
      value={{ authStatus, login, logout, loginError, logoutError }}
    >
      {children}
    </AtprotoAuthContext.Provider>
  );
};

export const useAtprotoAuth = () => {
  const context = useContext(AtprotoAuthContext);
  if (!context) {
    throw new Error(
      "useAtprotoAuth must be used within an AtprotoAuthProvider"
    );
  }
  return context;
};
