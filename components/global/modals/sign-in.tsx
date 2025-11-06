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
import { Loader2, LockIcon, X } from "lucide-react";
import useLocalStorage from "use-local-storage";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useModal } from "@/components/ui/modal/context";
import { api } from "@/lib/trpc/react";
import { useAtprotoStore } from "@/components/stores/atproto";
import AuthenticatedModalContent from "./authenticated";

export const SignInModalId = "auth/sign-in";

const SignInModal = ({ initialHandle = "" }: { initialHandle?: string }) => {
  const [handlePrefix, setHandlePrefix] = useState(initialHandle);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const { popModal, stack, hide } = useModal();
  const isAuthenticated = useAtprotoStore((state) => state.auth.authenticated);
  const setAuth = useAtprotoStore((state) => state.setAuth);
  const {
    mutate: signIn,
    isPending: isSigningIn,
    error: signInError,
  } = api.auth.login.useMutation({
    onSuccess: (data) => {
      addPreviousSession(data.context.handle);
      setAuth(data.context, data.service as string);

      // Pop all auth modals from the stack and hide if there
      const stackCopy = structuredClone(stack);
      while (stackCopy.length > 1) {
        if (stackCopy.at(-1)?.startsWith("auth/")) {
          stackCopy.pop();
          popModal();
        } else {
          break;
        }
      }

      // After popping all consecutive auth modals, if the last modal on stack
      // is an auth modal, then hide the modal.
      const shouldHideModal =
        stackCopy.at(-1)?.startsWith("auth/") ? true : false;
      if (shouldHideModal) hide();
    },
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
    return <AuthenticatedModalContent message="You are already signed in." />;
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
              placeholder="john-doe"
              value={handlePrefix}
              onChange={(e) => setHandlePrefix(e.target.value)}
              disabled={isSigningIn}
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
                    handlePrefix === prefix && "border border-primary/50"
                  )}
                  key={session.handle}
                >
                  <button
                    className={cn(
                      "flex items-center gap-2 justify-between h-8 rounded-md px-2 py-1 w-full cursor-pointer"
                    )}
                    disabled={isSigningIn}
                    onClick={() => {
                      setHandlePrefix(`${handlePrefix}`);
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
        <div className="flex flex-col gap-1">
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
              (
                previousSessions.find(
                  (session) => session.handle === handlePrefix
                )
              ) ?
                true
              : rememberMe
            }
            onCheckedChange={setRememberMe}
            disabled={
              isSigningIn ||
              previousSessions.find(
                (session) => session.handle === handlePrefix
              ) !== undefined
            }
          />
          <span>Remember me</span>
        </div>
      </div>
      <ModalFooter>
        <span className="text-sm text-destructive">{signInError?.message}</span>
        <Button
          disabled={handlePrefix === "" || isSigningIn}
          onClick={() => {
            signIn({
              handlePrefix: handlePrefix.split(".")[0],
              service: "climateai.org",
              password: password,
            });
          }}
        >
          {isSigningIn ?
            <Loader2 className="size-4 animate-spin" />
          : "Sign In"}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SignInModal;
