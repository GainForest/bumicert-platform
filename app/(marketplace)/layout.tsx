import React from "react";
import Navbar from "./_components/Home/Navbar";

const MarketplaceLayout = ({ children }: { children: React.ReactNode }) => {
  return <Navbar>{children}</Navbar>;
};

export default MarketplaceLayout;
