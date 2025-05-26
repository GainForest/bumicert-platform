"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useAccount, useSignMessage } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);

  const handleSignMessage = async () => {
    try {
      setIsSigning(true);

      if (!address) throw new Error("No wallet connected");
      const message = `Login to Green Globe App`;
      
      const signature = await signMessageAsync({ message });

      // Send to backend
      const response = await axios.post("http://localhost:8000/api/auth/privy/", {
        wallet_address: address,
        signature,
        message,
      });

      if (response.data.token) {
        localStorage.setItem("jwt", response.data.token);
      }

      console.log("Signature successful!", response.data);
    } catch (error) {
      console.error("Signature failed:", error);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Welcome to Green Globe</h1>
        
        {isConnected ? (
          <Button 
            onClick={handleSignMessage}
            disabled={isSigning}
            className="w-full"
          >
            {isSigning ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Signing Message...
              </>
            ) : (
              "Sign Message"
            )}
          </Button>
        ) : (
          <p className="text-center text-muted-foreground">
            Please connect your wallet to continue
          </p>
        )}
      </div>
    </div>
  );
}
