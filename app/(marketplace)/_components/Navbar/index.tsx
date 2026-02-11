"use client";
import { NavbarContextProvider } from "@/components/global/Navbar/context";
import NavbarLayout from "@/components/global/Navbar/NavbarLayout";
import React from "react";
import { navLinks, footerLinks } from "./data";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavbarContextProvider>
      <NavbarLayout
        desktopNavbarProps={{
          navLinks,
          footerLinks,
          title: "Bumicerts",
        }}
        mobileNavbarProps={{
          navLinks,
          footerLinks,
        }}
      >
        {children}
      </NavbarLayout>
    </NavbarContextProvider>
  );
};

export default Navbar;
