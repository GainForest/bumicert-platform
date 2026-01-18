"use client";
import { NavbarContextProvider } from "@/components/global/Navbar/context";
import NavbarLayout from "@/components/global/Navbar/NavbarLayout";
import React from "react";
import { navLinks, footerLinksForUploadPlatform } from "../Navbar/data";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavbarContextProvider>
      <NavbarLayout
        desktopNavbarProps={{
          navLinks,
          footerLinks: footerLinksForUploadPlatform,
          title: "Upload",
        }}
        mobileNavbarProps={{
          navLinks,
          footerLinks: footerLinksForUploadPlatform,
        }}
      >
        {children}
      </NavbarLayout>
    </NavbarContextProvider>
  );
};

export default Navbar;
