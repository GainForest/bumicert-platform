"use client";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import { HandHeart, ArrowUpRight, Copy, Check } from "lucide-react";
import React, { useEffect } from "react";
import useAccount from "@/hooks/use-account";
import Link from "next/link";
import useCopy from "@/hooks/use-copy";

const RightContent = () => {
  const { viewport } = useNavbarContext();
  const { authenticated } = useAccount();
  return (
    <Button
      size={"sm"}
      variant={
        viewport === "mobile"
          ? "default"
          : authenticated
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
  return (
    <div className="flex items-center justify-between gap-2 w-full bg-muted/90 p-2">
      <Link
        href={`https://app.hypercerts.org/hypercerts/${bumicertId}`}
        target="_blank"
        className="text-sm inline-flex items-center gap-1 cursor-pointer"
      >
        <Button size={"sm"} variant={"link"} className="cursor-pointer">
          View in Hypercerts App
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

const HeaderContent = ({ bumicertId }: { bumicertId: string }) => {
  const { setRightContent, setSubHeaderContent } = useHeaderContext();

  useEffect(() => {
    setRightContent(<RightContent />);
    setSubHeaderContent(<SubHeaderContent bumicertId={bumicertId} />);
  }, []);

  return null;
};

export default HeaderContent;
