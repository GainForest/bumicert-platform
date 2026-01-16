"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import React, { useEffect } from "react";

const LayersHeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(null);
    setRightContent(null);
    setSubHeaderContent(null);
  }, []);

  return null;
};

export default LayersHeaderContent;
