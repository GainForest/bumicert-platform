"use client";
import { useNavbarContext } from "@/components/global/Navbar/context";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import {
  BadgePlus,
} from "lucide-react";
import React, { Suspense, useEffect } from "react";
import { useAtprotoStore } from "@/components/stores/atproto";
import Link from "next/link";
import { links } from "@/lib/links";

const RightContent = () => {
  const { viewport } = useNavbarContext();
  const auth = useAtprotoStore((state) => state.auth);
  return (
    <Link href={links.bumicert.create}>
      <Button
        size={"sm"}
        variant={
          viewport === "mobile"
            ? "default"
            : auth.status === "AUTHENTICATED"
            ? "default"
            : "outline"
        }
      >
        <BadgePlus />
        <span className="inline min-[48.01rem]:max-[54rem]:hidden max-[28rem]:hidden">
          Create Bumicert
        </span>
      </Button>
    </Link>
  );
};

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(null);
    setRightContent(
      <Suspense>
        <RightContent />
      </Suspense>
    );
    setSubHeaderContent(null);
  }, []);

  return null;
};

export default HeaderContent;
