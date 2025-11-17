"use client";
import { useHeaderContext } from "@/components/providers/HeaderProvider";
import React, { useEffect } from "react";

const LeftContent = () => {
  return null;
};

const RightContent = () => {
  return null;
};

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<LeftContent />);
    setRightContent(<RightContent />);
    setSubHeaderContent(null);
  }, []);

  return null;
};

export default HeaderContent;
