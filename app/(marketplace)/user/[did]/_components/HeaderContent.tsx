"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useEffect } from "react";

const HeaderContent = ({ did }: { did?: string }) => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    const shortDid = did ? `${did.slice(0, 12)}...` : "User";
    setLeftContent(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: shortDid },
        ]}
      />
    );
    setRightContent(null);
    setSubHeaderContent(null);
  }, [did, setLeftContent, setRightContent, setSubHeaderContent]);

  return null;
};

export default HeaderContent;
