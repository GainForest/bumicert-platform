"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2 } from "lucide-react";
import { useEffect } from "react";
import useCopy from "@/hooks/use-copy";

const RightContent = ({ bumicertId }: { bumicertId: string }) => {
  const { copy, isCopied } = useCopy();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
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
  );
};

const LeftContent = ({ bumicertId }: { bumicertId: string }) => {
  const shortId = `${bumicertId.slice(0, 12)}...`;
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
    setRightContent(<RightContent bumicertId={bumicertId} />);
    setSubHeaderContent(null);
  }, [bumicertId, setLeftContent, setRightContent, setSubHeaderContent]);

  return null;
};

export default HeaderContent;
