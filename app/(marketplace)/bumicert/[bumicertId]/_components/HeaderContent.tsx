"use client";
// import { useNavbarContext } from "@/components/global/Navbar/context";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check, Share2 } from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import useCopy from "@/hooks/use-copy";
// import { useAtprotoStore } from "@/components/stores/atproto";
import { OrgHypercertsClaimActivity } from "gainforest-sdk/lex-api";

const RightContent = ({ bumicertId }: { bumicertId: string }) => {
  // const { viewport } = useNavbarContext();
  // const auth = useAtprotoStore((state) => state.auth);
  const { copy, isCopied } = useCopy();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => copy(shareUrl || bumicertId)}
      >
        {isCopied ? (
          <>
            <Check className="size-4" strokeWidth={1.5} />
            Copied
          </>
        ) : (
          <>
            <Share2 className="size-4" strokeWidth={1.5} />
            Share
          </>
        )}
      </Button>
      {/* <Button
        size={"sm"}
        variant={
          viewport === "mobile"
            ? "default"
            : auth.authenticated
            ? "default"
            : "outline"
        }
      >
        <HandHeart />
        <span className="inline">Buy a fraction</span>
      </Button> */}
    </div>
  );
};

const SubHeaderContent = ({ bumicertId }: { bumicertId: string }) => {
  const { copy, isCopied } = useCopy();
  const [did, rkey] = bumicertId.split("-");
  const nsid: OrgHypercertsClaimActivity.Main["$type"] =
    "org.hypercerts.claim.activity";
  const aturi = `at://${did}/${nsid}/${rkey}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  return (
    <div className="flex items-center justify-between gap-2 w-full bg-background/80 backdrop-blur-md border-b border-border/50 p-2">
      <Link
        href={`https://pdsls.dev/${aturi}`}
        target="_blank"
        className="text-sm inline-flex items-center gap-1 cursor-pointer"
      >
        <Button size={"sm"} variant={"link"} className="cursor-pointer">
          View on PDSls
          <ArrowUpRight />
        </Button>
      </Link>
      <Button size={"sm"} variant={"outline"} onClick={() => copy(shareUrl)}>
        {isCopied ? (
          <>
            <Check className="size-4" strokeWidth={1.5} />
            Copied
          </>
        ) : (
          <>
            <Share2 className="size-4" strokeWidth={1.5} />
            Share
          </>
        )}
      </Button>
    </div>
  );
};

const HeaderContent = ({ bumicertId }: { bumicertId: string }) => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(null);
    setRightContent(<RightContent bumicertId={bumicertId} />);
    setSubHeaderContent(<SubHeaderContent bumicertId={bumicertId} />);
  }, []);

  return null;
};

export default HeaderContent;
