"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { useEffect } from "react";

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(null);
    setRightContent(null);
    setSubHeaderContent(null);
  }, [setLeftContent, setRightContent, setSubHeaderContent]);

  return null;
};

export default HeaderContent;
