"use client";
import React from "react";
import PrivyProvider from "./PrivyProvider";
import { DialogProvider } from "../shared/dialogs";
import { Providers as WagmiProviders } from "./WagmiProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProviders>
      <PrivyProvider>
        <DialogProvider>{children}</DialogProvider>
      </PrivyProvider>
    </WagmiProviders>
  );
};

export default Providers;
