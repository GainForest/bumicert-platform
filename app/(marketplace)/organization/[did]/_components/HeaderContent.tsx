"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAtprotoStore } from "@/components/stores/atproto";
import Link from "next/link";

const LeftContent = ({ did }: { did: string }) => {
  const shortDid = `${did.slice(0, 12)}...`;
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Explore", href: "/explore" },
        { label: shortDid },
      ]}
    />
  );
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
    setLeftContent(<LeftContent did={did} />);
    setRightContent(<RightContent did={did} />);
    setSubHeaderContent(<SubHeaderContent />);
  }, [did, setLeftContent, setRightContent, setSubHeaderContent]);

  return null;
};

export default HeaderContent;
