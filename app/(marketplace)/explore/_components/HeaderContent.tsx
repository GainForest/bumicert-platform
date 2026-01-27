"use client";

import { useNavbarContext } from "@/components/global/Navbar/context";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";
import React, { Suspense, useEffect } from "react";
import { useAtprotoStore } from "@/components/stores/atproto";
import Link from "next/link";
import { links } from "@/lib/links";

const LeftContent = () => {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Explore" },
      ]}
    />
  );
};

const RightContent = () => {
  const { viewport } = useNavbarContext();
  const auth = useAtprotoStore((state) => state.auth);
  
  return (
    <Link href={links.bumicert.create}>
      <Button
        size="sm"
        variant={
          viewport === "mobile"
            ? "default"
            : auth.status === "AUTHENTICATED"
            ? "default"
            : "outline"
        }
      >
        <BadgePlus className="size-4" strokeWidth={1.5} />
        <span className="hidden sm:inline ml-1">Create Bumicert</span>
      </Button>
    </Link>
  );
};

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<LeftContent />);
    setRightContent(
      <Suspense>
        <RightContent />
      </Suspense>
    );
    setSubHeaderContent(null);
  }, [setLeftContent, setRightContent, setSubHeaderContent]);

  return null;
};

export default HeaderContent;
