"use client";
import React from "react";
import PrivyProvider from "./PrivyProvider";
import { DialogProvider } from "../shared/dialogs";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider>
      <DialogProvider>{children}</DialogProvider>
    </PrivyProvider>
  );
};

export default Providers;
