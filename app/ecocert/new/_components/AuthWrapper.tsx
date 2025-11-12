"use client";
import Container from "@/components/ui/container";
import ErrorPage from "@/components/error-page";
import React from "react";
import { useAtprotoStore } from "@/components/stores/atproto";
import { BuildingIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AtprotoSignInButton from "@/components/global/Header/AtprotoSignInButton";
import { trpcClient } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const AuthWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const auth = useAtprotoStore((state) => state.auth);

  const {
    isPending: isPendingOrganizationInfo,
    error: organizationInfoError,
    isPlaceholderData: isOlderData,
  } = useQuery({
    queryKey: ["organizationInfo", auth.user?.did],
    queryFn: async () => {
      const response = await trpcClient.organizationInfo.get.query({
        did: auth.user?.did ?? "",
      });
      if (!response.success) {
        throw new Error(response.humanMessage);
      }
      return response.data.value;
    },
    enabled: !!auth.user?.did,
  });

  const isLoadingOrganizationInfo = isPendingOrganizationInfo || isOlderData;
  const isAuthenticated = auth.status === "AUTHENTICATED";
  const isUnauthenticated = auth.status === "UNAUTHENTICATED";
  const isResuming = auth.status === "RESUMING";
  const hasOrganizationError = !!organizationInfoError;
  const isContentReady =
    isAuthenticated && !isLoadingOrganizationInfo && !hasOrganizationError;
  const shouldShowOverlay = !isContentReady;

  const renderOverlayContent = () => {
    if (isUnauthenticated || hasOrganizationError) {
      return (
        <ErrorPage
          title={
            isUnauthenticated ?
              "You are not signed in."
            : "Your organization is not set up yet."
          }
          description={
            isUnauthenticated ?
              "Please sign in to create an ecocert."
            : "Please complete your organization information to create an ecocert."
          }
          showRefreshButton={false}
          cta={
            isUnauthenticated ?
              <AtprotoSignInButton />
            : <Link href={`/organization/${auth.user?.did}`}>
                <Button>
                  <BuildingIcon />
                  View my organization
                </Button>
              </Link>
          }
        />
      );
    }

    if (isResuming || isLoadingOrganizationInfo) {
      return (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-primary" />
          <span className="text-muted-foreground font-medium mt-2">
            Please wait...
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="w-full relative">
      <Container
        className={cn(
          isContentReady ? "" : "opacity-70 blur-lg pointer-events-none",
          className
        )}
      >
        {children}
      </Container>

      {shouldShowOverlay && (
        <motion.div
          className="absolute top-10 bottom-0 left-[50%] translate-x-[-50%] w-full"
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          transition={{ duration: 0.3 }}
        >
          <Container>{renderOverlayContent()}</Container>
        </motion.div>
      )}
    </section>
  );
};

export default AuthWrapper;
