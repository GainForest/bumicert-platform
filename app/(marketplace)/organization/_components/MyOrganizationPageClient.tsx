"use client";
import AtprotoSignInButton from "@/components/global/Header/AtprotoSignInButton";
import Container from "@/components/ui/container";
import { CircleAlert, Loader2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAtprotoStore } from "@/components/stores/atproto";

const MyOrganizationPageClient = () => {
  const auth = useAtprotoStore((state) => state.auth);
  const router = useRouter();

  const myOrganizationPageUrl = useMemo(() => {
    return auth.user?.did ? `/organization/${auth.user.did}` : null;
  }, [auth.user]);

  useEffect(() => {
    if (myOrganizationPageUrl) {
      router.push(myOrganizationPageUrl);
    }
  }, [myOrganizationPageUrl, router]);
  return (
    <Container>
      <div className="w-full h-40 flex flex-col items-center justify-center gap-1 bg-muted/50 rounded-lg mt-2">
        {auth.status === "UNAUTHENTICATED" ?
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
              {auth.status === "RESUMING" ? "Loading" : "Redirecting"}
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

export default MyOrganizationPageClient;
