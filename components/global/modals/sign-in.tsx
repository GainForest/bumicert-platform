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
import { Check, Loader2, X } from "lucide-react";
import useLocalStorage from "use-local-storage";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAtproto } from "@/components/providers/AtprotoProvider";
import { useQuery } from "@tanstack/react-query";
import { useModal } from "@/components/ui/modal/context";

export const SignInModalId = "sign-in-modal";

const SignInModal = ({ initialHandle = "" }: { initialHandle?: string }) => {
  const [handle, setHandle] = useState(initialHandle);
  const [rememberMe, setRememberMe] = useState(false);
  const { popModal, stack } = useModal();
  const { isReady, signIn, initializationError, isAuthenticated } =
    useAtproto();

  const {
    data: isSignInSuccess,
    isLoading: isSigningIn,
    error: signInError,
    refetch: handleSignIn,
  } = useQuery({
    queryKey: ["sign-in", handle],
    queryFn: async () => {
      addPreviousSession(handle);
      return await signIn(handle);
    },
    enabled: false,
  });

  const [previousSessions, setPreviousSessions] = useLocalStorage<
    { handle: string }[]
  >("previous-sessions", []);

  const addPreviousSession = useCallback((handle: string) => {
    setPreviousSessions((prev) => {
      const alreadyExists = prev?.find((session) => session.handle === handle);
      if (alreadyExists) {
        return prev;
      }
      return [...(prev ?? []), { handle }];
    });
  }, []);

  if (isAuthenticated) {
    return (
      <ModalContent>
        <ModalHeader>Already Signed In</ModalHeader>
        <ModalDescription>
          You are already signed in to your account.
        </ModalDescription>
      </ModalContent>
    );
  }

  return (
    <ModalContent>
      <ModalHeader
        backAction={
          stack.length === 1 ?
            undefined
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
              placeholder="user.climateai.org"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={!isReady || isSigningIn}
            />
          </InputGroup>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Or choose from previous sessions:</span>
          <div className="w-full p-2 bg-muted rounded-md flex flex-col gap-1">
            {previousSessions.length === 0 && (
              <div className="w-full text-sm text-muted-foreground text-center p-2">
                No previous sessions found.
              </div>
            )}

            {previousSessions.map((session) => {
              return (
                <div className="w-full relative" key={session.handle}>
                  <button
                    className={cn(
                      "flex items-center gap-2 justify-between bg-background rounded-md px-2 py-1 w-full cursor-pointer",
                      handle === session.handle &&
                        "text-primary border border-primary/50"
                    )}
                    disabled={isSigningIn}
                    onClick={() => {
                      setHandle(session.handle);
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
                      disabled={isSigningIn}
                      onClick={() => {
                        setPreviousSessions((prev) => {
                          const newSessions =
                            prev?.filter(
                              (session) => session.handle !== session.handle
                            ) ?? [];
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

        <div className="flex items-center gap-2 text-sm mt-4">
          <Switch
            checked={
              // If the handle is in the previous sessions, then the switch should be checked
              previousSessions.find((session) => session.handle === handle) ?
                true
              : rememberMe
            }
            onCheckedChange={setRememberMe}
            disabled={
              isSigningIn ||
              previousSessions.find((session) => session.handle === handle) !==
                undefined
            }
          />
          <span>Remember me</span>
        </div>
      </div>
      <ModalFooter>
        <span className="text-sm text-destructive">
          {signInError?.message ?? initializationError?.message}
        </span>
        <Button
          disabled={handle === "" || isSigningIn || !isReady}
          onClick={() => {
            handleSignIn();
          }}
        >
          {isSignInSuccess ?
            <Check />
          : isSigningIn || !isReady ?
            <Loader2 className="size-4 animate-spin" />
          : null}
          {!isReady ?
            "Getting ready..."
          : isSignInSuccess ?
            "Signed in successfully"
          : isSigningIn ?
            "Signing in..."
          : "Sign In"}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SignInModal;
