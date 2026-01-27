import React from "react";
import Navbar from "@/app/(marketplace)/_components/Home/Navbar";

const UploadLayout = ({ children }: { children: React.ReactNode }) => {
  return <Navbar>{children}</Navbar>;
};

export default UploadLayout;
