"use client";
import { NavbarContextProvider } from "@/components/global/Navbar/context";
import NavbarLayout from "@/components/global/Navbar/NavbarLayout";
import React from "react";
import { navLinks, footerLinksForUploadPlatform } from "../Navbar/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavbarContextProvider>
      <NavbarLayout
        desktopNavbarProps={{
          navLinks,
          footerLinks: [],
          title: "Upload",
          banner: <div className="bg-background border border-border rounded-lg p-2 w-full">
            <div className="flex items-center justify-center">
              <span className="font-serif font-bold flex items-center">See other <Image src="/assets/media/images/logo.svg" alt="Bumicerts" width={20} height={20} /> apps</span>
            </div>
            <ul className="flex flex-col w-full mt-2 gap-0.5">
              <Button variant="secondary" className="w-full justify-between">Bumicerts Home
                <ArrowRight />
              </Button>
              <Button variant="secondary" className="w-full justify-between">Green Globe
                <ArrowUpRight />
              </Button>
            </ul>
          </div>
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
