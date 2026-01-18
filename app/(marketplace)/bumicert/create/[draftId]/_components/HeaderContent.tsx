"use client";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useFormStore } from "../form-store";
import { useAtprotoStore } from "@/components/stores/atproto";
import StepHeader from "./StepProgress";

const RightContent = () => {
  const isHydrated = useFormStore((state) => state.isHydrated);
  const auth = useAtprotoStore((state) => state.auth);
  if (!isHydrated || !auth.authenticated) return null;
  return (
    <Button size={"sm"} disabled>
      Save as Draft
    </Button>
  );
};

const SubHeaderContent = () => {
  const isHydrated = useFormStore((state) => state.isHydrated);
  if (!isHydrated) return null;
  return (
    <div className="w-full pt-1">
      <StepHeader />
    </div>
  );
};

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(null);
    setRightContent(<RightContent />);
    setSubHeaderContent(<SubHeaderContent />);
  }, []);

  return null;
};

export default HeaderContent;
