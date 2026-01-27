"use client";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { HandHeart, ArrowUpRight, Copy, Check } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import useCopy from "@/hooks/use-copy";
import { useAtprotoStore } from "@/components/stores/atproto";
import { OrgHypercertsClaimActivity } from "climateai-sdk/lex-api";

const RightContent = () => {
  const { viewport } = useNavbarContext();
  const auth = useAtprotoStore((state) => state.auth);
  return (
    <Button
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
    </Button>
  );
};

const SubHeaderContent = ({ bumicertId }: { bumicertId: string }) => {
  const { copy, isCopied } = useCopy();
  const [did, rkey] = bumicertId.split("-");
  const nsid: OrgHypercertsClaimActivity.Main["$type"] =
    "org.hypercerts.claim.activity";
  const aturi = `at://${did}/${nsid}/${rkey}`;
  return (
    <div className="flex items-center justify-between gap-2 w-full bg-muted/90 p-2">
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
      <Button size={"sm"} variant={"outline"} onClick={() => copy(bumicertId)}>
        {isCopied ? <Check /> : <Copy />}
        {isCopied
          ? "Copied"
          : `${bumicertId.slice(0, 8)}...${bumicertId.slice(-4)}`}
      </Button>
    </div>
  );
};

const LeftContent = ({ bumicertId }: { bumicertId: string }) => {
  const shortId = `${bumicertId.slice(0, 8)}...`;
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Explore", href: "/explore" },
        { label: shortId },
      ]}
    />
  );
};

const HeaderContent = ({ bumicertId }: { bumicertId: string }) => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<LeftContent bumicertId={bumicertId} />);
    setRightContent(<RightContent />);
    setSubHeaderContent(<SubHeaderContent bumicertId={bumicertId} />);
  }, [bumicertId, setLeftContent, setRightContent, setSubHeaderContent]);

  return null;
};

export default HeaderContent;
