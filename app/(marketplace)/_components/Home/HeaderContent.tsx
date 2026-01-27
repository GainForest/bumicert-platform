"use client";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useEffect } from "react";

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<Breadcrumbs items={[{ label: "Home" }]} />);
    setRightContent(null);
    setSubHeaderContent(null);
  }, [setLeftContent, setRightContent, setSubHeaderContent]);

  return null;
};

export default HeaderContent;
