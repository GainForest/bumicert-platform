"use client";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useFormStore } from "../form-store";
import { useAtprotoStore } from "@/components/stores/atproto";

const RightContent = () => {
  const isHydrated = useFormStore((state) => state.isHydrated);
  const auth = useAtprotoStore((state) => state.auth);
  if (!isHydrated || !auth.authenticated) return null;
  return <Button size={"sm"}>Save as Draft</Button>;
};

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(null);
    setRightContent(<RightContent />);
    setSubHeaderContent(null);
  }, []);

  return null;
};

export default HeaderContent;
