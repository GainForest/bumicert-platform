"use client";
import AtprotoSignInButton from "@/components/global/Header/AtprotoSignInButton";
import { useAtproto } from "@/components/providers/AtprotoProvider";
import Container from "@/components/ui/container";
import { CircleAlert, Loader2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MyOrganizationPage = () => {
  const { isReady, isAuthenticated, agent } = useAtproto();
  const router = useRouter();

  const myOrganizationPageUrl = useMemo(() => {
    return agent?.did ? `/organization/${agent.did}` : null;
  }, [agent?.did]);

  useEffect(() => {
    if (myOrganizationPageUrl) {
      router.push(myOrganizationPageUrl);
    }
  }, [myOrganizationPageUrl, router]);
  return (
    <Container>
      <div className="w-full h-40 flex flex-col items-center justify-center gap-1 bg-muted/50 rounded-lg mt-2">
        {isReady && !isAuthenticated ?
          <>
            <CircleAlert className="size-5 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              You are not signed in.
            </span>
            <AtprotoSignInButton />
          </>
        : <>
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {isReady ? "Redirecting" : "Loading"}
              ...
            </span>
            {myOrganizationPageUrl && (
              <span className="text-foreground">
                Click{" "}
                <Link
                  href={myOrganizationPageUrl}
                  className="text-primary underline"
                >
                  here
                </Link>{" "}
                if you are not redirected.
              </span>
            )}
          </>
        }
      </div>
    </Container>
  );
};

export default MyOrganizationPage;
