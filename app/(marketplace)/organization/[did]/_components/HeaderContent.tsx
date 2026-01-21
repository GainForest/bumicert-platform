"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Check, Pencil, X } from "lucide-react";
import { useAtprotoStore } from "@/components/stores/atproto";
import Link from "next/link";

const LeftContent = () => {
  return null;
};

const RightContent = ({ did }: { did: string }) => {
  const auth = useAtprotoStore((state) => state.auth);

  if (auth.status !== "AUTHENTICATED" || auth.user.did !== did) {
    return null;
  }
  return (
    <div className="flex items-center gap-1">
      <Link href={`/upload/organization/${did}`}>
        <Button size={"sm"}>Manage Organization</Button>
      </Link>
    </div>
  );
};

const SubHeaderContent = () => {
  return null;
};
const HeaderContent = ({ did }: { did: string }) => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<LeftContent />);
    setRightContent(<RightContent did={did} />);
    setSubHeaderContent(<SubHeaderContent />);
  }, []);

  return null;
};

export default HeaderContent;
