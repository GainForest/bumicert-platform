"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import React, { useEffect } from "react";

const AudioHeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(null);
    setRightContent(null);
    setSubHeaderContent(null);
  }, []);

  return null;
};

export default AudioHeaderContent;
