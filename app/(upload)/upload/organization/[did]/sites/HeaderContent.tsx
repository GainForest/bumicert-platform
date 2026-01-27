"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import React, { useEffect } from "react";
import { OrganizationHeaderNav } from "../_components/OrganizationNav";

const SitesHeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(<OrganizationHeaderNav />);
    setRightContent(null);
    setSubHeaderContent(null);
  }, []);

  return null;
};

export default SitesHeaderContent;
