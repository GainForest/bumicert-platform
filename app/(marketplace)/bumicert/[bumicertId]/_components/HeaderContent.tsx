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

const ShareButton = () => {
  const { copy, isCopied } = useCopy();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  return (
    <Button size="sm" variant="outline" onClick={() => copy(shareUrl)}>
      {isCopied ? <Check /> : <Share2 />}
      {isCopied ? "Copied" : "Share"}
    </Button>
  );
};

const RightContent = () => {
  // const { viewport } = useNavbarContext();
  // const auth = useAtprotoStore((state) => state.auth);
  return null;
  // return (
  //   <div className="flex items-center gap-2">
  //     <ShareButton />
  //     {/* <Button
  //       size={"sm"}
  //       variant={
  //         viewport === "mobile"
  //           ? "default"
  //           : auth.authenticated
  //           ? "default"
  //           : "outline"
  //       }
  //     >
  //       <HandHeart />
  //       <span className="inline">Buy a fraction</span>
  //     </Button> */}
  //   </div>
  // );
};

const SubHeaderContent = ({ bumicertId }: { bumicertId: string }) => {
  const [did, rkey] = bumicertId.split("-");
  const nsid: OrgHypercertsClaimActivity.Main["$type"] =
    "org.hypercerts.claim.activity";
  const aturi = `at://${did}/${nsid}/${rkey}`;
  return (
    <div className="flex items-center justify-between gap-2 w-full bg-foreground/5 px-2 py-1">
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
      <ShareButton />
    </div>
  );
};

const HeaderContent = ({ bumicertId }: { bumicertId: string }) => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(null);
    setRightContent(<RightContent />);
    setSubHeaderContent(<SubHeaderContent bumicertId={bumicertId} />);
  }, []);

  return null;
};

export default HeaderContent;
