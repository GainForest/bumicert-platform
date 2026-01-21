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
import React, { useCallback, useState } from "react";
import { Loader2, X } from "lucide-react";
import useLocalStorage from "use-local-storage";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/ui/modal/context";
import { useAtprotoStore } from "@/components/stores/atproto";
import AuthenticatedModalContent from "./authenticated";
import { getLoginUrl } from "@/lib/hypercerts/auth-actions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const SignInModalId = "auth/sign-in";

const SignInModal = ({ initialHandle = "" }: { initialHandle?: string }) => {
  const initialHandlePrefix = initialHandle.includes(".")
    ? initialHandle.split(".")[0]
    : undefined;
  const [inputHandlePrefix, setInputHandlePrefix] = useState(
    initialHandlePrefix ?? ""
  );
  const { popModal, stack } = useModal();
  const router = useRouter();
  const isAuthenticated = useAtprotoStore((state) => state.auth.authenticated);

  const {
    mutate: handleSignIn,
    isPending: isRedirecting,
    error: signInError,
  } = useMutation({
    mutationFn: async (handlePrefix: string) => {
      const authUrl = await getLoginUrl(handlePrefix);
      
      // Store the handle for after callback (to add to previous sessions)
      localStorage.setItem('pending-login-handle', `${handlePrefix}.climateai.org`);
      
      return authUrl;
    },
    onSuccess: (authUrl) => {
      router.push(authUrl);
    },
  });

  const [previousSessions, setPreviousSessions] = useLocalStorage<
    { handle: string }[]
  >("previous-sessions", []);

  const addPreviousSession = useCallback(
    (handle: string) => {
      setPreviousSessions((prev) => {
        const alreadyExists = prev?.find(
          (session) => session.handle === handle
        );
        if (alreadyExists) {
          return prev;
        }
        return [...(prev ?? []), { handle }];
      });
    },
    [setPreviousSessions]
  );

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
        <ModalDescription>Provide your handle to continue</ModalDescription>
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
            />
            <InputGroupAddon align="inline-end" className="text-primary">
              .climateai.org
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
              if (suffix !== "climateai.org") {
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
        
        {/* <div className="flex flex-col gap-1">
          <span className="text-sm">Enter your password</span>
          <InputGroup>
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSigningIn}
            />
          </InputGroup>
        </div>

        <div className="flex items-center gap-2 text-sm mt-4">
          <Switch
            checked={
              // If the handle is in the previous sessions, then the switch should be checked
              previousSessions.find(
                (session) => session.handle === inputHandlePrefix
              )
                ? true
                : rememberMe
            }
            onCheckedChange={setRememberMe}
            disabled={
              isSigningIn ||
              previousSessions.find(
                (session) => session.handle === inputHandlePrefix
              ) !== undefined
            }
          />
          <span>Remember me</span>
        </div> */}

        
        <p className="text-sm text-muted-foreground mt-4">
          You'll be redirected to your ATProto provider to authenticate.
        </p>
      </div>
      <ModalFooter>
        {signInError && (
          <span className="text-sm text-destructive">
            {signInError instanceof Error ? signInError.message : 'Failed to initiate login'}
          </span>
        )}
        <Button
          disabled={inputHandlePrefix === "" || isRedirecting}
          onClick={() => handleSignIn(inputHandlePrefix)}
        >
          {isRedirecting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Redirecting...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SignInModal;
