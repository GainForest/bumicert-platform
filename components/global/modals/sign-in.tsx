import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";
import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import useLocalStorage from "use-local-storage";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/ui/modal/context";
import { useAtprotoStore } from "@/components/stores/atproto";
import AuthenticatedModalContent from "./authenticated";
import { authorize } from "@/components/actions/oauth";
import { allowedPDSDomains } from "@/config/gainforest-sdk";

export const SignInModalId = "auth/sign-in";

const SignInModal = ({ initialHandle = "" }: { initialHandle?: string }) => {
  const initialHandlePrefix = initialHandle.includes(".")
    ? initialHandle.split(".")[0]
    : undefined;
  
  // Detect domain from initialHandle if provided
  const initialDomain = allowedPDSDomains.find(d => initialHandle.endsWith(`.${d}`));
  
  const [inputHandlePrefix, setInputHandlePrefix] = useState(
    initialHandlePrefix ?? ""
  );
  const [selectedDomain, setSelectedDomain] = useState<string>(
    initialDomain ?? allowedPDSDomains[0]
  );
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { popModal, stack } = useModal();
  const isAuthenticated = useAtprotoStore((state) => state.auth.authenticated);

  const [previousSessions, setPreviousSessions] = useLocalStorage<
    { handle: string }[]
  >("previous-sessions", []);

  const handleSignIn = async () => {
    if (!inputHandlePrefix) return;

    setIsRedirecting(true);
    setError(null);

    try {
      // Call the server action to get the authorization URL
      const { authorizationUrl } = await authorize(inputHandlePrefix, selectedDomain);

      // Store the handle prefix for later (to add to previous sessions after callback)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "pending_oauth_handle",
          `${inputHandlePrefix}.${selectedDomain}`
        );
      }

      // Redirect to the authorization URL
      window.location.href = authorizationUrl;
    } catch (err) {
      console.error("OAuth authorization error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to initiate sign in"
      );
      setIsRedirecting(false);
    }
  };

  if (isAuthenticated) {
    return <AuthenticatedModalContent message="You are already signed in." />;
  }

  return (
    <ModalContent>
      <ModalHeader
        backAction={
          stack.length === 1
            ? undefined
            : () => {
                popModal();
              }
        }
      >
        <ModalTitle>Sign In</ModalTitle>
        <ModalDescription>
          Sign in with your account
        </ModalDescription>
      </ModalHeader>
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm">Enter your handle</span>
          <InputGroup>
            <InputGroupAddon>@</InputGroupAddon>
            <InputGroupInput
              placeholder="john-doe"
              value={inputHandlePrefix}
              onChange={(e) => setInputHandlePrefix(e.target.value)}
              disabled={isRedirecting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputHandlePrefix) {
                  handleSignIn();
                }
              }}
            />
            <InputGroupAddon align="inline-end" className="text-primary">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                disabled={isRedirecting}
                className="bg-transparent border-none outline-none text-primary cursor-pointer text-sm"
              >
                {allowedPDSDomains.map((domain) => (
                  <option key={domain} value={domain}>.{domain}</option>
                ))}
              </select>
            </InputGroupAddon>
          </InputGroup>
          <div className="w-full bg-muted rounded-md flex flex-col gap-0.5 p-1">
            {previousSessions.length === 0 && (
              <div className="w-full text-sm text-muted-foreground text-center p-2">
                No previous sessions found.
              </div>
            )}

            {previousSessions.map((session) => {
              const handleSplit = session.handle.split(".");
              if (handleSplit.length < 2) {
                return null;
              }
              const prefix = handleSplit[0];
              const suffix = handleSplit.slice(1).join(".");
              if (!allowedPDSDomains.some(domain => domain === suffix)) {
                return null;
              }

              return (
                <div
                  className={cn(
                    "w-full relative first:rounded-t-md last:rounded-b-md bg-background",
                    inputHandlePrefix === prefix && "border border-primary/50"
                  )}
                  key={session.handle}
                >
                  <button
                    className={cn(
                      "flex items-center gap-2 justify-between h-8 rounded-md px-2 py-1 w-full cursor-pointer"
                    )}
                    disabled={isRedirecting}
                    onClick={() => {
                      setInputHandlePrefix(`${prefix}`);
                    }}
                  >
                    <span className="text-sm font-medium">
                      <span className="opacity-50 mr-1">@</span>
                      {session.handle}
                    </span>
                  </button>
                  <div className="absolute top-0 bottom-0 right-0 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-transparent hover:text-destructive cursor-pointer"
                      disabled={isRedirecting}
                      onClick={() => {
                        setPreviousSessions((prev) => {
                          const newSessions =
                            prev?.filter((s) => s.handle !== session.handle) ??
                            [];
                          return newSessions;
                        });
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          You will be redirected to authenticate.
        </p>
      </div>
      <ModalFooter>
        {error && <span className="text-sm text-destructive">{error}</span>}
        <Button
          disabled={inputHandlePrefix === "" || isRedirecting}
          onClick={handleSignIn}
        >
          {isRedirecting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Redirecting...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SignInModal;
