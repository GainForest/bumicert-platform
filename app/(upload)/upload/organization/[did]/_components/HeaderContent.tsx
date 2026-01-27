"use client";

import { useHeaderContext } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import React, { useEffect } from "react";

const HeaderContent = () => {
  const { setLeftContent, setRightContent, setSubHeaderContent } =
    useHeaderContext();

  useEffect(() => {
    setLeftContent(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Organization" },
        ]}
      />
    );
    setRightContent(null);
    setSubHeaderContent(null);
  }, []);

  return null;
};

export default HeaderContent;
