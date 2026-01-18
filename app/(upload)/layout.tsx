import { NavbarContextProvider } from "@/components/global/Navbar/context";
import NavbarLayout from "@/components/global/Navbar/NavbarLayout";
import React from "react";
import Navbar from "./_components/Navbar";

const UploadLayout = ({ children }: { children: React.ReactNode }) => {
  return <Navbar>{children}</Navbar>;
};

export default UploadLayout;
